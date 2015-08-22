'use strict';

angular.module('vis', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/?load',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });
  
  
//Trying to get the toolbox to be 100% of the window height...
  
$('#sidebar').height($('#sidebar').siblings('#main-content').height());

$(window).resize(function(){

$('#sidebar').height($('#sidebar').siblings('#main-content').height());

});