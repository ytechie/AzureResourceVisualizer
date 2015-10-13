/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
  
  export class MainCtrl {
    private $scope:any;
    private $modal:any;
    private template:ArmTemplate;
    private graph:Graph;
    
    toolboxItems:ToolboxResource[];
    
    /** @ngInject */
    constructor($scope, $stateParams, $http, $modal) {
      this.$scope = $scope;
      this.$modal = $modal;
      
      var toolboxItems = getToolboxItems();
      this.toolboxItems = toolboxItems;
      
      let templateData = <ArmTemplateInterface>arm;
      this.template = new ArmTemplate(templateData);
      
      this.graph = new Graph(toolboxItems);
      
      if($stateParams.load) {
        let loadUrl = $stateParams.load;
        
        $scope.loadUrl = loadUrl;
        
        let category = $http.get(loadUrl)
          .success((data:any, status, headers, config) => {
            this.template = new ArmTemplate(<ArmTemplateInterface>data);
            this.graph.applyTemplate(this.template);
          }).error((data, status, headers, config) =>{
            alert('Error loading your template from GitHub. Please go back and try again.')
          });
      } else {
        this.graph.applyTemplate(this.template);
      }
    
      this.graph.resourceSelected = (resource:Resource, modal:boolean) => {
        if(modal) {        
          var modalInstance = $modal.open({
            templateUrl: '/app/resourceEditorDialog/ResourceEditor.html',
            controller: 'ResourceEditorController',
            controllerAs: 'main',
            
            //These items get passed to the child controller
            resolve: {
              arm: () => {
                return this.template;
              },
              resource: () => {
                return resource;
              }
            }
          });
          modalInstance.result.then((resultResource:any) => {
            if(resultResource && resultResource.deleteFlag) {
              this.template.deleteResource(<Resource>resultResource);
            }
          });
        } else {
          $scope.selectedResource = JSON.stringify(resource, null, 2);
          $scope.$apply();
        }
      }
    }
       
    downloadArmTemplate() {
      let json = this.template.toJson();
      
      this.downloadJsonInBrowser(json, 'armTemplate.json');
    }
      
      openExistingTemplate() {
        var modalInstance = this.$modal.open({
          templateUrl: '/app/openExistingTemplateDialog/OpenDialog.html',
          controller: 'OpenDialogController',
          controllerAs: 'main'
        });
              
        modalInstance.result.then((newTemplate:ArmTemplate) => {
          this.template = newTemplate;
          this.graph.applyTemplate(newTemplate);
        });
      }
      
      loadArmQuickstartTemplate() {
        var modalInstance = this.$modal.open({
          templateUrl: '/app/quickstartLoadDialog/QuickstartLoadDialog.html',
          controller: 'QuickstartLoadDialog',
          controllerAs: 'main'
        });
              
        modalInstance.result.then((newTemplate:ArmTemplate) => {
          this.template = newTemplate;
          this.graph.applyTemplate(newTemplate);
        });
      }
      
      openTemplateProperties() {
        //Documentation: http://angular-ui.github.io/bootstrap/#/modal
        var modalInstance = this.$modal.open({
        templateUrl: '/app/templateParameterEditor/TemplateProperties.html',
        controller: 'TemplateParameterManager',
        controllerAs: 'main',
        size: 'lg',
        
        //These items get passed to the chiid controller
        resolve: {
          armTemplate: () => {
            return this.template;
          }
        }
        });
      }
      
      toolboxItemClick(toolboxItem:ToolboxResource) {
        var resource = new Resource(toolboxItem);
        
        this.template.resources.push(resource);
      }
      
      addShape(name:string) {
        if(name === 'group') {
          var shape = new Group();
          this.graph.addInertShape(shape);
          shape.toBack();
        }
      }
    
      private downloadJsonInBrowser(json:string, fileName:string) {  
        //Uses this file saver: https://github.com/Teleborder/FileSaver.js 
        var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
        (<any>window).saveAs(blob, fileName);
      }
    }
  
  //Avoid compiler errors  
  interface HTMLAnchorElement {
      download: string;
  }
  
  interface Window {
      URL: {
          createObjectURL(x);
      }
  }
}