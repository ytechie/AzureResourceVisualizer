/// <reference path="ExpressionParser.ts" />
/// <reference path="ExpressionEvaluator.ts" />
/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../../../typings/chai/chai.d.ts" />

var assert = chai.assert;

describe("ExpressionEvaluator", () => {
	it('should process concat expression', () => {
		let ep = new ExpressionParser();
		let exp = ep.parse("[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'), copyindex())]");
		let ee = new ExpressionEvaluator(null);
		
		let dependsOnId = ee.resolveDependsOnId(exp);
		console.log(dependsOnId);
	});
	
	it('should process basic parameter expression', () => {
		let ep = new ExpressionParser();
		let exp = ep.parse("parameters('storageAccountName')");
		let ee = new ExpressionEvaluator(null);
		
		let dependsOnId = ee.resolveDependsOnId(exp);
		assert.equal(dependsOnId, "parameters('storageAccountName')");
	});
});