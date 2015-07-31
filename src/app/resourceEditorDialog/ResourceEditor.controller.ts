/// <reference path="../main/Resource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

angular.module('vis').controller('ResourceEditorController', function ($scope, $modalInstance, resource:Resource) {
	$scope.resource = resource;
  $scope.resourceJson = JSON.stringify(resource, null, 2);
  
  $scope.save = function () {
    var newResource:Resource;
    
    try {
      newResource = JSON.parse($scope.resourceJson);
      
      //Update the EXISTING resource without destroying it
      for(var key in resource) {
        if(resource.hasOwnProperty(key)) {
          delete resource[key];
        }
      }
      
      $.extend(resource, newResource);
    } catch(err) {
      alert('Invalid JSON: ' + err.toString());
      
      return;
    }
      
	  $modalInstance.close(resource);
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
	
}