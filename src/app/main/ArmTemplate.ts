/// <reference path="../../../typings/tsd.d.ts" />

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
                
                constructor(templateData: ArmTemplateInterface) {
                    this.templateData = templateData;

                    if (this.templateData) {
                        // if we have resources, evaluate their names
                        if (this.templateData.resources) {
                            for (let i = 0; i < this.templateData.resources.length; i++) {
                                let ep = new ExpressionParser();
                                let exp = ep.parse(this.templateData.resources[i].name);
                                this.templateData.resources[i].name = this.resolveExpression(exp);
                            }
                        }
                    }
                }
                
                static CreateFromJson(json:string) {
                        var templateData = <ArmTemplateInterface>JSON.parse(json);
                        
                        if(!templateData.contentVersion) {
                                throw new Error('Azure Resource Template JSON did not have a contentVersion property');
                        }
                        
                        if(!templateData.resources) {
                                templateData.resources = new Array<Resource>();
                        }
                        
                        var armTemplate = new ArmTemplate(templateData);
                        
                        return armTemplate;
                }
                
                toJson() {
                        return JSON.stringify(this.templateData, null, 2);
                }
                
                get resources() {
                        if(this.observableResources) {
                                return this.observableResources;
                        } else {
                                this.observableResources = ko.observableArray(this.templateData.resources);
                                return this.observableResources;
                        }
                }
                
                get parameters(): Parameter[] {
                        return this.templateData.parameters;
                }
                
                resolveExpression(expression: Expression): string {
                    let ret = "";

                    if (expression.operator === 'concat') {
                        if (expression.operands.length <= 1) {
                            console.error("invalid operation. At least two values required for operation" + expression.operator);
                        }

                        for (let i = 0; i < expression.operands.length; i++) {
                            if (expression.operands[i] instanceof Expression) {
                                ret += this.resolveExpression(<Expression>expression.operands[i]);
                            } else {
                                ret += <string>expression.operands[i];
                            }
                        }
                    } else if (expression.operator === 'resourceId') {
                        if (expression.operands.length <= 1) {
                            console.error("invalid operation. At least two values required for operation" + expression.operator);
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
                        if (expression.operands.length <= 0) {
                            console.error("no variable name specified");
                        }
                        // return value of requested variable, should probably make sure it exists
                        let templateVar = this.templateData.variables[<string>expression.operands[0]];
                        if (templateVar && !(templateVar instanceof Array)) { //TODO: need ot handle varible that's an array
                            let ep = new ExpressionParser();
                            let exp = ep.parse(this.templateData.variables[<string>expression.operands[0]]);
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
                        
                        if(!resource.dependsOn || resource.dependsOn.length === 0) {
                                return dependencies;
                        }
                        let dependsOn = new Array<string>();
                        if(Array.isArray(resource.dependsOn)) {
                                dependsOn = dependsOn.concat(<string[]>resource.dependsOn);
                        } else {
                                dependsOn.push(<string>resource.dependsOn);
                        }
                         
                        dependsOn.forEach(dependencyName => {
                                let ep = new ExpressionParser();
                                let exp = ep.parse(dependencyName);
                                let dependency = this.resolveDependsOnId(exp);
                                let dependencyFound = false;

                                this.templateData.resources.forEach(resource => {
                                        if(Resource.resourceMatchesDependency(resource, dependency)) {
                                                dependencies.push(resource);
                                                dependencyFound = true;
                                        }
                                });
                                
                                if(!dependencyFound) {
                                    console.warn("Coundn't find a matching dependency for '" + dependencyName + "'");
                                }
                        });
                        
                        return dependencies;
                }
                
                deleteResource(resource:Resource) {
                        this.resources.remove(resource);
                }

                resolveDependsOnId(expression: Expression): DependencyId {
                    let resolvedExpression = this.resolveExpression(expression);

                    let ret = new DependencyId();
                    ret.type = resolvedExpression.substr(0, resolvedExpression.lastIndexOf("/"));
                    ret.name = resolvedExpression.substr(resolvedExpression.lastIndexOf("/") + 1);

                    return ret;
                }


        }
}