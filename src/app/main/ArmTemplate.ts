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
                
                getDependencies(resource:Resource) {
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
                                let dependency = ExpressionEvaluator.resolveDependsOnId(exp);
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
        }
}