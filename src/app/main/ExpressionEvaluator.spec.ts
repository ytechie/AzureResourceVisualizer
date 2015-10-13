/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
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
}