# Azure Resource Visualizer

A visual way of visualizing, editing, and saving Azure Resource Manager Templates.

![Azure Resource Manager Diagram](arm-diagram.jpg)

Here is a quick [YouTube screencast](https://www.youtube.com/watch?v=5xP1-IrtNMU) I put together to give you an overview of the project.

<iframe width="640" height="480" src="https://www.youtube.com/embed/5xP1-IrtNMU?rel=0" frameborder="0" allowfullscreen></iframe>

## Future / Project Status

There is still much to be done. Right now, the resource relationship parser is not perfect, but there is a plan in place to support all possible ARM Template dependencies. Also, the creation experience is currently lacking.

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
