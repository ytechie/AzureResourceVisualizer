/// <reference path="../../../typings/index.d.ts" />

/// <reference path="ArmTemplate.ts" />
/// <reference path="Resource.ts" />

describe('ArmTemplate', function(){
  it("Should handle resources without depencies", function() {
    var at = new ArmViz.ArmTemplate({});
    var deps = at.getDependencies(new ArmViz.Resource());

    expect(deps).toEqual([]);
  });

  it('should process concat expression', function () {
      var ep = new ArmViz.ExpressionParser();
      var exp = ep.parse("[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'))]");

      var at = new ArmViz.ArmTemplate({});
      var dependsOn = at.resolveDependsOnId(exp);
      expect(dependsOn.type).toEqual("Microsoft.Network/networkInterfaces");
      expect(dependsOn.name).toEqual("nicNamePrefix")
  });

  it('should process nested parameters in concat', function () {
      var ep = new ArmViz.ExpressionParser();
      var exp = ep.parse("resourceId('Microsoft.Web/sites', concat(parameters('endpointName'), 'gateway'))");

      var at = new ArmViz.ArmTemplate({});
      var dependsOn = at.resolveDependsOnId(exp);
      expect(dependsOn.type).toEqual("Microsoft.Web/sites");
      expect(dependsOn.name).toEqual("endpointNamegateway");
  });
});
