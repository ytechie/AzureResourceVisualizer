/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
'use strict';
angular.module('vis')
    .controller('MainCtrl', function ($scope) {
    var toolboxItems = [
        new ToolboxResource("Virtual machine.png", "Virtual Machine", 'Microsoft.Compute/virtualMachines'),
        new ToolboxResource("Azure load balancer.png", "Load Balancer", 'Microsoft.Network/loadBalancers')
    ];
    $scope.toolboxItems = toolboxItems;
    var templateData = arm;
    $scope.graph = new Graph(new ArmTemplate(templateData), toolboxItems);
});
//# sourceMappingURL=main.controller.js.map