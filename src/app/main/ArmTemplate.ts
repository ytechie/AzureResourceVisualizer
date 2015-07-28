/// <reference path="Resource.ts" />
/// <reference path="Parameter.ts" />

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
                                if(resource.name === dependencyName) {
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
                    
                    if (dependsString.indexOf('[concat(') !== -1) {
                        //We need to parse apart this wonderful string
                        //[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]
        
                        var parts = dependsString.split("'");
        
                        //var type = parts[1].substring(0, parts[1].length - 1);
                        var name = parts[3];
                                                
                        ret.push("[parameters('" + name + "')]");
                    }
                }
		
		return ret;
	}
}