/// <reference path="Parameter.ts" />

enum ParserState {
	NEW,
	CAPTURE_OPERAND,
	NESTED_EXPRESSION
}

class Expression {
	operator:string = '';
	operands = new Array<Expression | string>();
}

class ExpressionParser {
	parse(expressionText:string):Expression {
		var buffer = '';
		var expression:Expression = new Expression();
		var state:ParserState = ParserState.NEW;
		
		for(var i:number = 0; i < expressionText.length; i++) {
			var ch:string = expressionText.charAt(i);
			
			if(state === ParserState.NEW) {
				if(ch === '(') {
					expression.operator = buffer;
					buffer = '';
				
					state = ParserState.CAPTURE_OPERAND;
				} else {
					buffer += ch;
				}
			} else if(state === ParserState.CAPTURE_OPERAND) {
				if(ch === "'" && buffer.length === 0) {
					//ignore start of operand
				} else if(ch === "'") {
					if(buffer.length > 0) {
						expression.operands.push(buffer);
						buffer = '';
					}
				} else if(ch === " ") {
					//Ignore whitespace here
				} else if(ch === ",") {
					if(buffer.length > 0) {
						expression.operands.push(buffer);
						buffer = '';
					}
				} else if(ch === ")") {
					if(buffer.length > 0) {
						expression.operands.push(buffer);
						buffer = '';
					}
				} else if(ch === "(") {
					buffer += ch;
					state = ParserState.NESTED_EXPRESSION;
				} else {
					buffer += ch;
				}
			} else if(state === ParserState.NESTED_EXPRESSION) {
				if(ch === ')') {
					buffer += ')';
					var nestedExp = this.parse(buffer);
					expression.operands.push(nestedExp);
					buffer = ''
					state = ParserState.CAPTURE_OPERAND;
				} else {
					buffer += ch;
				}
			}
		}
		
		return expression;
	}
}