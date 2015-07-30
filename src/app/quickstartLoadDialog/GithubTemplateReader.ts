/// <reference path="../../../typings/tsd.d.ts" />

///repos/:owner/:repo/contents/:path 

class GithubTemplateReader{
	private GithubApiRoot:string = 'https://api.github.com/'
	
	getTemplateCategories($http:angular.IHttpProvider, callback: (categories:TemplateCategory[]) => void) {
		var reqUrl = this.GithubApiRoot + 'repos/Azure/azure-quickstart-templates/contents/'
		
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
}

class TemplateCategory {
	name:string;
	url:string;
	html_url:string;
}