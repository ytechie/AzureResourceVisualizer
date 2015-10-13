/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
	var assert = chai.assert;
	
	describe("Resource", () => {
		it('should get the correct ID using getResourceId for a simple resource', () => {
			let r = new Resource(null);
			r.type = 'type';
			r.name = 'name'
			
			let id = Resource.getResourceId(r);
			
			assert.equal(id, 'type/name');
		});
		
		it('should get the correct ID when the name is an expression', () => {
			let r = new Resource(null);
			r.type = 'type';
			r.name = "[concat(parameters('nicNamePrefix'), copyindex())]";
			
			let id = Resource.getResourceId(r);
			
			assert.equal(id, "type/parameters('nicNamePrefix')copyindex()");
		});
	});
}