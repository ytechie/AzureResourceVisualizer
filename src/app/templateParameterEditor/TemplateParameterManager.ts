/// <reference path="../main/ArmTemplate.ts" />
/// <reference path="../main/Parameter.ts" />

module TemplateParameterEditor {
	export class TemplateParameterManager {
		armTemplate:ArmViz.ArmTemplate;
		
		constructor(armTemplate:ArmViz.ArmTemplate) {
			this.armTemplate = armTemplate
		}
		
		public getParameterNames():string[] {
			return Object.keys(this.armTemplate.parameters)
		}
		
		public getParameterData(propertyName:string):ArmViz.Parameter {
			return this.armTemplate.parameters[propertyName];
		}
	}
}