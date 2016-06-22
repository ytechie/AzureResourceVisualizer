/// <reference path="../../../typings/index.d.ts" />
/// <reference path="Expression.ts" />

describe('Expression', function () {
  it('should set source string', function () {
    var source = "[concat('foo', 'bar')]";
    var exp = new ArmViz.Expression(source);

    expect(exp.source).toEqual(source);
    expect(exp.toString()).toEqual(source);
  });

  it('should convert to string', function () {
    var source = "resourceId('foo', 'bar').a.b"
    var exp = new ArmViz.Expression();

    exp.operator = 'resourceId';
    exp.operands.push('foo');
    exp.operands.push('bar');
    exp.properties.push('a');
    exp.properties.push('b');

    expect(exp.toString()).toEqual(source);
  });

  it('should convert multi-nested expressions to string', function () {
    var source = "resourceId('Microsoft.Web/sites', concat(variables('endpoint').name, 'gateway'))";
    var exp = new ArmViz.Expression();
    var exp1 = new ArmViz.Expression();
    var exp2 = new ArmViz.Expression();

    exp2.operator = 'variables';
    exp2.operands.push('endpoint');
    exp2.properties.push('name');

    exp1.operator = 'concat';
    exp1.operands.push(exp2);
    exp1.operands.push('gateway');

    exp.operator = 'resourceId';
    exp.operands.push('Microsoft.Web/sites');
    exp.operands.push(exp1);

    expect(exp2.toString()).toEqual("variables('endpoint').name");
    expect(exp1.toString()).toEqual("concat(variables('endpoint').name, 'gateway')");
    expect(exp.toString()).toEqual(source);
  });

});
