/// <reference path="../../../typings/tsd.d.ts" />

/// <reference path="Resource.ts" />
	
describe("Resource", function() {
	it('should get the correct ID using getResourceId for a simple resource', function() {
		var r = new ArmViz.Resource(null);
		r.type = 'type';
		r.name = 'name'
		
		var id = ArmViz.Resource.getResourceId(r);
		
		expect(id).toEqual('type/name');
	});
	
	it('should get the correct ID when the name is an expression', function() {
		var r = new ArmViz.Resource(null);
		r.type = 'type';
		r.name = "[concat(parameters('nicNamePrefix'), copyindex())]";
		
		var id = ArmViz.Resource.getResourceId(r);
		
		expect(id).toEqual("type/parameters('nicNamePrefix')copyindex()");
	});
});