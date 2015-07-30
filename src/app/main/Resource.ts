class Resource {
	type: string;
	name: string;
	apiVersion: string;
	location: string;
	properties: any;
	dependsOn: string | string[];
	
	get id(): string {
		var id = this.type + '/';
		
		if(this.name.charAt(0) === '[') {
			id += this.name.substring(1, this.name.length - 2);
		} else {
			id += this.name;
		}
	}
}