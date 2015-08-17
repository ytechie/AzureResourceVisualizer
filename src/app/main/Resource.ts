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
			id += resource.name.substring(1, resource.name.length - 1);
		} else {
			id += resource.name;
		}
		
		return id;
	}
}