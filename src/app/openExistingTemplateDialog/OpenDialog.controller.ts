/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../main/ArmTemplate.ts" />

angular.module('vis').controller('OpenDialog.controller', function ($scope, $modalInstance, $http) {
	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
  	};
	  
	$scope.open = function () {
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			var json = <string>(<any>e.target).result;
			let template = ArmTemplate.CreateFromJson(json);
			
			$modalInstance.close(template);
		}
		fileReader.readAsText($scope.file);
	}
});

angular.module("vis").directive("ngFileSelect",function(){
  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
        (<any>$scope).file = (<any>(e.srcElement || e.target)).files[0];
		$scope.$apply();
      });
    } 
  }
});