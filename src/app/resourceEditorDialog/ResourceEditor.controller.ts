/// <reference path="../main/Resource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
  export class ResourceEditorController {
    private $modalInstance: any;

    private arm: ArmTemplate;
    private resource: Resource;

    resourceJson: string;
    validationResult: string;

    /** @ngInject */
    constructor($modalInstance: any, arm: ArmTemplate, resource: Resource) {
      this.$modalInstance = $modalInstance;

      this.arm = arm;
      this.resource = resource;
      this.resourceJson = JSON.stringify(this.resource, null, 2);

      Telemetry.sendEvent('ResourceEditor', 'Open', this.resource.type);
    }

    validate() {
      try {
        JSON.parse(this.resourceJson);
        this.validationResult = "Valid JSON!";
        Telemetry.sendEvent('ResourceEditor', 'Validate', 'Passed');
      } catch (err) {
        this.validationResult = "Invalid JSON: " + err.toString();
        Telemetry.sendEvent('ResourceEditor', 'Validate', 'Failed: ' + this.resource.type + ": " + err.toString());
      }
    }

    delete() {
      if (!confirm("Are you sure you want to delete this resource?")) {
        return;
      }

      let resource = this.resource;
      (<any>resource).deleteFlag = true;

      this.$modalInstance.close(resource);

      Telemetry.sendEvent('ResourceEditor', 'Delete', this.resource.type);
    }

    save() {
      var newResource: Resource;

      try {
        newResource = JSON.parse(this.resourceJson);
      } catch (err) {
        alert('Invalid JSON: ' + err.toString());
        Telemetry.sendEvent('ResourceEditor', 'SaveFailed-InvalidJSON', this.resource.type + ": " + err.toString());
        return;
      }

      //Update the EXISTING resource without destroying it
      for (var key in this.resource) {
        if (this.resource.hasOwnProperty(key)) {
          delete this.resource[key];
        }
      }

      $.extend(this.resource, newResource);

      this.$modalInstance.close(this.resource);

      Telemetry.sendEvent('ResourceEditor', 'Save', this.resource.type);
    };

    cancel() {
      this.$modalInstance.dismiss('cancel');
    };
  }
}
