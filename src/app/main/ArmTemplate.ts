/// <reference path="Resource.ts" />
/// <reference path="Parameter.ts" />
/// <reference path="ExpressionEvaluator.ts" />

interface ArmTemplateInterface {
        contentVersion: string;
        //Note: The parameter elements are keyed by their name
	parameters: Parameter[];
	resources: Resource[];
        variables: any;
}

class ArmTemplate {
        private templateData: ArmTemplateInterface;
        
        constructor(templateData: ArmTemplateInterface) {
                this.templateData = templateData;
        }
	
        
        get resources(): Resource[] {
                return this.templateData.resources;
        }
        
        getDependencies(resource:Resource) {
                var dependencyNames = this.getDependencyNames(resource.dependsOn);
                var dependencies = new Array<Resource>();
                
                dependencyNames.forEach(dependencyName => {
                        this.templateData.resources.forEach(resource => {
                                if(resource.name === dependencyName || Resource.getResourceId(resource) === dependencyName) {
                                        dependencies.push(resource);
                                }     
                        });
                });
                
                return dependencies;
        }
        
	private getDependencyNames(depends:string|string[]) {
                var self = this;
		var ret:string[] = [];
		
                //If we get multiple dependencies, make recursive calls
                if (depends && Array.isArray(depends)) {
                    var dependsArray:string[] = <string[]>depends;
                    
                    dependsArray.forEach(function (dep) {
                        var deps = self.getDependencyNames(dep);
                        if (deps && deps.length > 0) {
                            ret = ret.concat(deps);
                        }
                    });
                } else if(depends) {
                    var dependsString = <string>depends;
                    
                    if (dependsString.indexOf('[') === 0) {
                        var parser = new ExpressionParser();
                        
                        var expression = parser.parse(dependsString.substring(1, dependsString.length - 2));
                        var ee = new ExpressionEvaluator(null);
                        var dependsOnId = ee.resolveDependsOnId(expression);
                        
                        ret.push(dependsOnId);
                    }
                }
		
		return ret;
	}
        
        deleteResource(resource:Resource) {
                for(let i = 0; i < this.templateData.resources.length; i++) {
                        if(this.templateData.resources[i] === resource) {
                                arm.resources.splice(i, 1);
                        }
                }
        }
}