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
		
		var json = JSON.stringify(template);
		
		 var blob = new Blob([json], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
      
        //A typescript guru could probably figure out how to get rid of these errors
      
        a.download = 'ARMTemplate.params.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);	
	}
}