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
           
            this.attributes.attrs.image = { 'ref-x': 20, 'ref-y':0, ref: 'rect', width:60, height:60};
            this.PNGRef = "/assets/toolbox-icons/" + toolboxItem.iconName;
            this.attributes.attrs.image['xlink:href'] = this.PNGRef;
            
            this.attributes.attrs.text = {'ref-dy' :-15, ref: 'rect', 'ref-x':50, 'x-alignment' :'middle', 'text': toolboxItem.friendlyName};
       } else {
           this.titleText = this.sourceResource.type;
       }  
       
       this.attributes.attrs.rect.fill = '#E67E22';
       this.attributes.attrs.rect.stroke = '#D35400';
       this.attributes.attrs.rect['stroke-width'] = 5;
          
    }
    
    
    set titleText(titleText:string) {
        this.attributes.attrs.text.text = titleText;
    }
}