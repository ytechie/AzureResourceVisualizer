/// <reference path="../../../typings/index.d.ts" />

/// <reference path="ArmTemplate.ts" />
/// <reference path="Resource.ts" />

describe('ArmTemplate', function () {
  it("Should handle resources without depencies", function () {
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

  it('should resolve name with variables expression with properties', function () {
    var source = "[variables('nic').prefix.name]";
    var templateData = {
      variables: {
        nic: {
          prefix: {
            name: 'nicName'
          }
        }
      }
    };

    var at = new ArmViz.ArmTemplate(templateData);
    var name = at.resolveName(source);

    expect(name).toEqual('nicName');
  });

  it('should resolve dependencies with concat expression with properties', function () {
    var source = "[concat('Microsoft.Compute/virtualMachines/', variables('vm').name)]";
    var templateData = {
      variables: {
        vm: {
          name: 'vmName'
        }
      }
    }

    var at = new ArmViz.ArmTemplate(templateData);
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse(source);
    var dependsOn = at.resolveDependsOnId(exp);

    expect(dependsOn.type).toEqual("Microsoft.Compute/virtualMachines");
    expect(dependsOn.name).toEqual('vmName');
  });

  it('should multi-nested dependency in concat with properties', function () {
    var source = "resourceId('Microsoft.Web/sites', concat(variables('endpoint').name, 'Gateway'))";
    var templateData = {
      parameters: { },
      variables: {
        endpoint: {
          name: "[concat(parameters(endpointPrefix), concat('-', endpointName))]"
        }
      }
    };

    var at = new ArmViz.ArmTemplate(templateData);
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse(source);
    var dependsOn = at.resolveDependsOnId(exp);

    expect(dependsOn.type).toEqual("Microsoft.Web/sites");
    expect(dependsOn.name).toEqual("endpointPrefix-endpointNameGateway");
  });
});
