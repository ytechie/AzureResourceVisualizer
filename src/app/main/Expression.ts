module ArmViz {
  export class Expression {
    private _source: string;
    private _operator: string = '';
    private _operands: Array<Expression | string> = [];
    private _properties: string[] = [];

    constructor(source?: string) {
      this._source = source;
    }

    get source() {
      return this._source;
    }

    get operator() {
      return this._operator;
    }

    set operator(newOperator: string) {
      this._operator = newOperator;
    }

    get operands() {
      return this._operands;
    }

    get properties() {
      return this._properties;
    }

    toString(): string {
      if (this._source) {
        return this._source;
      }

      let s = this.operator;

      s += '(';

      for (let operand of this.operands) {
        s += operand instanceof Expression ? operand.toString() : "'" + operand + "'";
        s += operand !== this.operands[this.operands.length - 1] ? ', ' : '';
      }

      s += ')';

      for (let property of this.properties) {
        s += '.' + property;
      }

      return s;
    }
  }
}
