'use strict';

angular.module('vis')
  .controller('MainCtrl', function ($scope) {
    $scope.toolboxItems = [
    	{
    		name: 'Virtual Machine',
    		icon: 'Virtual machine.png'
    	},
    	{
    		name: 'Load Balancer',
    		icon: 'Azure load balancer.png'
    	}
    ];
    
    init();
    createNodes();
    createLinks();
    layoutNodes();
    initializeClickPopup();
  });


