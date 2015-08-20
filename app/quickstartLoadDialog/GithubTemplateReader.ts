/// <reference path="../main/ArmTemplate.ts" />

/// <reference path="../../../typings/tsd.d.ts" />

///repos/:owner/:repo/contents/:path 

class GithubTemplateReader{
	private GithubApiRoot:string = 'https://api.github.com/'
	private GithubTemplateRoot:string = this.GithubApiRoot + 'repos/Azure/azure-quickstart-templates/contents/';
	
	getTemplateCategories($http:angular.IHttpProvider, callback: (categories:TemplateCategory[]) => void) {
		var reqUrl = this.GithubTemplateRoot;
		
		(<any>$http).get(reqUrl)
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
		(<any>$http).get(this.GithubTemplateRoot + categoryData.name + '/' + 'metadata.json')
			.success(function(data:any, status, headers, config) {
				if(data.encoding !== "base64") {
					throw new Error("Github template reader was expecting base64 encoded file");
				}
				
				var fileContents = atob(data.content);
				var metadata = <TemplateMetadataInterface>JSON.parse(fileContents);
				callback(metadata);
			});
	}
	
	getTemplate($http:angular.IHttpProvider, categoryData:TemplateCategory,
		callback: (armTemplate:ArmTemplate, parseError:string) => void) {
		(<any>$http).get(this.GithubTemplateRoot + categoryData.name + '/' + 'azuredeploy.json')
			.success(function(data:any, status, headers, config) {
				if(data.encoding !== "base64") {
					throw new Error("Github template reader was expecting base64 encoded file");
				}
				
				var base64 = data.content;
				var byteOrderMark = "77u/";
				if(base64.substring(0, byteOrderMark.length) === byteOrderMark) {
					base64 = base64.substring(byteOrderMark.length, base64.length);
				}
				
				var fileContents = atob(base64);
				
				var armTemplate:ArmTemplate = null;
				var parseError:string;
				try
				{
					armTemplate = ArmTemplate.CreateFromJson(fileContents);
				}
				catch(err) {
					parseError = err.toString();
				}
				callback(armTemplate, parseError);
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