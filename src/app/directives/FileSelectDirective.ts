/// <reference path="../../../typings/tsd.d.ts" />

module Directives {
  /** @ngInject */
  export function ngFileSelect(): ng.IDirective {
    return {
      link: function ($scope, el) {
        el.bind("change", (e) => {
          (<any>$scope).file = (<any>(e.srcElement || e.target)).files[0];
          $scope.$apply();
        });
      }
    };
  };
}
