/// <reference path="GithubTemplateReader.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
  export class DialogResult {
    armTemplate: ArmTemplate;
    templateInfo: TemplateCategory;

    constructor(armTemplate: ArmTemplate, templateInfo: TemplateCategory) {
      this.armTemplate = armTemplate;
      this.templateInfo = templateInfo;
    }
  }
}
