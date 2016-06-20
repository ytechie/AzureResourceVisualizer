/// <reference path="../../../typings/index.d.ts" />

module ArmViz {

  export class MainCtrl {
    private $scope: any;
    private $modal: any;
    private $http: any; //ng.IHttpProvider causes errors
    private $window: any;
    private template: ArmTemplate;
    private graph: Graph;
    private loadUrl: string; //Url from the address bar
    private loadedUrl: string;

    toolboxItems: ToolboxResource[];
    hideChrome = false;

    /** @ngInject */
    constructor($scope, $stateParams, $http, $window, $modal) {
      this.$scope = $scope;
      this.$modal = $modal;
      this.$http = $http;
      this.$window = $window;

      var toolboxItems = getToolboxItems();
      this.toolboxItems = toolboxItems;

      let templateData = <ArmTemplateInterface>arm;
      this.template = new ArmTemplate(templateData);

      this.graph = new Graph(toolboxItems);

      this.hideChrome = !!$stateParams.hideChrome;

      if ($stateParams.load) {
        this.loadUrl = $stateParams.load;
        this.loadedUrl = this.loadUrl;

        $scope.loadUrl = this.loadUrl;

        $http.get(this.loadUrl)
          .success((data: any, status, headers, config) => {
            this.template = new ArmTemplate(<ArmTemplateInterface>data);
            this.graph.applyTemplate(this.template);
            Telemetry.sendEvent('Template', 'LoadFromUrl', this.loadUrl);
          }).error((data, status, headers, config) => {
            alert('Error loading your template from GitHub. Please go back and try again.');
            Telemetry.sendEvent('Error', 'LoadTemplateFromUrlFailed', this.loadUrl + ': ' + status + ': ' + data);
          });
      } else {
        this.graph.applyTemplate(this.template);
      }

      this.graph.resourceSelected = (resource: Resource, modal: boolean) => {
        if (modal) {
          var modalInstance = $modal.open({
            templateUrl: '/app/resourceEditorDialog/ResourceEditor.html',
            controller: 'ResourceEditorController',
            controllerAs: 'main',
            size: 'lg',

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
          modalInstance.result.then((resultResource: any) => {
            if (resultResource && resultResource.deleteFlag) {
              this.template.deleteResource(<Resource>resultResource);
            }

            this.graph.refreshLinks();
          });
        } else {
          $scope.selectedResource = JSON.stringify(resource, null, 2);
          $scope.$apply();
        }
      };
    }

    downloadArmTemplate() {
      let json = this.template.toJson();

      this.downloadJsonInBrowser(json, 'armTemplate.json');
      Telemetry.sendEvent('Template', 'Download');
    }

    openExistingTemplate() {
      var modalInstance = this.$modal.open({
        templateUrl: '/app/openExistingTemplateDialog/OpenDialog.html',
        controller: 'OpenDialogController',
        controllerAs: 'main'
      });

      modalInstance.result.then((newTemplate: ArmTemplate) => {
        this.template = newTemplate;
        this.graph.applyTemplate(newTemplate);
        Telemetry.sendEvent('Template', 'OpenExisting');
      });
    }

    loadArmQuickstartTemplate() {
      var modalInstance = this.$modal.open({
        templateUrl: '/app/quickstartLoadDialog/QuickstartLoadDialog.html',
        controller: 'QuickstartLoadDialog',
        controllerAs: 'main'
      });

      modalInstance.result.then((result: DialogResult) => {
        this.template = result.armTemplate;
        this.loadedUrl = result.templateInfo.templateLink;
        this.graph.applyTemplate(result.armTemplate);
        Telemetry.sendEvent('Template', 'LoadArmQuickstart', result.templateInfo.name);
      });
    }

    openTemplateProperties() {
      //Documentation: http://angular-ui.github.io/bootstrap/#/modal
      this.$modal.open({
        templateUrl: '/app/templateParameterEditor/TemplateProperties.html',
        controller: 'TemplateParameterManager',
        controllerAs: 'main',
        size: 'lg',

        //These items get passed to the child controller
        resolve: {
          armTemplate: () => {
            return this.template;
          }
        }
      });
    }

    createVisualizeButton() {
      this.$modal.open({
        templateUrl: '/app/createVisualizerButton/createVisualizerButton.html',
        controller: 'CreateVisualizerButtonController',
        controllerAs: 'main',
        size: 'lg',

        //These items get passed to the child controller
        resolve: {
          loadUrl: () => {
            return this.loadedUrl;
          }
        }
      });
    }

    openPortalUIEditor() {
      this.$modal.open({
        templateUrl: '/app/portalUIEditor/PortalUIEditorDialog.html',
        controller: 'PortalUIEditorController',
        controllerAs: 'main',
        size: 'lg'
      });
    }

    deployToAzure() {
      this.$window.open('https://ms.portal.azure.com/');
    }

    toolboxItemClick(toolboxItem: ToolboxResource) {
      let jsonFileName = toolboxItem.getDefaultJsonFileName();
      let resource: Resource;

      if (jsonFileName) {
        if (toolboxItem.defaultJson) {
          //Used the cached JSON and avoid a server trip
          resource = <Resource>JSON.parse(toolboxItem.defaultJson); //$http returns JSON as an object
          this.template.resources.push(resource);
        } else {
          //This is the first time getting this resource type
          this.$http.get('/assets/toolbox-data/' + jsonFileName)
            .success((data: any, status, headers, config) => {
              resource = <Resource>data; //$http returns JSON as an object
              toolboxItem.defaultJson = JSON.stringify(data);
              this.template.resources.push(resource);
            }).error((data, status, headers, config) => {
              //Fall back to using a primitive resource default JSON
              resource = new Resource(toolboxItem);
              this.template.resources.push(resource);
              Telemetry.sendEvent('Error', 'RequestForToolboxJSONFailed', jsonFileName + ': ' + status + ': ' + data);
            });
        }
      } else {
        //No default JSON, use something really basic
        resource = new Resource(toolboxItem);
        this.template.resources.push(resource);
      }

      this.template.parseParametersFromTemplate();
      Telemetry.sendEvent('Toolbox', 'AddResource', toolboxItem.resourceType);
    }

    private downloadJsonInBrowser(json: string, fileName: string) {
      //Uses this file saver: https://github.com/Teleborder/FileSaver.js
      var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
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
    };
  }
}
