/// <reference path="ArmTemplate.ts" />
/// <reference path="ExpressionParser.ts" />

//Expression reference: https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-functions/

class ExpressionEvaluator{
	private armTemplate:ArmTemplateInterface;
	
	constructor(armTemplate:ArmTemplateInterface) {
		this.armTemplate = armTemplate;
	}
	
	/*
		Examples:
		[variables('numberOfInstances')]
		* [concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]
		[parameters('region')]
		[concat(parameters('vmNamePrefix'), copyIndex())]
		[concat('http://',parameters('storageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/')]
		[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'),copyindex()))]
		[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'), 0))]
	*/
	
	resolveDependsOnId(expression:Expression){
		if(expression.operator !== 'concat') {
			return ''; 
		}
		
		var id = '';
		
		for(var i = 0; i < expression.operands.length; i++) {
			var operand = expression.operands[i];
			
			if(operand instanceof Expresssion) {
				id += operand.convertToString();
			} else {
				id += operand;
			}
		}
	}
	
	evaluateExpression(expression:Expression) {
		throw new Error('Not supported');
	}
}


 "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageAccountName')]",
   
   
   [concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",