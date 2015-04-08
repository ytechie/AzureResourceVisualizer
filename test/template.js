var assert = chai.assert;

describe('Template', function () {
    describe('Ctor', function() {
        it('Should create without error', function () {
            var t = new Template({});
            //assert.equal(-1, [1, 2, 3].indexOf(5));
            //assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });

    describe('getTemplate', function () {
        it('Should return same template as Ctor', function () {
            var template = { blah: "test" };
            var t = new Template(template);

            assert.equal(template, t.getTemplate());
        });
    });

    describe('associateNodeWithResource', function () {
        it('Associate and retrieve a node with a resource', function () {
            var t = new Template({});

            var r = { resourceId: 2 };
            var n = { id: 1 };

            t.associateNodeWithResource(n, r);
            assert.equal(n, t.getNodeForResource(r));
        });
    });

    describe('getResourceForNode', function () {
        it('Get a resource from a node', function () {
            var t = new Template({});

            var r = { resourceId: 2 };
            var n = { id: 1 };

            t.associateNodeWithResource(n, r);
            assert.equal(r, t.getResourceForNode(n));
        });
    });

    describe('getAllResources', function () {
        it('Get all resources', function () {
            var t = new Template(sampleArmTemplate1);

            assert(t.getAllResources().length === 7, 'Incorrect number of resources');
        });

        it('Change resource and make sure it changes in the source', function () {
            var t = new Template(sampleArmTemplate1);

            var resources = t.getAllResources();
            resources[0].blah = "abc";

            resources = t.getAllResources();

            assert.equal("abc", resources[0].blah);
        });
    });

    describe('resolveResourceDependencies', function () {
        it('Doesnt crash getting dependencies', function () {
            var t = new Template(sampleArmTemplate1);
            var resources = t.getAllResources();

            for (var i = 0; i < resources.length; i++) {
                var  d = t.resolveResourceDependencies(resources[i].dependsOn);
            }

            //assert(t.getAllResources().length === 7, 'Incorrect number of resources');
        });

        it('Get a simple dependency', function () {
            var t = new Template(sampleArmTemplate1);
            var resources = t.getAllResources();

            var dependencies = t.resolveResourceDependencies(resources[5].dependsOn);
            assert.isAbove(dependencies.length, 0);
            //assert(t.getAllResources().length === 7, 'Incorrect number of resources');
        });
    });
})