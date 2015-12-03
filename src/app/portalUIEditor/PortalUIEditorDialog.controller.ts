/// <reference path="../main/Resource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

module PortalUIEditor {
  export class ResourceEditorController {
    private $modalInstance:any;
    private $http:any;
    
    json:string;
    validationResult:string;
    
    /** @ngInject */
    constructor($modalInstance:any, $http:any) {
      this.$modalInstance = $modalInstance;
      this.$http = $http;
    }
    
    validate() {
      try {
        JSON.parse(this.json);
        this.validationResult = "Valid JSON!";
      } catch(err) {
        this.validationResult = "Invalid JSON: " + err.toString();
      }
    }
  
    close() {
      this.$modalInstance.dismiss('cancel');
    };
    
    getEncodedEchoUrl() {
      return "https%3A%2F%2Fgist.githubusercontent.com%2Fytechie%2Ffc14095fb7d08c140933%2Fraw%2F5f5e96e593eb8e0d1f01da845156acd145489473%2Ftest.json";
      
      let obj = JSON.parse(this.json);
      let cleanJson = JSON.stringify(obj);
      
      //temp
      cleanJson = this.json;
      
      let encodedJson = btoa(cleanJson);
      
      let echoUrl = "http://urlecho.azurewebsites.net/?echo64=" + encodedJson;
      
      return encodeURIComponent(echoUrl);
    }
    
  }
}