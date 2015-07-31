/// <reference path="Resource.ts" />
/// <reference path="ToolboxResource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

class ResourceShape extends joint.shapes.basic.Rect {
    markup:string = '<a><g class="rotatable"><g class="scalable"><rect/></g><image/><text/></g></a>';
    PNGRef: string;
    
    sourceResource:Resource;
    
    constructor(resource:Resource, toolboxItem:ToolboxResource) {
        super();
        
        this.sourceResource = resource;
                
       if(toolboxItem) {
            this.titleText = toolboxItem.friendlyName;
           
            this.attributes.attrs.image = { 'ref-x': 25, 'ref-y':5, ref: 'rect', width:60, height:60};
            this.PNGRef = "/assets/toolbox-icons/" + toolboxItem.iconName;
            this.attributes.attrs.image['xlink:href'] = this.PNGRef;
            
            this.attributes.attrs.text = {'ref-dy' :-15, ref: 'rect', 'ref-x':55,
                'x-alignment' :'middle', 'text': toolboxItem.friendlyName, 'fill': '#000000'};
       } else {
           this.titleText = this.sourceResource.type;
       }  
       
       this.attributes.attrs.rect.fill = '#FFFFFF';
       this.attributes.attrs.rect.stroke = '#0079D6';
       this.attributes.attrs.rect['stroke-width'] = 2;
          
    }
    
    
    set titleText(titleText:string) {
        this.attributes.attrs.text.text = titleText;
    }
}