module ArmViz {
  export class ExpressionParser {
    parse(source: string): Expression {
      let pre = '';
      let buffer = '';
      let isProperty = false;
      let exp: Expression = null;
      let expStack: Expression[] = [];

      // Trim square brackets
      if (source[0] === '[' && source[source.length - 1] === ']') {
        source = source.substr(1, source.length - 2);
      }

      // An expression could just be a string
      if (source.indexOf('(') < 0) {
        exp = new Expression();
        exp.operands.push(source);
        return exp;
      }

      // Parse expression
      for (let ch of source) {
        switch (ch) {
          case "'":
            break;
          case '(':
            if (exp) {
              expStack.push(exp);
            }
            exp = new Expression();
            exp.operator = buffer.trim();
            buffer = '';

            break;
          case ')':
            if (buffer.length > 0) {
              if (isProperty) {
                let operand = <Expression>exp.operands[exp.operands.length - 1];
                operand.properties.push.apply(operand.properties, buffer.trim().split('.'));
                isProperty = false;
              } else {
                exp.operands.push(buffer.trim());
              }
              buffer = '';
            }

            if (expStack.length > 0) {
              let parent = expStack.pop();
              parent.operands.push(exp);
              exp = parent;
            }

            break;
          case '.':
            if (pre === ')') {
              isProperty = true;
            } else {
              buffer += ch;
            }

            break;
          case ',':
            if (buffer.length > 0) {
              if (isProperty) {
                let operand = <Expression>exp.operands[exp.operands.length - 1];
                operand.properties.push.apply(operand.properties, buffer.trim().split('.'));
                isProperty = false;
              } else {
                exp.operands.push(buffer.trim());
              }
              buffer = '';
            }

            break;
          default:
            buffer += ch;
            break;
        }

        pre = ch;
      }

      // Post parsing process
      if (buffer.length > 0 && isProperty) {
        exp.properties.push.apply(exp.properties, buffer.trim().split('.'));
      }

      return exp;
    }
  }
}
