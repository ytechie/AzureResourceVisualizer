/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
    export class Telemetry {

        static sendEvent(category:string, action:string, label?:string, value?:number) {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label,
                eventValue: value
            });
        }
    }
}