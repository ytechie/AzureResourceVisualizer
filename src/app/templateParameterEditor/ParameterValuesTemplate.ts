module TemplateParameterEditor {

   export class DeploymentParameters implements ParameterValuesTemplateInterface {
    	$schema: string;
    	contentVersion: string;
    	parameters: {p: typeof Parameter};
        // todo: modify constructor with default values for properties
        constructor() {
            // this.$schema = "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentParameters.json#";
            // this.contentVersion = "1.0.0.0";
            // this.parameters = {p: Parameter};
        }
    }
    
    export class Parameter implements ParameterInterface {
    	value: any;
    	//metadata: MetadataInterface;
    	constructor(val: string) {
    		this.value = val;
    		//this.metadata  = md;
    	}
    }
    
    // export class Metadata implements MetadataInterface{
    // 	type: string;
    // 	description: string;
    // 	constructor(type: string, desc?: string){
    // 		this.type = type;
    // 		this.description = desc;
    // 	}
    // }

    export interface ParameterValuesTemplateInterface {
		$schema: string;
    	contentVersion: string;
    	parameters: {p: typeof Parameter};
	}
    

    export interface ParameterInterface {
        value: any; // need to change this later for $ref in schema
        // metadata?: MetadataInterface;
    }

    // export interface MetadataInterface {
    //     type: string;
    //     description?: string;
    // }
    
}