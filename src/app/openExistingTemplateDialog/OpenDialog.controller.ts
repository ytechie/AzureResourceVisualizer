/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../main/ArmTemplate.ts" />

angular.module('vis').controller('OpenDialog.controller', function ($scope, $modalInstance, $http) {
	//$("templateFileInput").
	/*
	var input = document.getElementById('templateFileInput');
	input.addEventListener('change', function(e) {
		var reader = new FileReader();
		reader.onload = function(e2) {
			var text = reader.result;
		}
		reader.readAsText(input.files[0]);
	});
	*/
	

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
  	};
	  
	$scope.open = function () {
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			var json = <string>e.target.result;
			var armTemplate = <ArmTemplateInterface>JSON.parse(json);
			$modalInstance.close(armTemplate);
		}
		fileReader.readAsText($scope.file);
	}
});

angular.module("vis").directive("ngFileSelect",function(){
  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
        $scope.file = (e.srcElement || e.target).files[0];
      });
    } 
  }
});