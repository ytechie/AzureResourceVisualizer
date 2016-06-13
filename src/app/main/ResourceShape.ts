/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
  export class ResourceShape extends joint.shapes.basic.Generic {
    markup: string = [
      '<g class="rotatable">',
      '<g class="scalable">',
      '<rect class="shape root-layout"/>',
      '<rect class="shape title-bar"/>',
      '</g>',
      '<text class="shape title"/>',
      '<image class="shape icon"/>',
      '<text class="shape name"/>',
      '<title class="shape tooltip"/>',
      '</g>'
    ].join('');

    sourceTemplate: ArmTemplate;
    sourceResource: Resource;
    sourceToolboxItem: ToolboxResource;

    constructor(template: ArmTemplate, resource: Resource, toolboxItem: ToolboxResource) {
      super();

      this.sourceTemplate = template;
      this.sourceResource = resource;
      this.sourceToolboxItem = toolboxItem ? toolboxItem : new ToolboxResource(
        'Default Resource.png',
        this.sourceResource.type.split('/').pop(),
        this.sourceTemplate.resolveName(this.sourceResource.name)
      );

      this.initializeContent();
      this.resize(120, 90);
    }

    private initializeContent() {
      let title = this.sourceToolboxItem.friendlyName;
      let name = this.sourceTemplate.resolveName(this.sourceResource.name);
      let icon = '/assets/toolbox-icons/' + this.sourceToolboxItem.iconName;

      this.attributes.attrs['.shape.root-layout'] = {
        'follow-scale': true,
        'stroke': '#0079D6',
        'stroke-width': 2,
        'width': 120,   // Need to set size explicitly for IE and Edge
        'height': 90
      };

      this.attributes.attrs['.shape.title-bar'] = {
        'follow-scale': true,
        'fill': '#0079D6',
        'stroke-width': 0,
        'width': 120,
        'height': 15
      };

      this.attributes.attrs['.shape.title'] = {
        'ref': '.shape.root-layout',
        'ref-x': 4,
        'ref-y': 2,
        'fill': 'white',
        'stroke-width': 0,
        'font-size': 10,
        'font-weight': 'bold',
        'text': title
      };

      this.attributes.attrs['.shape.icon'] = {
        'ref': '.shape.root-layout',
        'ref-x': .5,
        'ref-y': .5,
        'x-alignment': 'middle',
        'y-alignment': 'middle',
        'width': 48,
        'height': 48,
        'xlink:href': icon
      };

      this.attributes.attrs['.shape.name'] = {
        'ref': '.shape.root-layout',
        'ref-x': 4,
        'ref-y': 75,
        'font-size': 10,
        'fill': 'black',
        'stroke-width': 0,
        'text': name
      };

      this.attributes.attrs['.shape.tooltip'] = {
        'text': 'Double-click to edit'
      };
    }
  }
}
