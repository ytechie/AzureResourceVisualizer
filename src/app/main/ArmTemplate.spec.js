/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="ArmTemplate.ts" />
/// <reference path="Resource.ts" />

describe('ArmTemplate', function(){
  it("Should handle resources without depencies", function() {
    var at = new ArmViz.ArmTemplate({});
    var deps = at.getDependencies(new ArmViz.Resource());
    
    expect(deps).toEqual([]);
  });
});