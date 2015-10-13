/// <reference path="../main/Resource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
  export class ResourceEditorController {
    private $modalInstance:any;
    
    private arm:ArmTemplate;
    private resource:Resource;
    
    resourceJson:string;
    validationResult:string;
    
    /** @ngInject */
    constructor($modalInstance:any, arm:ArmTemplate, resource:Resource) {
      this.$modalInstance = $modalInstance;
      
      this.arm = arm;
      this.resource = resource;
      this.resourceJson = JSON.stringify(this.resource, null, 2);
    }
    
    validate() {
      try {
        JSON.parse(this.resourceJson);
        this.validationResult = "Valid JSON!";
      } catch(err) {
        this.validationResult = "Invalid JSON: " + err.toString();
      }
    }
    
    delete() {
      if(!confirm("Are you sure you want to delete this resource?")) {
        return;
      }
      
      let resource = this.resource;
      (<any>resource).deleteFlag = true;
      
      this.$modalInstance.close(resource);
    }
    
    save() {
      var newResource:Resource;
      
      try {
        newResource = JSON.parse(this.resourceJson);
      } catch(err) {
        alert('Invalid JSON: ' + err.toString());
        
        return;
      }
      
      //Update the EXISTING resource without destroying it
      for(var key in this.resource) {
        if(this.resource.hasOwnProperty(key)) {
          delete this.resource[key];
        }
      }
      
      $.extend(this.resource, newResource);
        
      this.$modalInstance.close(this.resource);
    };
  
    cancel() {
      this.$modalInstance.dismiss('cancel');
    };
  }
}