/// <reference path="ExpressionParser.ts" />
/// <reference path="ExpressionEvaluator.ts" />

class Resource {
	type: string;
	name: string;
	apiVersion: string;
	location: string;
	properties: any;
	dependsOn: string | string[];
	
	constructor(toolboxItem?:ToolboxResource) {
		if(toolboxItem) {
			this.type = toolboxItem.resourceType;
			this.name = toolboxItem.friendlyName;
		}
	}
	
	static getResourceId(resource:Resource) {
		var id = resource.type + '/';
		
		if(resource.name.charAt(0) === '[') {
			//We have an expression
			
			let ep = new ExpressionParser();
			let exp = ep.parse(resource.name);
			let ee = new ExpressionEvaluator(null);
			id += ee.resolveDependsOnId(exp);
		} else {
			id += resource.name;
		}
		
		return id;
	}
}