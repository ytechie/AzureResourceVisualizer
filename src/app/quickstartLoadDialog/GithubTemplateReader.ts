/// <reference path="../main/ArmTemplate.ts" />

/// <reference path="../../../typings/tsd.d.ts" />

///repos/:owner/:repo/contents/:path 

class GithubTemplateReader{
	private GithubApiRoot:string = 'https://api.github.com/'
	private GithubTemplateRoot:string = this.GithubApiRoot + 'repos/Azure/azure-quickstart-templates/contents/';
	
	getTemplateCategories($http:angular.IHttpProvider, callback: (categories:TemplateCategory[]) => void) {
		var reqUrl = this.GithubTemplateRoot;
		
		$http.get(reqUrl)
			.success(function(data:any[], status, headers, config) {
				//var dataObj = JSON.parse(data);
				var categories = new Array<TemplateCategory>();
				
				data.forEach(item => {
					if(item.type === 'dir') {
						var newCategory = new TemplateCategory();
						newCategory.name = item.name;
						newCategory.url = item.url;
						newCategory.html_url = item.html_url;
						
						categories.push(newCategory);
					}
				});

				callback(categories);
			})
			.error(function(data, status, headers, config) {
				throw new Error('Error in GitHub template reader getting data from GitHub ' + data);
			});
	}
	
	getTemplateMetadata($http:angular.IHttpProvider, categoryData:TemplateCategory, callback: (metadata:TemplateMetadataInterface) => void) {
		$http.get(this.GithubTemplateRoot + categoryData.name + '/' + 'metadata.json')
			.success(function(data:any, status, headers, config) {
				if(data.encoding !== "base64") {
					throw new Error("Github template reader was expecting base64 encoded file");
				}
				
				var fileContents = atob(data.content);
				var metadata = <TemplateMetadataInterface>JSON.parse(fileContents);
				callback(metadata);
			});
	}
	
	getTemplate($http:angular.IHttpProvider, categoryData:TemplateCategory, callback: (armTemplate:ArmTemplateInterface) => void) {
		$http.get(this.GithubTemplateRoot + categoryData.name + '/' + 'azuredeploy.json')
			.success(function(data:any, status, headers, config) {
				if(data.encoding !== "base64") {
					throw new Error("Github template reader was expecting base64 encoded file");
				}
				
				var fileContents = atob(data.content);
				var armTemplate = <ArmTemplateInterface>JSON.parse(fileContents);
				callback(armTemplate);
			});
	}
}

class TemplateCategory {
	name:string;
	url:string;
	html_url:string;
}

interface TemplateMetadataInterface {
	itemDisplayName:string;
	description:string;
	summary:string;
	githubUsername:string;
	dateUpdated:string;
}