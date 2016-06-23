/// <reference path="../../../typings/index.d.ts" />

/// <reference path="ExpressionParser.ts" />

describe("ExpressionParser", function () {
  it('should parse simple variable expression', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("variables('var1')")

    expect(exp.operator).toEqual("variables");
    expect(exp.operands.length).toEqual(1);
    expect(exp.operands[0]).toEqual('var1');
  });

  it('should parse simple variable expression with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("variables('var1').var2.var3.var4")

    expect(exp.operator).toEqual("variables");
    expect(exp.operands.length).toEqual(1);
    expect(exp.operands[0]).toEqual('var1');
    expect(exp.properties.length).toEqual(3);
    expect(exp.properties[0]).toEqual('var2');
    expect(exp.properties[1]).toEqual('var3');
    expect(exp.properties[2]).toEqual('var4');
  });

  it('should parse string', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("storageLoop")

    expect(exp.operator).toEqual("");
    expect(exp.operands.length).toEqual(1);
    expect(exp.operands[0]).toEqual('storageLoop');
  });

  it ('should parse string with space', function() {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse('virtual network');

    expect(exp.operator).toEqual("");
    expect(exp.operands.length).toEqual(1);
    expect(exp.operands[0]).toEqual('virtual network');
  });

  it('should parse expression with multiple parameters', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("concat('var1', 'var2')")

    expect(exp.operator).toEqual("concat");
    expect(exp.operands.length).toEqual(2);
    expect(exp.operands[0]).toEqual('var1');
    expect(exp.operands[1]).toEqual('var2');
  });

  it('should parse expression with multiple parameters', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("resourceId('var1', 'var2')")

    expect(exp.operator).toEqual("resourceId");
    expect(exp.operands.length).toEqual(2);
    expect(exp.operands[0]).toEqual('var1');
    expect(exp.operands[1]).toEqual('var2');
  });

  it('should parse expression with multiple parameters with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("resourceId('var1', 'var2').var3.var4")

    expect(exp.operator).toEqual("resourceId");
    expect(exp.operands.length).toEqual(2);
    expect(exp.operands[0]).toEqual('var1');
    expect(exp.operands[1]).toEqual('var2');
    expect(exp.properties.length).toEqual(2);
    expect(exp.properties[0]).toEqual('var3');
    expect(exp.properties[1]).toEqual('var4');
  });

  it('should parse nested expressions', function () {
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

  it('should parse nested expressions with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("concat(nested('var1', var2').var3.var4, 'var5')");

    expect(exp.operator).toEqual("concat");
    expect(exp.operands.length).toEqual(2);
    expect(exp.operands[1]).toEqual('var5');

    var nested = exp.operands[0];
    expect(nested.operator).toEqual('nested');
    expect(nested.operands.length).toEqual(2);
    expect(nested.operands[0]).toEqual('var1');
    expect(nested.operands[1]).toEqual('var2');
    expect(nested.properties.length).toEqual(2);
    expect(nested.properties[0]).toEqual('var3');
    expect(nested.properties[1]).toEqual('var4');

  });

  it('should parse nested expressions with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("concat('var1', nested('var2', var3').var4.var5)");

    expect(exp.operator).toEqual("concat");
    expect(exp.operands.length).toEqual(2);
    expect(exp.operands[0]).toEqual('var1');

    var nested = exp.operands[1];
    expect(nested.operator).toEqual('nested');
    expect(nested.operands.length).toEqual(2);
    expect(nested.operands[0]).toEqual('var2');
    expect(nested.operands[1]).toEqual('var3');
    expect(nested.properties.length).toEqual(2);
    expect(nested.properties[0]).toEqual('var4');
    expect(nested.properties[1]).toEqual('var5');

  });

  it('should parse nested expressions with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("concat(nested1('var11', var12').var13.var14, nested2('var21', 'var22').var23.var24)");

    expect(exp.operator).toEqual("concat");
    expect(exp.operands.length).toEqual(2);

    var nested1 = exp.operands[0];
    expect(nested1.operator).toEqual('nested1');
    expect(nested1.operands.length).toEqual(2);
    expect(nested1.operands[0]).toEqual('var11');
    expect(nested1.operands[1]).toEqual('var12');
    expect(nested1.properties.length).toEqual(2);
    expect(nested1.properties[0]).toEqual('var13');
    expect(nested1.properties[1]).toEqual('var14');

    var nested2 = exp.operands[1];
    expect(nested2.operator).toEqual('nested2');
    expect(nested2.operands.length).toEqual(2);
    expect(nested2.operands[0]).toEqual('var21');
    expect(nested2.operands[1]).toEqual('var22');
    expect(nested2.properties.length).toEqual(2);
    expect(nested2.properties[0]).toEqual('var23');
    expect(nested2.properties[1]).toEqual('var24');
  });

  it('should strip brackets', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse("[foo()]")

    expect(exp.operator).toEqual("foo");
    expect(exp.operands.length).toEqual(0);
  });

  it('should parse multi-nested expressions', function () {
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

  it('should parse multi-nested expressions with properties', function () {
    var ep = new ArmViz.ExpressionParser();
    var exp = ep.parse(
      "variables(resourceId(parameters('endpoint').type, concat('-', parameters('endpoint').name))).default.name");

    expect(exp.operator).toEqual('variables');
    expect(exp.operands.length).toEqual(1);
    expect(exp.properties.length).toEqual(2);
    expect(exp.properties[0]).toEqual('default');
    expect(exp.properties[1]).toEqual('name');

    var resourceId = exp.operands[0];
    expect(resourceId.operands.length).toEqual(2);

    var parameters1 = resourceId.operands[0];
    expect(parameters1.operands.length).toEqual(1);
    expect(parameters1.operands[0]).toEqual('endpoint');
    expect(parameters1.properties.length).toEqual(1);
    expect(parameters1.properties[0]).toEqual('type');

    var concat = resourceId.operands[1];
    expect(concat.operands.length).toEqual(2);
    expect(concat.operands[0]).toEqual('-');

    var parameters2 = concat.operands[1];
    expect(parameters2.operands.length).toEqual(1);
    expect(parameters2.operands[0]).toEqual('endpoint');
    expect(parameters2.properties.length).toEqual(1);
    expect(parameters2.properties[0]).toEqual('name');
  });
});
