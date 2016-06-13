module ArmViz {
  export class ToolboxResource {
    iconName: string;
    friendlyName: string;
    resourceType: string;
    private hasDefaultJson: boolean; //Indicates if there is a file with the default JSON

    //This is loaded dynamically at run-time
    defaultJson: string;

    constructor(iconName: string, friendlyName: string, resourceName: string, hasDefaultJson?: boolean) {
      this.iconName = iconName;
      this.friendlyName = friendlyName;
      this.resourceType = resourceName;

      this.hasDefaultJson = !!hasDefaultJson;
    }

    getDefaultJsonFileName() {
      if (!this.hasDefaultJson) {
        return null;
      }
      return this.resourceType.replace(new RegExp("/", 'g'), ".") + '.json';
    }
  }
}
