/// <reference path="GithubTemplateReader.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

module ArmViz {
	export class QuickstartLoadDialog {
		private $scope:any;
		private $modalInstance:any;
		private $http:any;
		
		private github:GithubTemplateReader;
		
		categories:TemplateCategory[];
		templateMetadata:TemplateMetadataInterface;
		selectedCategory:TemplateCategory;
		
		/** @ngInject */
		constructor($scope, $modalInstance, $http) {
			this.$scope = $scope;
			this.$modalInstance = $modalInstance;
			this.$http = $http;
			
			this.github = new GithubTemplateReader();
			
			this.github.getTemplateCategories($http, (c) => this.categoriesReceived(c));
		}
		
		categoriesReceived(categories:TemplateCategory[]):void {	
			this.categories = categories;
		}
		
		categorySelected() {
			var category = this.selectedCategory
			
			this.github.getTemplateMetadata(this.$http, category, metadata => {
				this.templateMetadata = metadata;
			});
		}
	
		cancel() {
			this.$modalInstance.dismiss('cancel');
		};
		
		open() {
			var category = this.selectedCategory;
			
			this.github.getTemplate(this.$http, category, (armTemplate, parseError) => {
				if(parseError) {
					alert('Error parsing template: ' + parseError);
					return;
				}
				this.$modalInstance.close(armTemplate);
			});
		}
	}
}