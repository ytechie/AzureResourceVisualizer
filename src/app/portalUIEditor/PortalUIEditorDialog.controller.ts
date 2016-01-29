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

      ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Open');
    }
    
    validate() {
      try {
        JSON.parse(this.json);
        this.validationResult = "Valid JSON!";
        ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Validate', 'Passed');
      } catch(err) {
        this.validationResult = "Invalid JSON: " + err.toString();
        ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Validate', 'Failed');
      }
    }
  
    close() {
      this.$modalInstance.dismiss('cancel');
    };
    
    getEncodedEchoUrl() {
      var obj:any;
      try {
        obj = JSON.parse(this.json);
      } catch(err) {
          return null;
      }
      let cleanJson = JSON.stringify(obj);
      
      const portalUiUrl = 'https://portal.azure.com/?clientOptimizations=false#blade/Microsoft_Azure_Compute/CreateMultiVmWizardBlade/internal_bladeCallId/anything/internal_bladeCallerParams/{"initialData":{},"providerConfig":{"createUiDefinition":"{jsonUrl}"}}';
      
      let redirectorUrl = 'http://armportaluiredirector.azurewebsites.net/?json=';
      redirectorUrl += encodeURIComponent(cleanJson);
      redirectorUrl += '&redir=' + encodeURIComponent(portalUiUrl);
 
      return redirectorUrl;
    }
    
  }
}