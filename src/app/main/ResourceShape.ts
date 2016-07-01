/// <reference path="../../../typings/index.d.ts" />

module ArmViz {
  export class ResourceShape extends joint.shapes.basic.Generic {
    protected _minWidth = 100;
    protected _maxWidth = 200;
    protected _minHeight = 80;
    protected _maxHeight = 120;
    protected _defaultWidth = 120;
    protected _defaultHeight = 90;
    protected _width;
    protected _height;

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

    constructor(
      template: ArmTemplate,
      resource: Resource,
      toolboxItem: ToolboxResource,
      attributes?: any,
      options?: any) {
      super(attributes, options);

      this.sourceTemplate = template;
      this.sourceResource = resource;
      this.sourceToolboxItem = toolboxItem ? toolboxItem : new ToolboxResource(
        'Default Resource.png',
        this.sourceResource.type.split('/').pop(),
        this.sourceTemplate.resolveName(this.sourceResource.name)
      );

      this.initializeContent();
      this.resize(this.defaultWidth, this.defaultHeight);
    }

    get minWidth(): number {
      return this._minWidth;
    }

    get maxWidth(): number {
      return this._maxWidth;
    }

    get minHeight(): number {
      return this._minHeight;
    }

    get maxHeight(): number {
      return this._maxHeight;
    }

    get defaultWidth(): number {
      return this._defaultWidth;
    }

    get defaultHeight(): number {
      return this._defaultHeight;
    }

    get width(): number {
      return this._width;
    }

    set width(value: number) {
      if (this.width !== value) {
        this.resize(value, this.height);
      }
    }

    get height(): number {
      return this._height;
    }

    set height(value: number) {
      if (this.height !== value) {
        this.resize(this.width, value);
      }
    }

    resize(width: number, height: number): joint.dia.Element {
      width = Math.max(this.minWidth, Math.min(this.maxWidth, width));
      height = Math.max(this.minHeight, Math.min(this.maxHeight, height));

      super.resize(width, height);
      // console.log(width);
      // console.log(height);

      this._width = width;
      this._height = height;

      // Need to set size explicitly for IE and Edge
      this.attributes.attrs['.shape.root-layout'].width = width;
      this.attributes.attrs['.shape.root-layout'].height = height;
      this.attributes.attrs['.shape.title-bar'].width = width;


      return this;
    }


    private initializeContent() {
      let title = this.sourceToolboxItem.friendlyName;
      let name = this.sourceTemplate.resolveName(this.sourceResource.name);
      let icon = '/assets/toolbox-icons/' + this.sourceToolboxItem.iconName;

      this.attributes.attrs['.shape.root-layout'] = {
        'follow-scale': true,
        'stroke': '#0079D6',
        'stroke-width': 2,
      };

      this.attributes.attrs['.shape.title-bar'] = {
        'follow-scale': true,
        'fill': '#0079D6',
        'stroke-width': 0,
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
        'text': title,
        'id': 'shape-title-' + this.cid
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
        'text': name,
        'id': 'shape-name-' + this.cid
      };

      this.attributes.attrs['.shape.tooltip'] = {
        'text': 'Double-click to edit'
      };
    }
  }

  export class ResourceShapeView extends joint.dia.ElementView {
    constructor(options?: any) {
      super(options);
    }

    render(): Backbone.View<joint.dia.Cell> {
      super.render();

      let title: any = $('#shape-title-' + this.model.cid)[0];
      let name: any = $('#shape-name-' + this.model.cid)[0];
      let titleWidth = title.getBBox().width + 20;
      let nameWidth = name.getBBox().width + 20;
      let model = <ResourceShape>this.model;

      // Resize according to the length of title and name
      if (titleWidth > model.width) {
        model.width = titleWidth;
      }
      if (nameWidth > model.width) {
        model.width = nameWidth;
      }

      // Necessary for IE and Edge
      super.render();
      title = $('#shape-title-' + this.model.cid)[0];
      name = $('#shape-name-' + this.model.cid)[0];

      // Trim text content if it is too long
      if (titleWidth > model.maxWidth) {
        title.textContent = name.textContent.substr(0, 37) + '...';
      }
      if (nameWidth > model.maxWidth) {
        name.textContent = name.textContent.substr(0, 37) + '...';
      }

      return this;
    }
  }

  class Expression {
    operand: Expression[];

    execute() {
      return null;
    }
  }

}
