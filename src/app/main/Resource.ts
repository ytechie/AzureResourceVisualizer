class Resource {
	type: string;
	name: string;
	apiVersion: string;
	location: string;
	properties: any;
	dependsOn: string | string[];
	
	get id(): string {
		return this.name;
	}
}