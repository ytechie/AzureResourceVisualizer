/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="ExpressionParser.ts" />

(function() {
  'use strict';

  describe('ExpressionEvaluator', function(){
    it('should process concat expression', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'), copyindex())]");
		var ee = new ArmViz.ExpressionEvaluator(null);
		
		var dependsOnId = ee.resolveDependsOnId(exp);
		//console.log(dependsOnId);
	});
	
	it('should process basic parameter expression', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("parameters('storageAccountName')");
		var ee = new ArmViz.ExpressionEvaluator(null);
		
		var dependsOnId = ee.resolveDependsOnId(exp);
		expect(dependsOnId).toEqual("parameters('storageAccountName')");
	});
  });
})();