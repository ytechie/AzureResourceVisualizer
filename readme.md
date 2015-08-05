# Azure Resource Visualizer

Azure provides an amazing feature called the Azure Resource Manager. The idea is that you create a JSON document that represents the resources and the relationships. You then call an API in Azure with that desired configuration, and it makes it happen.

You're Captain Picard of the USS Azure.

![Make it So](make-it-so.jpg)

JSON is amazing, and not just because we share a name. However, I think visually (think: Visio). Since JSON is easy to work with in JavaScript, and we have a variety of diagramming libraries, let's clean this up!

![Azure Resource Manager Diagram](arm-diagram.jpg)

Here is a quick [YouTube screencast](https://www.youtube.com/watch?v=5xP1-IrtNMU) I put together to give you an overview of the project.

<iframe width="640" height="480" src="https://www.youtube.com/embed/5xP1-IrtNMU?rel=0" frameborder="0" allowfullscreen></iframe>

## Future

We're using a [public Trello board](https://trello.com/b/41RiUCGs/azure-resource-visualizer) for managing the features and roadmap.

## Installation

	npm install
	npm install -g gulp bower tsd typescript mocha chai
	bower install
	tsd install

## Running

Build the website to serve it locally:

	gulp serve

### Troubleshooting

**Problem:** Old Typescript version installed. (use `tsc-v` to check)
**Solution:** Delete TypeScript from the `C:\Program Files (x86)\Microsoft SDKs\TypeScript`

## License

Microsoft Developer Experience & Evangelism

Copyright (c) Microsoft Corporation. All rights reserved.

THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.

The example companies, organizations, products, domain names, e-mail addresses, logos, people, places, and events depicted herein are fictitious. No association with any real company, organization, product, domain name, email address, logo, person, places, or events is intended or should be inferred.
