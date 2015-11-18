/// <reference path="../../../typings/tsd.d.ts" />

module OpenDialog {	
	export class Controller {
		private $scope:any;
		private $modalInstance:any;
		private $http;
		
		/** @ngInject */
		constructor($scope, $modalInstance, $http) {
			this.$scope = $scope;
			this.$modalInstance = $modalInstance;
			this.$http = $http;
			
			this.$scope.blah = 'foo';
		}
		
		cancel() {
			this.$modalInstance.dismiss('cancel');
		}
		
		//this is using the FileSelect directive
		
		open() {
			var fileReader = new FileReader();
			fileReader.onload = (e) => {
				var json = <string>(<any>e.target).result;
				let template = ArmViz.ArmTemplate.CreateFromJson(json);
				
				this.$modalInstance.close(template);
			};
			fileReader.readAsText(this.$scope.file);
		}
	}
}