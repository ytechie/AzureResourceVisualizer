/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="Resource.ts" />
/// <reference path="DependencyId.ts" />
	
describe("Resource", function() {
	it('should match when the id and name match', function() {
		var r = new ArmViz.Resource(null);
		r.type = 'type';
		r.name = 'name'
		
		var dep = new ArmViz.DependencyId();
		dep.type = 'type';
		dep.name = 'name';
		
		var result = ArmViz.Resource.resourceMatchesDependency(r, dep);
		
		expect(result).toBe(true);
	});
	/*
	it('should get the correct ID when the name is an expression', function() {
		var r = new ArmViz.Resource(null);
		r.type = 'type';
		r.name = "[concat(parameters('nicNamePrefix'), copyindex())]";
		
		var id = ArmViz.Resource.getResourceId(r);
		
		expect(id).toEqual("type/parameters('nicNamePrefix')copyindex()");
	});
	
	it('should get valid resource id when the name is an expression', function() {		
		var id = ArmViz.Resource.getResourceId(testResource1);
		
		expect(id).toEqual("Microsoft.Web/sites/concat(parameters('endpointName'),'gateway')");
	});*/
});

var testResource1 = {
	"type": "Microsoft.Web/sites",
	"apiVersion": "2015-04-01",
	"name": "[concat(parameters('endpointName'),'gateway')]"
}