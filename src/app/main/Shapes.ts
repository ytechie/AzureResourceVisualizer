/// <reference path="../../../typings/tsd.d.ts" />

class Shape extends joint.shapes.basic.Rect {
    
}

class Group extends Shape {
    markup:string = '<a><g class="rotatable"><text/><g class="scalable"><rect/></g></g></a>';

    constructor() {
        super({
            size: { height: 300, width: 300 }
        });
        
        this.attr({
           rect: {
               'fill': '#FFFFFF',
               'fill-opacity': 0,
               'stroke-width': 3,
               'z-index': -1
           },
           text: {
            ref: 'rect',
            'ref-y': 12,
            'x-alignment': 'middle',
            'text': 'foo group',
            'fill': '#000000',
            'font-size': 16
           }
        });
    }
}