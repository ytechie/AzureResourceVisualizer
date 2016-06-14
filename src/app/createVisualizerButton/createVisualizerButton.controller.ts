/// <reference path="../../../typings/index.d.ts" />

module ArmViz {
  export class CreateVisualizerButtonController {
    private $scope: any;
    private $modalInstance: any;
    private $http;

    buttonHtml: string;

    /** @ngInject */
    constructor($scope, $modalInstance, $http, loadUrl) {
      this.$scope = $scope;
      this.$modalInstance = $modalInstance;
      this.$http = $http;

      this.buttonHtml = '<a href="http://armviz.io/#/?load=' + loadUrl + '" target="_blank">' + '\n';
      this.buttonHtml += '  <img src="http://armviz.io/visualizebutton.png"/>' + '\n';
      this.buttonHtml += '</a>';
    }

    cancel() {
      this.$modalInstance.dismiss('cancel');
    }

  }
}
