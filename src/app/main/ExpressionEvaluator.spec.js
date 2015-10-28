/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="ExpressionParser.ts" />
/// <reference path="ExpressionEvaluator.ts" />

(function() {
  'use strict';

  describe('ExpressionEvaluator', function(){
    it('should process concat expression', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'))]");
		
		var dependsOn = ArmViz.ExpressionEvaluator.resolveDependsOnId(exp);
		expect(dependsOn.type).toEqual("Microsoft.Network/networkInterfaces");
		expect(dependsOn.name).toEqual("parameters('nicNamePrefix')")
	});
	
	it('should process nested parameters in concat', function() {
		var ep = new ArmViz.ExpressionParser();
		var exp = ep.parse("resourceId('Microsoft.Web/sites', concat(parameters('endpointName'), 'gateway'))");
		
		var dependsOn = ArmViz.ExpressionEvaluator.resolveDependsOnId(exp);
		expect(dependsOn.type).toEqual("Microsoft.Web/sites");
		expect(dependsOn.name).toEqual("concat(parameters('endpointName'),'gateway')");
	});
	
  });
})();