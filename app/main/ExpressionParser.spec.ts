/// <reference path="ExpressionParser.ts" />
/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

var assert = chai.assert;

describe("ExpressionParser", () => {
	it('should parse simple variable expression', () => {
		var ep = new ExpressionParser();
		var exp = ep.parse("variables('var1')")
		
		assert.equal(exp.operator, "variables");
		assert.equal(exp.operands.length, 1);
		assert.equal(exp.operands[0], 'var1');
	});
	
	it('should parse expression with multiple parameters', () => {
		var ep = new ExpressionParser();
		var exp = ep.parse("concat('var1', 'var2')")
		
		assert.equal(exp.operator, "concat");
		assert.equal(exp.operands.length, 2);
		assert.equal(exp.operands[0], 'var1');
		assert.equal(exp.operands[1], 'var2');
	});
	
	it('should parse nested expressions', () => {
		var ep = new ExpressionParser();
		var exp = ep.parse("concat('var1', nest('var2', 'var3'))")
		
		assert.equal(exp.operator, "concat");
		assert.equal(exp.operands.length, 2);
		assert.equal(exp.operands[0], 'var1');
		
		var nested = <Expression>exp.operands[1];
		
		assert.equal(nested.operator, 'nest');
		assert.equal(nested.operands.length, 2);
		assert.equal(nested.operands[0], 'var2');
		assert.equal(nested.operands[1], 'var3');
	});
});