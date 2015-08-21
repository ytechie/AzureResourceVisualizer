/// <reference path="ToolboxResource.ts" />
/// <reference path="graph.ts" />
/// <reference path="sampleARM.ts" />
/// <reference path="ToolboxItems.ts" />
/// <reference path="Shapes.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />

angular.module('vis')
  .controller('MainCtrl', function ($scope, $http, $modal) {
          
    $scope.toolboxItems = toolboxItems;
    
    let templateData = <ArmTemplateInterface>arm;
    let template = new ArmTemplate(templateData);
    
    var graph = new Graph(toolboxItems);
    
    //Check the referrer to see if there is a template. Not sure if
    //there is a way to make this more generic.
    let referrer = document.referrer;
    //referrer = 'https://github.com/Azure/azure-quickstart-templates/tree/master/101-create-security-group'
    if(referrer && referrer.indexOf("github.com/Azure/azure-quickstart-templates/") >= 0) {
      let urlParts = referrer.split("/");
      let quickStart = urlParts[urlParts.length - 1];
      
      let githubUrl = 'https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/'
        + quickStart
        + '/azuredeploy.json';
      
      let category = $http.get(githubUrl)
        .success(function(data:any, status, headers, config) {
          template = new ArmTemplate(<ArmTemplateInterface>data);
          graph.applyTemplate(template);
        }).error(function(data, status, headers, config) {
				  alert('Error loading your template from GitHub. Please go back and try again.')
			  });
    }
    
    //graph.applyTemplate(template);
    
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
      //Crazy code to download the resulting JSON file
      //http://bgrins.github.io/devtools-snippets/#console-save
      var blob = new Blob([json], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')
      
        //A typescript guru could probably figure out how to get rid of these errors
      
        a.download = 'armTemplate.json';
        a.href = window.URL.createObjectURL(blob);
        (<any>a.dataset).downloadurl =  ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
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
