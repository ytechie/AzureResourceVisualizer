module ArmViz {
	export class Resource {
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
	}
}