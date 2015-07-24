/// <reference path="Resource.ts" />

class ToolboxResource {
	iconName:string;
	friendlyName:string;
	resourceType:string;
	
	constructor(iconName:string, friendlyName:string, resourceName:string) {
		this.iconName = iconName;
		this.friendlyName = friendlyName;
		this.resourceType = resourceName;
	}
}