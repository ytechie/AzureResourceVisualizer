/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
    export class ResourceShape extends joint.shapes.basic.Rect {
        markup:string = '<a><g class="rotatable"><g class="scalable"><rect/></g><image/><text/><title/></g></a>';
        PNGRef: string;
        
        sourceTemplate:ArmTemplate;
        sourceResource:Resource;
        sourceToolboxItem:ToolboxResource;
        
        constructor(template:ArmTemplate, resource:Resource, toolboxItem:ToolboxResource) {
            super();
            
            this.sourceTemplate = template;
            this.sourceResource = resource;
            this.sourceToolboxItem = toolboxItem;
            
            let titleText = toolboxItem ? toolboxItem.friendlyName : resource.name.split('/').pop();
            let iconName = toolboxItem ? toolboxItem.iconName : 'Default Resource.png';
            
            this.attributes.attrs.image = { 'ref-x': 25, 'ref-y':5, ref: 'rect', width:60, height:60};
            this.PNGRef = "/assets/toolbox-icons/" + iconName;
            this.attributes.attrs.image['xlink:href'] = this.PNGRef;
            this.attributes.attrs.text = {'ref-dy' :-15, ref: 'rect', 'ref-x':55,
                'x-alignment' :'middle', 'text': titleText, 'fill': '#000000'};
            
            //Override the title if it's a deployment
            if(this.sourceResource.type === "Microsoft.Resources/deployments") {
                this.attributes.attrs.text.text = template.resolveName(resource.name);
            }
            
            this.attributes.attrs.rect.fill = '#FFFFFF';
            this.attributes.attrs.rect.stroke = '#0079D6';
            this.attributes.attrs.rect['stroke-width'] = 2;
            
            this.attributes.attrs.title = {'text': 'Double-click to edit'};
        }
    }
}