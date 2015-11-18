//Expression reference: https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-functions/

/// <reference path="DependencyId.ts" />

module ArmViz {
	export class ExpressionEvaluator {
		//Finds the dependency ID for an expression
		//If the expression is a resourceId, an ID and Name is returned
		//If the expression is a concat or anything else, an ID is returned
		static resolveDependsOnId(expression:Expression):DependencyId {
			let ret = new DependencyId();
			
			let params = new Array<string>();
			for(let i = 0; i < expression.operands.length; i++) {
				if(expression.operands[i] instanceof Expression) {
					params.push((<Expression>expression.operands[i]).convertToString());
				} else {		
					params.push(<string>expression.operands[i]);
				}
			}
			
			if(expression.operator === 'resourceId') {
				/*
				Example:
				[resourceId('Microsoft.AppService/gateways', concat(parameters('endpointName'),'gateway'))]
				
				Matches:
				type: "Microsoft.Storage/storageAccounts"
				name: "[concat(parameters('endpointName'),'gateway')]"
				*/
				
				ret.type = params[0];
				ret.name = params.slice(1).join(",");
			} else if(expression.operator === 'concat') {
				/*
				Example:
				[concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]
				
				Matches:
				type: "Microsoft.Storage/storageAccounts"
				name: "[parameters('storageAccountName')]"
				*/
				
				ret.type = params[0];
				if(ret.type.charAt(ret.type.length-1) === '/') {
					ret.type = ret.type.substr(0, ret.type.length - 1);
				}
				
				for(let i = 1; i < params.length; i++) {
					if(params[i].charAt(0) === "'") {
						params[i] = params[i].substr(1, params[i].length-2);
					}
				}
				ret.name = params.slice(1).join(',');
			} else if(expression.source.indexOf("/") !== expression.source.lastIndexOf("/")) {
				/*
				Example: Microsoft.Resources/deployments/VNet
				*/
				
				ret.type = expression.source.substr(0, expression.source.lastIndexOf("/"));
				ret.name = expression.source.substr(expression.source.lastIndexOf("/") + 1);
			} else {
				console.error("Unsupported expression type:" + expression.source);
			}

			return ret;
		}
	}
}