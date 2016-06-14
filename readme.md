[![Build Status](https://travis-ci.org/ytechie/AzureResourceVisualizer.svg?branch=master)](https://travis-ci.org/ytechie/AzureResourceVisualizer)

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
	npm install -g gulp bower typings typescript
	bower install
	typings install

## Running

Build the website to serve it locally:

	gulp serve

### Troubleshooting

**Problem:** Old Typescript version installed. (use `tsc-v` to check)

**Solution:** Delete TypeScript from the `C:\Program Files (x86)\Microsoft SDKs\TypeScript`

## License

Available [here](https://github.com/ytechie/AzureResourceVisualizer/blob/master/LICENSE)
