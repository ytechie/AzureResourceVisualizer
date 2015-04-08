var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({ el: $('#paper'), gridSize: 1, model: graph, height: '100%', width: '100%' });

joint.shapes.custom = {};
joint.shapes.custom.ElementLink = joint.shapes.basic.Rect.extend({
    markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><text/></g></a>',
    defaults: joint.util.deepSupplement({
        type: 'custom.ElementLink'
    }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.custom.ElementLabelLink = joint.shapes.basic.Rect.extend({
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><a><text/></a></g>',
    defaults: joint.util.deepSupplement({
        type: 'custom.ElementLabelLink'
    }, joint.shapes.basic.Rect.prototype.defaults)
});


var template = new Template(arm);

function createNodes() {
//Create the nodes
    template.getAllResources().forEach(function(resource) {
        console.log('Loading resource ' + resource.type);

        var shape = new joint.shapes.custom.ElementLink({
            position: { x: 80, y: 80 },
            size: { width: 170, height: 100 },
            attrs: {
                rect: { fill: '#E67E22', stroke: '#D35400', 'stroke-width': 5 },
                text: { text: resource.type, fill: 'white' }
            }
        });

        shape.attributes.attrs.text.text = resource.type.replace('/', '\n');

        template.associateNodeWithResource(shape, resource);

        graph.addCell(shape);
    });
}

function createLinks() {
    template.getAllResources().forEach(function(resource) {
        //Find the destination node
        var deps = template.resolveResourceDependencies(resource.dependsOn);

        deps.forEach(function(dep) {
            var sourceNode = template.getNodeForResource(resource);
            var destNode = template.getNodeForResource(dep);

            var l = new joint.dia.Link({
                source: { id: sourceNode.id },
                target: { id: destNode.id },
                attrs: {
                    '.connection': { 'stroke-width': 5, stroke: '#34495E' },
                    '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
                }
            });

            graph.addCell(l);
        });
    });
}

function displayResource(resource) {
    $('#jsonModal').modal({});
    $('#json').val(JSON.stringify(resource));
}

function initializeClickPopup() {
     paper.on('cell:pointerdblclick', function (evt, x, y) {
         var node = graph.getCell(evt.model.id);
         var resource = template.getResourceForNode(node);

         displayResource(resource);
     });   
}

createNodes();
createLinks();
initializeClickPopup();