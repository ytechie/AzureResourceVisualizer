var Template = (function () {
    // "private" variables 
    var _template;

    var _nodes = [];
    var _nodeResourceMap = {};

    // constructor
    function Template(template) {
        if (!_) {
            throw new Error('Internal error: Lodash is not included');
        }

        _template = template;
    };


    Template.prototype.getTemplate = function () {
        return _template;
    };

    Template.prototype.associateNodeWithResource = function (node, resource) {
        if (node && node.id) {

            //Add the node to our list
            if (!_.includes(_nodes, node)) {
                _nodes.push(node);
            }

            //Update the map
            _nodeResourceMap[node.id] = resource;
        } else {
            throw new Error('Internal error: node is null or node id is null');
        }
    };

    Template.prototype.getNodeForResource = function (resource) {
        var nodeId = null;

        Object.keys(_nodeResourceMap).forEach(function (key) {
            if (_nodeResourceMap[key] === resource) {
                nodeId = key;
            }
        });

        if (nodeId) {
            var matches = _.filter(_nodes, function(n) {
                return n.id.toString() === nodeId;
            });

            if (matches.length > 0) {
                return matches[0];
            }
        }

        return null;
    };

    Template.prototype.getResourceForNode = function (node) {
        return _nodeResourceMap[node.id];
    };

    function getAllResources() {
        return _template.resources;
    };

    Template.prototype.getAllResources = getAllResources;

    function resolveResourceDependencies(depends) {
        var ret = [];

        if (!depends) {
            return [];
        }

        //If we get multiple dependencies, make recursive calls
        if (Array.isArray(depends)) {
            depends.forEach(function (dep) {
                var deps = resolveResourceDependencies(dep);
                if (deps && deps.length > 0) {
                    ret = ret.concat(deps);
                }
            });
        } else {
            if (depends.indexOf('[concat(') !== -1) {
                //We need to parse apart this wonderful string
                //[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]

                var parts = depends.split("'");

                var type = parts[1].substring(0, parts[1].length - 1);
                var name = parts[3];

                var foundResource = _.findWhere(getAllResources(), { type: type, name: "[parameters('" + name + "')]" });
                if (foundResource) {
                    ret.push(foundResource);
                }
            }
        }

        return ret;
    }

    Template.prototype.resolveResourceDependencies = resolveResourceDependencies;

    return Template;
})();