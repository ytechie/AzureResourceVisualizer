/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

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
    
    var templateData = <ArmTemplateInterface>arm;
    $scope.graph = new Graph(new ArmTemplate(templateData), toolboxItems);
    
    $scope.downloadArmTemplate = function() {
      var data = JSON.stringify(templateData, null, 2);
      
      downloadJsonInBrowser(data, 'armTemplate.json');
    }
  });
  
  function downloadJsonInBrowser(json:string, fileName:string) {
    var data = JSON.stringify(json, null, 2);
    
    //Crazy code to download the resulting JSON file
    //http://bgrins.github.io/devtools-snippets/#console-save
    var blob = new Blob([data], {type: 'text/json'}),
          e    = document.createEvent('MouseEvents'),
          a    = document.createElement('a')
    
      //A typescript guru could probably figure out how to get rid of these errors
    
      a.download = 'armTemplate.json';
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
  }