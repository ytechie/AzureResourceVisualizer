//Expression reference: https://azure.microsoft.com/en-us/documentation/articles/resource-group-template-functions/

module ArmViz {
	export class ExpressionEvaluator{
		constructor(private armTemplate:ArmTemplate) {
		}
		
		resolveDependsOnId(expression:Expression){
			if(expression.operator !== 'concat') {
				return expression.convertToString();
			}
			
			var id = '';
			
			for(var i = 0; i < expression.operands.length; i++) {
				var operand = expression.operands[i];
				
				if(operand instanceof Expression) {
					id += operand.convertToString();
				} else {
					id += operand;
				}
			}
			
			return id;
		}
		
		evaluateExpression(expression:Expression) {
			throw new Error('Not supported');
		}
	}
}