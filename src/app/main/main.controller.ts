/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="ToolboxItems.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('vis')
  .controller('MainCtrl', function ($scope, $modal) {
          
    $scope.toolboxItems = toolboxItems;
    
    $scope.templateData = <ArmTemplateInterface>arm;
    var graph = new Graph(toolboxItems);
    graph.applyTemplate(new ArmTemplate($scope.templateData));
    $scope.graph = graph;
    
    graph.resourceSelected = function(resource:Resource) {
      $scope.selectedResource = JSON.stringify(resource, null, 2);
      $scope.$apply();
    }
    
    $scope.downloadArmTemplate = function() {
      var data = JSON.stringify($scope.templateData, null, 2);
      
      downloadJsonInBrowser(data, 'armTemplate.json');
    }
    
    $scope.loadArmQuickstartTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: '/app/quickstartLoadDialog/QuickstartLoadDialog.html',
        controller: 'QuickstartLoadDialog'
      });
            
      modalInstance.result.then(function(newTemplate:ArmTemplateInterface) {
        $scope.templateData = newTemplate;
        var graph = <Graph>$scope.graph;
        graph.applyTemplate(new ArmTemplate(newTemplate));
        $scope.graph = graph;
      }
    };
    
    $scope.openTemplateProperties = function() {
      //Documentation: http://angular-ui.github.io/bootstrap/#/modal
      var modalInstance = $modal.open({
      templateUrl: '/app/templateParameterEditor/TemplateProperties.html',
      controller: 'TemplatePropertiesCtrl',
      size: 'lg',
      
      //These items get passed to the chiid controller
      resolve: {
        templateData: function () {
          return $scope.templateData;
        }
      }
      });
    };
  
    function downloadJsonInBrowser(json:string, fileName:string) {  
      //Crazy code to download the resulting JSON file
      //http://bgrins.github.io/devtools-snippets/#console-save
      var blob = new Blob([json], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
      
        //A typescript guru could probably figure out how to get rid of these errors
      
        a.download = 'armTemplate.json';
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    }
  });