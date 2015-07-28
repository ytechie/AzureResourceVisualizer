angular.module('vis').controller('TemplatePropertiesCtrl', function ($scope, $modalInstance, templateData:ArmTemplateInterface) {
  $scope.parameters = templateData.parameters;
  $scope.propertyNames = Object.keys(templateData.parameters);
  
  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});