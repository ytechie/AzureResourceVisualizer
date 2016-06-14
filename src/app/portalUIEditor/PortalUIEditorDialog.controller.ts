/// <reference path="../main/Resource.ts" />
/// <reference path="../../../typings/index.d.ts" />

module PortalUIEditor {
  export class ResourceEditorController {
    private $modalInstance: any;
    private $http: any;
    private $window: any;

    json: string;
    validationResult: string;

    /** @ngInject */
    constructor($modalInstance: any, $http: any, $window: any) {
      this.$modalInstance = $modalInstance;
      this.$http = $http;
      this.$window = $window;

      ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Open');
    }

    validate() {
      try {
        JSON.parse(this.json);
        this.validationResult = "Valid JSON!";
        ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Validate', 'Passed');
      } catch (err) {
        this.validationResult = "Invalid JSON: " + err.toString();
        ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Validate', 'Failed: ' + err.toString());
      }
    }

    close() {
      this.$modalInstance.dismiss('cancel');
    };

    preview() {
      console.log('preview!');
      var obj: any;
      try {
        obj = JSON.parse(this.json);
      } catch (err) {
        this.validationResult = "Invalid JSON: " + err.toString();
        ArmViz.Telemetry.sendEvent('PortalUIEditor', 'Preview', 'Failed: ' + err.toString());

        return null;
      }

      let url = 'http://armportaluiredirector.azurewebsites.net/?json=POST';

      this.$http.post(url, obj).then((response) => {
        //console.log('Got response: ' + response);
        let cacheUrl = response.data;

        let portalUiUrl = 'https://portal.azure.com/#blade/Microsoft_Azure_Compute/CreateMultiVmWizardBlade/internal_bladeCallId/anything/internal_bladeCallerParams/{"initialData":{},"providerConfig":{"createUiDefinition":"{jsonUrl}"}}';
        portalUiUrl = portalUiUrl.replace('{jsonUrl}', cacheUrl);

        this.$window.open(portalUiUrl);
      }, (response) => {
        console.error('Not sure what to do: ' + response);
      });
    }

  }
}
