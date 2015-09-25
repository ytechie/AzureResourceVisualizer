/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="ToolboxItems.ts" />
/// <reference path="Shapes.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('vis')
  .controller('MainCtrl', function ($scope, $stateParams, $http, $modal) {
          
    var toolboxItems = getToolboxItems();
    $scope.toolboxItems = toolboxItems;
    
    let templateData = <ArmTemplateInterface>arm;
    let template = new ArmTemplate(templateData);
    
    var graph = new Graph(toolboxItems);
    
    if($stateParams.load) {
      let loadUrl = $stateParams.load;
      
      $scope.loadUrl = loadUrl;
      
      let category = $http.get(loadUrl)
        .success(function(data:any, status, headers, config) {
          template = new ArmTemplate(<ArmTemplateInterface>data);
          graph.applyTemplate(template);
        }).error(function(data, status, headers, config) {
				  alert('Error loading your template from GitHub. Please go back and try again.')
			  });
    } else {
      graph.applyTemplate(template);
    }
    
    graph.resourceSelected = function(resource:Resource, modal:boolean) {
      if(modal) {        
        var modalInstance = $modal.open({
          templateUrl: '/app/resourceEditorDialog/ResourceEditor.html',
          controller: 'ResourceEditorController',
          
          //These items get passed to the chiid controller
          resolve: {
            arm: function() {
              return template;
            },
            resource: function () {
              return resource;
            }
          }
        });
        modalInstance.result.then(function(resultResource:any) {
          if(resultResource && resultResource.deleteFlag) {
            template.deleteResource(<Resource>resultResource);
          }
        });
      } else {
        $scope.selectedResource = JSON.stringify(resource, null, 2);
        $scope.$apply();
      }
    }
    
    $scope.downloadArmTemplate = function() {
      let json = template.toJson();
      
      downloadJsonInBrowser(json, 'armTemplate.json');
    }
    
    $scope.openExistingTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: '/app/openExistingTemplateDialog/OpenDialog.html',
        controller: 'OpenDialog.controller'
      });
            
      modalInstance.result.then(function(newTemplate:ArmTemplate) {
        template = newTemplate;
        graph.applyTemplate(newTemplate);
      });
    };
    
    $scope.loadArmQuickstartTemplate = function() {
      var modalInstance = $modal.open({
        templateUrl: '/app/quickstartLoadDialog/QuickstartLoadDialog.html',
        controller: 'QuickstartLoadDialog'
      });
            
      modalInstance.result.then(function(newTemplate:ArmTemplate) {
        template = newTemplate;
        graph.applyTemplate(newTemplate);
      });
    };
    
    $scope.openTemplateProperties = function() {
      //Documentation: http://angular-ui.github.io/bootstrap/#/modal
      var modalInstance = $modal.open({
      templateUrl: '/app/templateParameterEditor/TemplateProperties.html',
      controller: 'TemplatePropertiesCtrl',
      size: 'lg',
      
      //These items get passed to the chiid controller
      resolve: {
        armTemplate: function () {
          return template;
        }
      }
      });
    };
    
    $scope.toolboxItemClick = function(toolboxItem:ToolboxResource) {
      var resource = new Resource(toolboxItem);
      
      template.resources.push(resource);
    }
    
    $scope.addShape = function(name:string) {
      if(name === 'group') {
        var shape = new Group();
        graph.addInertShape(shape);
        shape.toBack();
      }
    }
  
    function downloadJsonInBrowser(json:string, fileName:string) {  
      //Uses this file saver: https://github.com/Teleborder/FileSaver.js 
      var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
      (<any>window).saveAs(blob, fileName);
    }
  });

//Avoid compiler errors  
interface HTMLAnchorElement {
    download: string;
}

interface Window {
    URL: {
        createObjectURL(x);
    }
}
