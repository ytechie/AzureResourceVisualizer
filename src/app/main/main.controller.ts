/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

'use strict';
angular.module('vis')
  .controller('MainCtrl', function ($scope) {
      
    var toolboxItems:Array<ToolboxResource> = [
      new ToolboxResource(
        "Virtual machine.png",
        "Virtual Machine",
        'Microsoft.Compute/virtualMachines' ),
      new ToolboxResource(
        "Azure load balancer.png",
        "Load Balancer",
        'Microsoft.Network/loadBalancers' )
    ];  
    
    $scope.toolboxItems = toolboxItems;
    
    //this is the problem. Can't pass in "arm" because it's the wrong type
    var templateData = <ArmTemplateInterface>arm;
    $scope.graph = new Graph(new ArmTemplate(templateData), toolboxItems);
    
    
    //init();
    //createNodes(toolboxItems);
    //createLinks();
    //layoutNodes();
    //initializeClickPopup(); 
  });