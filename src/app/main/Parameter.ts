module ArmViz {
	export class Parameter {
    name: string;
		type: string;
		defaultValue: string;
		allowedValues: string[];
    
    constructor(name:string, type:string) {
      this.name = name;
      this.type = type;
    }
	}
}