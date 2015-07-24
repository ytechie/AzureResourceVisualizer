/// <reference path="Resource.ts" />
/// <reference path="ToolboxResource.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

class ResourceShape extends joint.shapes.basic.Rect {
    markup:string = '<a><g class="rotatable"><g class="scalable"><rect/></g><text/></g></a>';
    sourceResource:Resource;
    
    constructor(resource:Resource, toolboxItem:ToolboxResource) {
        super();
        
        this.sourceResource = resource;
                
       if(toolboxItem) {
           this.titleText = toolboxItem.friendlyName;
       } else {
           this.titleText = this.sourceResource.type;
       } 
    }
    
    set titleText(titleText:string) {
        this.attributes.attrs.text.text = titleText;
    }
}