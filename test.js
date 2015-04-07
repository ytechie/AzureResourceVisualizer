var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({ el: $('#paper'), gridSize: 1, model: graph });


var arm = {
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "region": {
            "type": "string"
        },
        "storageAccountName": {
            "type": "string",
            "defaultValue": "uniqueStorageAccountName"
        },
        "adminUsername": {
            "type": "string"
        },
        "adminPassword": {
            "type": "securestring"
        },
        "dnsNameforLBIP": {
            "type": "string",
            "defaultValue": "uniqueDnsNameforLBIP"
        },
        "subscriptionId": {
            "type": "string"
        },
        "backendPort": {
            "type": "int",
            "defaultValue": 3389
        },
        "vmNamePrefix": {
            "type": "string",
            "defaultValue": "myVM"
        },
        "vmSourceImageName": {
            "type": "string",
            "defaultValue": "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201412.01-en.us-127GB.vhd"
        },
        "lbName": {
            "type": "string",
            "defaultValue": "myLB"
        },
        "nicNamePrefix": {
            "type": "string",
            "defaultValue": "nic"
        },
        "publicIPAddressName": {
            "type": "string",
            "defaultValue": "myPublicIP"
        },
        "vnetName": {
            "type": "string",
            "defaultValue": "myVNET"
        },
        "vmSize": {
            "type": "string",
            "defaultValue": "Standard_A1",
            "allowedValues": [
                "Standard_A0",
                "Standard_A1",
                "Standard_A2",
                "Standard_A3",
                "Standard_A4"
            ]
        }
    },
    "variables": {
        "storageAccountType": "Standard_LRS",
        "vmStorageAccountContainerName": "vhds",
        "availabilitySetName": "myAvSet",
        "addressPrefix": "10.0.0.0/16",
        "subnetName": "Subnet-1",
        "subnetPrefix": "10.0.0.0/24",
        "publicIPAddressType": "Dynamic",
        "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',parameters('vnetName'))]",
        "subnetRef": "[concat(variables('vnetID'),'/subnets/',variables ('subnetName'))]",
        "publicIPAddressID": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName'))]",
        "lbID": "[resourceId('Microsoft.Network/loadBalancers',parameters('lbName'))]",
        "numberOfInstances": 2,
        "nicId1": "[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'), 0))]",
        "nicId2": "[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'), 1))]",
        "frontEndIPConfigID": "[concat(variables('lbID'),'/frontendIPConfigurations/LBFE')]",
        "backEndIPConfigID1": "[concat(variables('nicId1'),'/ipConfigurations/ipconfig1')]",
        "backEndIPConfigID2": "[concat(variables('nicId2'),'/ipConfigurations/ipconfig1')]",
        "sourceImageName": "[concat('/',parameters('subscriptionId'),'/services/images/',parameters('vmSourceImageName'))]",
        "lbPoolID": "[concat(variables('lbID'),'/backendAddressPools/LBBE')]",
        "lbProbeID": "[concat(variables('lbID'),'/probes/tcpProbe')]"
    },
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('storageAccountName')]",
            "apiVersion": "2014-12-01-preview",
            "location": "[parameters('region')]",
            "properties": {
                "accountType": "[variables('storageAccountType')]"
            }
        },
        {
            "type": "Microsoft.Compute/availabilitySets",
            "name": "[variables('availabilitySetName')]",
            "apiVersion": "2014-12-01-preview",
            "location": "[parameters('region')]",
            "properties": {}
        },
        {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "[parameters('publicIPAddressName')]",
            "location": "[parameters('region')]",
            "properties": {
                "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
                "dnsSettings": {
                    "domainNameLabel": "[parameters('dnsNameforLBIP')]"
                }
            }
        },
        {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('vnetName')]",
            "location": "[parameters('region')]",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "[variables('addressPrefix')]"
                    ]
                },
                "subnets": [
                    {
                        "name": "[variables('subnetName')]",
                        "properties": {
                            "addressPrefix": "[variables('subnetPrefix')]"
                        }
                    }
                ]
            }
        },
        {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Network/networkInterfaces",
            "name": "[concat(parameters('nicNamePrefix'), copyindex())]",
            "location": "[parameters('region')]",
            "copy": {
                "name": "nicLoop",
                "count": "[variables('numberOfInstances')]"
            },
            "dependsOn": [
                "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]"
            ],
            "properties": {
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "privateIPAllocationMethod": "Dynamic",
                            "subnet": {
                                "id": "[variables('subnetRef')]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "apiVersion": "2014-12-01-preview",
            "name": "[parameters('lbName')]",
            "type": "Microsoft.Network/loadBalancers",
            "location": "[parameters('region')]",
            "dependsOn": [
                "nicLoop",
                "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]"
            ],
            "properties": {
                "frontendIPConfigurations": [
                    {
                        "name": "LBFE",
                        "properties": {
                            "publicIPAddress": {
                                "id": "[variables('publicIPAddressID')]"
                            }
                        }
                    }
                ],
                "backendAddressPools": [
                    {
                        "name": "LBBE",
                        "properties": {
                            "backendIPConfigurations": [
                                {
                                    "id": "[variables('backEndIPConfigID1')]"
                                },
                                {
                                    "id": "[variables('backEndIPConfigID2')]"
                                }
                            ]
                        }
                    }
                ],
                "inboundNatRules": [
                    {
                        "name": "RDP-VM1",
                        "properties": {
                            "frontendIPConfigurations": [
                                {
                                    "id": "[variables('frontEndIPConfigID')]"
                                }
                            ],
                            "backendIPConfiguration": {
                                "id": "[variables('backEndIPConfigID1')]"
                            },
                            "protocol": "tcp",
                            "frontendPort": 50001,
                            "backendPort": 3389,
                            "enableFloatingIP": false
                        }
                    },
                    {
                        "name": "RDP-VM2",
                        "properties": {
                            "frontendIPConfigurations": [
                                {
                                    "id": "[variables('frontEndIPConfigID')]"
                                }
                            ],
                            "backendIPConfiguration": {
                                "id": "[variables('backEndIPConfigID2')]"
                            },
                            "protocol": "tcp",
                            "frontendPort": 50002,
                            "backendPort": 3389,
                            "enableFloatingIP": false
                        }
                    }
                ],
                "loadBalancingRules": [
                    {
                        "name": "LBRule",
                        "properties": {
                            "frontendIPConfigurations": [
                                {
                                    "id": "[variables('frontEndIPConfigID')]"
                                }
                            ],
                            "backendAddressPool": {
                                "id": "[variables('lbPoolID')]"
                            },
                            "protocol": "tcp",
                            "frontendPort": 80,
                            "backendPort": 80,
                            "enableFloatingIP": false,
                            "idleTimeoutInMinutes": 5,
                            "probe": {
                                "id": "[variables('lbProbeID')]"
                            }
                        }
                    }
                ],
                "probes": [
                    {
                        "name": "tcpProbe",
                        "properties": {
                            "protocol": "tcp",
                            "port": 80,
                            "intervalInSeconds": "5",
                            "numberOfProbes": "2"
                        }
                    }
                ]
            }
        },
        {
            "apiVersion": "2014-12-01-preview",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[concat(parameters('vmNamePrefix'), copyindex())]",
            "copy": {
                "name": "virtualMachineLoop",
                "count": "[variables('numberOfInstances')]"
            },
            "location": "[parameters('region')]",
            "dependsOn": [
                "[concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
                "[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'), copyindex())]",
                "[concat('Microsoft.Compute/availabilitySets/', variables('availabilitySetName'))]"
            ],
            "properties": {
                "availabilitySet": {
                    "id": "[resourceId('Microsoft.Compute/availabilitySets',variables('availabilitySetName'))]"
                },
                "hardwareProfile": {
                    "vmSize": "[parameters('vmSize')]"
                },
                "osProfile": {
                    "computername": "[concat(parameters('vmNamePrefix'), copyIndex())]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                    "sourceImage": {
                        "id": "[variables('sourceImageName')]"
                    },
                    "destinationVhdsContainer": "[concat('http://',parameters('storageAccountName'),'.blob.core.windows.net/',variables('vmStorageAccountContainerName'),'/')]"
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'),copyindex()))]"
                        }
                    ]
                }
            }
        }
    ]
}




// Create a custom element.
// ------------------------

joint.shapes.custom = {};
// The following custom shape creates a link out of the whole element.
joint.shapes.custom.ElementLink = joint.shapes.basic.Rect.extend({
    // Note the `<a>` SVG element surrounding the rest of the markup.
    markup: '<a><g class="rotatable"><g class="scalable"><rect/></g><text/></g></a>',
    defaults: joint.util.deepSupplement({
        type: 'custom.ElementLink'
    }, joint.shapes.basic.Rect.prototype.defaults)
});
// The following custom shape creates a link only out of the label inside the element.
joint.shapes.custom.ElementLabelLink = joint.shapes.basic.Rect.extend({
    // Note the `<a>` SVG element surrounding the rest of the markup.
    markup: '<g class="rotatable"><g class="scalable"><rect/></g><a><text/></a></g>',
    defaults: joint.util.deepSupplement({
        type: 'custom.ElementLabelLink'
    }, joint.shapes.basic.Rect.prototype.defaults)
});

// Create JointJS elements and add them to the graph as usual.
// -----------------------------------------------------------

var dm = {
    resourceNodes: []
}

//Create the nodes
arm.resources.forEach(function(resource) {
    console.log('Loading resource ' + resource.type);

    var shape = new joint.shapes.custom.ElementLink({
        position: { x: 80, y: 80 }, size: { width: 170, height: 100 },
        attrs: {
            rect: { fill: '#E67E22', stroke: '#D35400', 'stroke-width': 5 },
            text: { text: resource.type, fill: 'white' }
        }
    });

    shape.attributes.attrs.text.text = resource.type.replace('/', '\n');

    graph.addCell(shape);

    dm.resourceNodes.push({
        shape: shape,
        source: resource
    });
});




//Create the links
dm.resourceNodes.forEach(function(node) {
    var sourceShape = node.shape;

    if(node.source.dependsOn) {
        //Find the destination node
        var deps = getDependencies(node.source.dependsOn);

        deps.forEach(function(dep) {
            dm.resourceNodes.forEach(function(findNode) {
                if(findNode.source.type == dep.type) {// && findNode.source.name == '[' + dep.name + ']') {
                    var destShape = findNode.shape;

                    var l = new joint.dia.Link({
                        source: { id: sourceShape.id }, target: { id: destShape.id },
                        attrs: {
                            '.connection': { 'stroke-width': 5, stroke: '#34495E'},
                            '.marker-target': { fill: 'yellow', d: 'M 10 0 L 0 5 L 10 10 z' }
                        }
                    });


                    graph.addCell(l);
                }
            });
        });
    }
});



function getDependencies(depends) {
    var ret = [];

    //If we get multiple dependencies, make recursive calls
    if(Array.isArray(depends)) {
        depends.forEach(function(dep) {
            var deps = getDependencies(dep);
            if(deps && deps.length > 0) {
                ret = ret.concat(deps);
            }
        });
    } else {
        if(depends.indexOf('[concat(') != -1) {
            //We need to parse apart this wonderful string
            //[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]

            var parts = depends.split("'");

            ret.push({
                type: parts[1].substring(0, parts[1].length -1),
                name: parts[3]
            })
        }
    }

    return ret;
}

/*
var el1 = new joint.shapes.custom.ElementLink({
    position: { x: 80, y: 80 }, size: { width: 170, height: 100 },
    attrs: {
        rect: { fill: '#E67E22', stroke: '#D35400', 'stroke-width': 5 },
        text: { text: 'Load Balancer', fill: 'white' }
    }
});
var el2 = new joint.shapes.custom.ElementLabelLink({
    position: { x: 370, y: 30 }, size: { width: 170, height: 100 },
    attrs: {
        rect: { fill: '#9B59B6', stroke: '#8E44AD', 'stroke-width': 5 },
        text: { text: 'App1', fill: 'white' }
    }
});
var el3 = new joint.shapes.custom.ElementLabelLink({
    position: { x: 370, y: 160 }, size: { width: 170, height: 100 },
    attrs: {
        rect: { fill: '#9B59B6', stroke: '#8E44AD', 'stroke-width': 5 },
        text: { text: 'App2', fill: 'white' }
    }
});

var l = new joint.dia.Link({
    source: { id: el1.id }, target: { id: el2.id },
    attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
});

l.on('change', function (evt) {
    console.log('Change event: ' + JSON.stringify(evt));
});

var l2 = new joint.dia.Link({
    source: { id: el1.id }, target: { id: el3.id },
    attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
});

graph.addCells([el1, el2, el3, l, l2]);

*/