/// <reference path="TemplateParameterManager.ts" />
/// <reference path="ParameterModelItem.ts" />
/// <reference path="ParameterValueManager.ts" />
/// <reference path="../../../typings/underscore/underscore.d.ts" />

angular.module('vis').controller('TemplatePropertiesCtrl', function ($scope, $modalInstance, armTemplate:ArmTemplate) {

  var templateParameterManager = new TemplateParameterManager(armTemplate);
  var paramValues = new ParameterValuesTemplate.DeploymentParameters();

  var parameterModel = new Array<ParameterModelItem>();
  
  var parameterNames = templateParameterManager.getParameterNames();
  parameterNames.forEach(parameterName => {
    var parameterData = templateParameterManager.getParameterData(parameterName);
    parameterModel.push({
      name: parameterName,
      type: parameterData.type,
      defaultValue: parameterData.defaultValue,
      allowedValues: parameterData.allowedValues,
      value: '' // get from values JSON, but we will need to create the UI to load a params json file first
    });
  });
  
  $scope.templateParameterManager = templateParameterManager;
  $scope.parameterModel = parameterModel;
  
  $scope.save = function () {
    var parameterModel = <ParameterModelItem[]>$scope.parameterModel;
    var templateParameterManager = <TemplateParameterManager>$scope.templateParameterManager;
    
    synchronizeModelToTemplate(parameterModel, templateParameterManager);
    
    //$scope.parameterValues = ParameterValueManager.loadParamValues(parameterModel);
    
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
  
  $scope.genParamValues = function(){
    var paramValuesJSON = ParameterValueManager.generateJSON($scope.parameterModel);
    //alert('generated');
    //console.log(paramValuesJSON);
  }
  
  $scope.addParameter = function() {
    var newModelItem = new ParameterModelItem();
    parameterModel.push(newModelItem);
  }
  
  $scope.deleteParameter = function(parameter) {
    var index = parameterModel.indexOf(parameter);
    parameterModel.splice(index, 1);
  }
  
  function synchronizeModelToTemplate(modelParameters:ParameterModelItem[],
    templateParameterManager:TemplateParameterManager) {
      
    var templateParameters = templateParameterManager.armTemplate.parameters;
      
    modelParameters.forEach(modelItem => {
      var foundParameter = <Parameter>templateParameters[modelItem.name];
      
      if(foundParameter) {
        //Item is in both src and dest
        foundParameter.type = modelItem.type;
        foundParameter.defaultValue = modelItem.defaultValue;
        foundParameter.allowedValues = modelItem.allowedValues;
      } else {
        //Item is only in src
        var newParameter = new Parameter();
        newParameter.type = modelItem.type;
        newParameter.defaultValue = modelItem.defaultValue;
        newParameter.allowedValues = modelItem.allowedValues;
        
        templateParameterManager.armTemplate.parameters[modelItem.name] = newParameter;
      }
    });
    
    //Handle item only in dest
    var templateParameterNames = templateParameterManager.getParameterNames();
    templateParameterNames.forEach(templateParameterName => {
      var match = _.find(modelParameters, val => {
        return val.name === templateParameterName;
      });
      
      if(!match) {
        delete templateParameterManager.armTemplate.parameters[templateParameterName];
      }
    });
  }
});