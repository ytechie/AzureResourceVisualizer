/// <reference path="../../typings/tsd.d.ts" />

module ArmViz {
  //Get the toolbox to be 100% of the window height...

  $('#sidebar').height($('#sidebar').siblings('#main-content').height());

  $(window).resize(function () {
    $('#sidebar').height($('#sidebar').siblings('#main-content').height());
  });
}
