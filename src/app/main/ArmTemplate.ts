/// <reference path="../../../typings/index.d.ts" />

module ArmViz {
  export interface ArmTemplateInterface {
    contentVersion: string;
    //Note: The parameter elements are keyed by their name
    parameters: Parameter[];
    resources: Resource[];
    variables: any;
  }

  export class ArmTemplate {
    private templateData: ArmTemplateInterface;
    private observableResources: KnockoutObservableArray<Resource>;
    private resolvedNames: { [name: string]: string };
    private resolveErrors: any[];

    constructor(templateData: ArmTemplateInterface) {
      this.templateData = templateData;
      this.resolvedNames = {};
      this.resolveErrors = [];
    }

    static CreateFromJson(json: string) {
      var templateData = <ArmTemplateInterface>JSON.parse(json);

      if (!templateData.contentVersion) {
        Telemetry.sendEvent('Error', 'TemplateMissingContentVersion');
        throw new Error('Azure Resource Template JSON did not have a contentVersion property');
      }

      if (!templateData.resources) {
        templateData.resources = new Array<Resource>();
      }

      var armTemplate = new ArmTemplate(templateData);

      return armTemplate;
    }

    toJson() {
      return JSON.stringify(this.templateData, null, 2);
    }

    get resources() {
      if (this.observableResources) {
        return this.observableResources;
      } else {
        this.observableResources = ko.observableArray(this.templateData.resources);
        return this.observableResources;
      }
    }

    get parameters(): Parameter[] {
      return this.templateData.parameters;
    }

    get templateDataObj(): ArmTemplateInterface {
      return this.templateData;
    }

    checkResolveErrors() {
      if (this.resolveErrors.length > 0) {
        alert('Sorry we are having trouble parsing this template.\nYou may ignore this and continue editing.');
        this.resolveErrors = [];
      }
    }

    resolveName(name: string): string {
      if (this.resolvedNames[name]) {
        return this.resolvedNames[name];
      }

      try {
        let ep = new ExpressionParser();
        let exp = ep.parse(name);
        this.resolvedNames[name] = this.resolveExpression(exp);
      } catch (error) {
        this.resolveErrors.push(error);
        return name;
      }

      return this.resolvedNames[name];
    }

    resolveExpression(expression: Expression): string {
      let ret = "";

      if (expression.operator === 'concat') {
        if (expression.operands.length < 1) {
          // Note: there might only be one operand. The following two expressions are identical:
          // [concat('Microsoft.Network/networkInterfaces/Nic0')]
          // [concat('Microsoft.Network/networkInterfaces', 'Nic0')]
          console.error("Invalid operation. At least one value required for operation: " + expression.operator);
        }

        for (let i = 0; i < expression.operands.length; i++) {
          if (expression.operands[i] instanceof Expression) {
            ret += this.resolveExpression(<Expression>expression.operands[i]);
          } else {
            ret += <string>expression.operands[i];
          }
        }
      } else if (expression.operator === 'resourceId') {
        if (expression.operands.length < 1) {
          console.error("Invalid operation. At least one value required for operation: " + expression.operator);
        }

        for (let i = 0; i < expression.operands.length; i++) {
          if (expression.operands[i] instanceof Expression) {
            ret += this.resolveExpression(<Expression>expression.operands[i]);
          } else {
            // first parameter of resourceId is resource type
            if (i === 0) {
              // the resource type can optionally end with a '/', make sure we have one if its not present
              let operand = <string>expression.operands[i];
              if (operand.substr(1, operand.length - 1) !== "/") {
                expression.operands[i] = operand + "/";
              }
            }

            ret += <string>expression.operands[i];
          }
        }
      } else if (expression.operator === 'variables') {
        if (expression.operands.length === 0) {
          console.error("no variable name specified");
        }
        if (expression.operands.length > 1) {
          console.error("too many variable names specified");
        }

        let templateVar: Object = this.templateData.variables[<string>expression.operands[0]];
        if (templateVar) {
          for (let property of expression.properties) {
            templateVar = templateVar[property];
          }
          let ep = new ExpressionParser();
          let exp = ep.parse(<string>templateVar);
          ret += this.resolveExpression(exp);
        }
      } else if (expression.operator === 'parameters') {
        if (expression.operands.length <= 0) {
          console.error("no parameter name specified");
        }
        ret += <string>expression.operands[0]; // cheating since we don't have parameters being passed in
      } else { // no matching expression operation, just use the value
        ret += <string>expression.operands[0];
      }

      return ret;
    }

    getDependencies(resource: Resource) {
      var dependencies = new Array<Resource>();

      if (!resource.dependsOn || resource.dependsOn.length === 0) {
        return dependencies;
      }
      let dependsOn = new Array<string>();
      if (Array.isArray(resource.dependsOn)) {
        dependsOn = dependsOn.concat(<string[]>resource.dependsOn);
      } else {
        dependsOn.push(<string>resource.dependsOn);
      }

      dependsOn.forEach(dependencyName => {
        let dependency: DependencyId;
        let dependencyFound = false;

        try {
          let ep = new ExpressionParser();
          let exp = ep.parse(dependencyName);
          dependency = this.resolveDependsOnId(exp);
        } catch (error) {
          this.resolveErrors.push(error);
        }

        this.templateData.resources.forEach(resource => {
          if (dependency && this.resourceMatchesDependency(resource, dependency)) {
            dependencies.push(resource);
            dependencyFound = true;
          }
        });

        if (!dependencyFound) {
          console.warn("Coundn't find a matching dependency for '" + dependencyName + "'");
          Telemetry.sendEvent('Error', 'ResourceNotFound', dependencyName);
        }
      });

      return dependencies;
    }

    deleteResource(resource: Resource) {
      this.resources.remove(resource);
    }

    resolveDependsOnId(expression: Expression): DependencyId {
      let resolvedExpression = this.resolveExpression(expression);

      let ret = new DependencyId();
      ret.type = resolvedExpression.substr(0, resolvedExpression.lastIndexOf("/"));
      ret.name = resolvedExpression.substr(resolvedExpression.lastIndexOf("/") + 1);

      return ret;
    }

    resourceMatchesDependency(resource: Resource, depId: DependencyId): boolean {
      if (!resource || !resource.type || !depId || !depId.type) {
        console.error('Avoided *undefined* in Resource.resourceMatchesDependency');
        return false;
      }

      let typesMatch = resource.type.toUpperCase() === depId.type.toUpperCase();
      let namesMatch = this.resolveName(resource.name).toUpperCase() === depId.name.toUpperCase()
        || this.resolveName(resource.name).toUpperCase() === '[' + depId.name.toUpperCase() + ']';

      return typesMatch && namesMatch;
    }

    parseParametersFromTemplate() {
      var templateJson = this.toJson();
      // parameters('someParameterName') => extracts 'someParameterName'
      var regex = /parameters\(\'([^\']+)\'\)/g;
      var match;
      while (match = regex.exec(templateJson)) {
        this.templateData.parameters[match[1]] = new Parameter(match[1], "string");
        console.log(match[1]);
      }
      console.log(templateJson);
    }
  }
}
