/// <reference path="ParameterValuesTemplate.ts"/>
/// <reference path="ParameterModelItem.ts"/> 
module ParameterValueManager{
	import paramValues = ParameterValuesTemplate;
	
	export function generateJSON(parameterModelItems: ParameterModelItem[]){		
		var template = new paramValues.DeploymentParameters();
		template.$schema = "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentParameters.json";
		template.contentVersion = "1.0.0.0";
		template.parameters = {p: paramValues.Parameter};
		parameterModelItems.forEach(param =>{
			template.parameters[param.name] = new paramValues.Parameter(param.value);
		})
		
		var json = JSON.stringify(template, null, 2);
		
		//Uses this file saver: https://github.com/Teleborder/FileSaver.js 
      	var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      	(<any>window).saveAs(blob, 'ARMTemplate.params.json');
	}
}