module ArmViz {	
	export class Expression {
		operator:string = '';
		operands = new Array<Expression | string>();
		
		convertToString() {
			var s = this.operator;
			
			s += '(';
			
			for(var i = 0; i < this.operands.length; i++) {
				var operand = this.operands[i];
				
				if(operand instanceof Expression) {
					s += operand.convertToString();
				} else {
					s += "'" + operand + "'";
				}
				
				if(i < this.operands.length - 1) {
					s += ',';
				}
			}
			
			s += ')';
			
			return s;
		}
	}
}