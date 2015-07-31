/// <reference path="GithubTemplateReader.ts" />
/// <reference path="../../../typings/tsd.d.ts" />

angular.module('vis').controller('QuickstartLoadDialog', function ($scope, $modalInstance, $http) {
	var github = new GithubTemplateReader();
	
	github.getTemplateCategories($http, categoriesReceived);
	
	function categoriesReceived(categories:TemplateCategory[]):void {
		$scope.categories = categories;	
	}
	
	$scope.categorySelected = function() {
		var category = <TemplateCategory>$scope.selectedCategory
		
		github.getTemplateMetadata($http, category, metadata => {
			$scope.templateMetadata = metadata;
		});
	}

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
  	};
	  
	$scope.open = function () {
		var category = <TemplateCategory>$scope.selectedCategory;
		
		github.getTemplate($http, category, (armTemplate, parseError) => {
			if(parseError) {
				alert('Error parsing template: ' + parseError);
				return;
			}
			$modalInstance.close(armTemplate);
		});
	}
});