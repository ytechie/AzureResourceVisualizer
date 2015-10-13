/// <reference path="../../../typings/tsd.d.ts" />

module TemplateParameterEditor {  
  export class Controller {
    private $modalInstance:any;
    private armTemplate:ArmViz.ArmTemplate;
    private templateParameterManager:TemplateParameterManager;
    
    parameterModel:Array<ParameterModelItem>;
    
    /** @ngInject */
    constructor($modalInstance:any, armTemplate:ArmViz.ArmTemplate) {
      this.$modalInstance = $modalInstance;
      this.armTemplate = armTemplate;
      
      let templateParameterManager = new TemplateParameterManager(armTemplate);
      let paramValues = new DeploymentParameters();
    
      this.parameterModel = new Array<ParameterModelItem>();
      
      let parameterNames = templateParameterManager.getParameterNames();
      parameterNames.forEach(parameterName => {
        let parameterData = templateParameterManager.getParameterData(parameterName);
        this.parameterModel.push({
          name: parameterName,
          type: parameterData.type,
          defaultValue: parameterData.defaultValue,
          allowedValues: parameterData.allowedValues,
          value: '' // get from values JSON, but we will need to create the UI to load a params json file first
        });
      });
      
      this.templateParameterManager = templateParameterManager;
    }
      
    save() {      
      this.synchronizeModelToTemplate(this.parameterModel, this.templateParameterManager);
      
      this.$modalInstance.close();
    }
  
    cancel() {
      this.$modalInstance.dismiss('cancel');
    }
    
    genParamValues(){
      var paramValuesJSON = TemplateParameterEditor.generateJSON(this.parameterModel);
    }
    
    addParameter() {
      var newModelItem = new ParameterModelItem();
      this.parameterModel.push(newModelItem);
    }
    
    deleteParameter(parameter) {
      var index = this.parameterModel.indexOf(parameter);
      this.parameterModel.splice(index, 1);
    }
    
    private synchronizeModelToTemplate(modelParameters:ParameterModelItem[],
      templateParameterManager:TemplateParameterManager) {
        
      var templateParameters = templateParameterManager.armTemplate.parameters;
        
      modelParameters.forEach(modelItem => {
        var foundParameter = templateParameters[modelItem.name];
        
        if(foundParameter) {
          //Item is in both src and dest
          foundParameter.type = modelItem.type;
          foundParameter.defaultValue = modelItem.defaultValue;
          foundParameter.allowedValues = modelItem.allowedValues;
        } else {
          //Item is only in src
          var newParameter = new ArmViz.Parameter();
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
  }
}