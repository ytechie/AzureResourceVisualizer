/// <reference path="ArmTemplate.ts" />
/// <reference path="Resource.ts" />
/// <reference path="ResourceShape.ts" />
/// <reference path="ToolboxResource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />
var Graph = (function () {
    function Graph(template, toolboxItems) {
        this.resourceShapes = new Array();
        this.resourceShapeLinks = new Array();
        this.template = template;
        this.toolboxItems = toolboxItems;
        this.initJointJs();
        this.createNodes();
        this.createLinks();
        this.autoSetShapePositions();
        this.displayNodesAndLinks();
        this.initializeClickPopup();
    }
    Graph.prototype.initJointJs = function () {
        this.graph = new joint.dia.Graph();
        this.paper = new joint.dia.Paper({ el: $('#paper'), gridSize: 1, model: this.graph, height: '100%', width: '100%' });
    };
    Graph.prototype.createNodes = function () {
        var _this = this;
        this.template.resources.forEach(function (resource) {
            var toolboxItem = _this.getToolboxItemForResource(resource);
            var shape = new ResourceShape(resource, toolboxItem);
            shape.position(80, 80);
            shape.resize(170, 100);
            _this.resourceShapes.push(shape);
        });
    };
    Graph.prototype.displayNodesAndLinks = function () {
        var _this = this;
        this.resourceShapes.forEach(function (shape) {
            _this.addShape(shape);
        });
        this.resourceShapeLinks.forEach(function (shapeLink) {
            _this.addShapeLink(shapeLink);
        });
    };
    Graph.prototype.createLinks = function () {
        var _this = this;
        var self = this;
        this.template.resources.forEach(function (resource) {
            var dependencies = self.template.getDependencies(resource);
            dependencies.forEach(function (dep) {
                var sourceNode = self.getShapeForResource(resource);
                var destNode = self.getShapeForResource(dep);
                var l = new joint.dia.Link({
                    source: { id: sourceNode.id },
                    target: { id: destNode.id },
                    attrs: {
                        '.connection': { 'stroke-width': 5, stroke: '#34495E' },
                        '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
                    }
                });
                _this.resourceShapeLinks.push(l);
            });
        });
    };
    Graph.prototype.addShape = function (shape) {
        this.graph.addCell(shape);
    };
    Graph.prototype.addShapeLink = function (link) {
        this.graph.addCell(link);
    };
    Graph.prototype.getToolboxItemForResource = function (resource) {
        var foundItem = null;
        this.toolboxItems.forEach(function (toolboxItem) {
            if (toolboxItem.resourceType === resource.type) {
                foundItem = toolboxItem;
            }
        });
        return foundItem;
    };
    Graph.prototype.getShapeForResource = function (resource) {
        var retShape;
        this.resourceShapes.forEach(function (shape) {
            if (shape.sourceResource === resource) {
                retShape = shape;
            }
        });
        return retShape;
    };
    Graph.prototype.initializeClickPopup = function () {
        var self = this;
        this.paper.on('cell:pointerdown', function (evt, x, y) {
            var shape = evt.model;
            self.displayResource(shape.sourceResource);
        });
    };
    Graph.prototype.displayResource = function (resource) {
        $('#nodeProperties').val(JSON.stringify(resource, null, 2));
    };
    Graph.prototype.autoSetShapePositions = function () {
        var self = this;
        var g = new dagre.graphlib.Graph();
        g.setGraph({});
        g.setDefaultEdgeLabel(function () { return {}; });
        this.resourceShapes.forEach(function (shape) {
            g.setNode(shape.id, { width: shape.attributes.size.width, height: shape.attributes.size.height });
        });
        this.resourceShapeLinks.forEach(function (shapeLink) {
            g.setEdge(shapeLink.attributes.source.id, shapeLink.attributes.target.id);
        });
        dagre.layout(g);
        g.nodes().forEach(function (node) {
            var shape = _.findWhere(self.resourceShapes, { id: node });
            shape.attributes.position.x = g.node(node).x;
            shape.attributes.position.y = g.node(node).y;
        });
    };
    return Graph;
})();
