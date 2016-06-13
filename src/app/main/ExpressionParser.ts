module ArmViz {
  export class ExpressionParser {
    parse(expressionText: string): Expression {
      var buffer = '';

      var expression: Expression = new Expression(expressionText);

      var expressionStack = new Array<Expression>();

      if (expressionText.charAt(0) === '[' && expressionText.charAt(expressionText.length - 1) === ']') {
        expressionText = expressionText.substr(1, expressionText.length - 2);
      }

      //An expression could just be a string
      if (expressionText.indexOf('(') < 0) {
        expression.operands.push(expressionText);
        return expression;
      }

      for (var i: number = 0; i < expressionText.length; i++) {
        var ch: string = expressionText.charAt(i);

        if (ch === "'" && buffer.length === 0) {
          //ignore start of operand
        } else if (ch === "'") {
          //ignore
        } else if (ch === " ") {
          //Ignore whitespace here
        } else if (ch === ",") {
          //Comma separated string operands
          if (buffer.length > 0) {
            expression.operands.push(buffer);
            buffer = '';
          }
        } else if (ch === ")") {
          let outerExpression: Expression;

          if (buffer.length > 0) {
            expression.operands.push(buffer);
            buffer = '';
          }

          if (expression !== expressionStack[0]) {
            expressionStack.pop();
            outerExpression = expressionStack[expressionStack.length - 1];
          }
          if (outerExpression) {
            outerExpression.operands.push(expression);
            expression = outerExpression;
          }
        } else if (ch === "(") {
          if (expressionStack.length === 0) {
            expressionStack.push(expression);
          } else {
            expression = new Expression();
            expressionStack.push(expression);
          }

          expression.operator = buffer;
          buffer = '';
        } else {
          buffer += ch;
        }
      }

      return expression;
    }
  }
}
