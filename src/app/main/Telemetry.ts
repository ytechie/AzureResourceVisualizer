/// <reference path="../../../typings/index.d.ts" />

module ArmViz {
  declare var ga: any;

  export class Telemetry {
    static sendEvent(category: string, action: string, label?: string, value?: number) {
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
