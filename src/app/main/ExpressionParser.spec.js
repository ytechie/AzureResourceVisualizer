/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="ExpressionParser.ts" />

describe("ExpressionParser", function() {
	it('should parse simple variable expression', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("variables('var1')")
		
		expect(exp.operator).toEqual("variables");
		expect(exp.operands.length).toEqual(1);
		expect(exp.operands[0]).toEqual('var1');
	});
    
    it('should parse string', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("storageLoop")
		
		expect(exp.operator).toEqual("");
		expect(exp.operands.length).toEqual(1);
		expect(exp.operands[0]).toEqual('storageLoop');
	});
	
	it('should parse expression with multiple parameters', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("concat('var1', 'var2')")
		
		expect(exp.operator).toEqual("concat");
		expect(exp.operands.length).toEqual(2);
		expect(exp.operands[0]).toEqual('var1');
		expect(exp.operands[1]).toEqual('var2');
	});
	
	it('should parse nested expressions', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("concat('var1', nest('var2', 'var3'))")
		
		expect(exp.operator).toEqual("concat");
		expect(exp.operands.length).toEqual(2);
		expect(exp.operands[0]).toEqual('var1');
		
		var nested = exp.operands[1];
		
		expect(nested.operator).toEqual('nest');
		expect(nested.operands.length).toEqual(2);
		expect(nested.operands[0]).toEqual('var2');
		expect(nested.operands[1]).toEqual('var3');
	});
	
	it('should strip brackets', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("[foo()]")
		
		expect(exp.operator).toEqual("foo");
		expect(exp.operands.length).toEqual(0);
	});
	
	it('should parse multi-nested expressions', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("resourceId('Microsoft.Web/sites', concat(parameters('endpointName'), 'gateway'))");
	
		expect(exp.operator).toEqual('resourceId');
		expect(exp.operands.length).toEqual(2);
		expect(exp.operands[0]).toEqual('Microsoft.Web/sites');
		expect(exp.operands[1].operator).toEqual('concat');
		expect(exp.operands[1].operands.length).toEqual(2)
		expect(exp.operands[1].operands[0].operator).toEqual('parameters');
		expect(exp.operands[1].operands[0].operands[0]).toEqual('endpointName');
		expect(exp.operands[1].operands[1]).toEqual('gateway');
	});
});