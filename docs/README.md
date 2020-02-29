# Webcodesk User Guide

This User Guide assumes that you have completed tutorial in the online version of Webcodesk.

Although, you have the ability to complete the tutorial in the local version as well. 
Install Webcodesk locally and make a copy of the `Beginner tutorial` project.

## Start/stop project server

#### Star Webcodesk Server

Webcodesk server is run by command `yarn wcd` from the project directory.

There is no source code in the project directory at the first launch of Webcodesk. 
That's why Webcodesk provides you with a project template of your choice from marketplace.

After you have chosen a project, the project source code is downloaded from the marketplace.

The next time Webcodesk will open the project, which is in the current directory.

#### Webpack Dev Server

Webcodesk, in turn, launches Webpack Dev Server using scripts in the `react-scripts` module, that should be installed while copying the project template.

You can view the Webpack Dev Server log by clicking the third button in the upper left corner. Tooltip on the button: "Show development server log" button.
In the window that appears, you can change the Dev port of the server, stop it or restart it.

Dev server will stop automatically if you stop Webcodesk server.

#### Stop Webcodesk Server

Press `Ctrl + C` / `Command + C` key combination in the command line to stop Webcodesk Server.

## Get familiar with project

If you have already chosen and copied a project from the marketplace, then let's get familiar with the structure of its source code.

The structure of the source code is a bit different from what `create-react-app` generated.
Here is the file structure you can find in the project:

```
public/
src/
    app/
    etc/
    usr/
    index.css
    index.js
package.json
```

* **app** - there are configuration files for [React App Framework](https://github.com/webcodesk/react-app-framework)
* **etc** - here are the project configuration files.
* **usr** - the source code of the components and functions should be here.
* **index.js** - Webpack entry point.

You can create any other directories and files, but you should not rename these three directories and the entry point file for Webpack.

You should not change the files in `app` and `etc` directories because the files in these directories are created and modified directly by Webcodesk.
Manually changing files in these directories may cause Webcodesk to become unstable.

**Please note** Webcodesk currently can't add new files to the source code repository. 
So you should make sure that all files from `app` and `etc` directories are added to the source code repository.

## The React component source code

Webcodesk constantly watches for new files in the `usr` directory. 
Webcodesk will parse the source code of the file if a new file appears or if any of the existing files have been modified. 
Component source code files can be JS files as well as TypeScript files.

The React component file names should have a double extension:
* For JS `*.comp.js` or `*.comp.jsx`
* For TS `*.comp.ts` or `*.comp.tsx`
> You can use any other file names without double extensions, then Webcodesk will ignore them, but not Webpack.

Use the following templates to declare a component
> You can use any other way to describe the components in code, then Webcodesk will ignore them.

**Note that you can describe the component properties using PropTypes.** 
Then you will be able to change the value of the component properties in the property editor.  

### For class component with properties inside (JS)

* Component file name: 

```
Button.comp.js
```

* Component class declaration:

```javascript
/**
 * Here is the valuable description of the component that will appear in the component's README in Webcodesk
 */
class Button extends React.Component {

}

Button.propTypes = {
  /**
   * Button label text
   */
  label: PropTypes.string,
  /*
   * Triggered when the user clicks on the button. No output arguments for coupled functions.
   */
  onClick: PropTypes.func
};

Button.defaultProps = {
  label: 'Button'
};

export default Button;
```

> The file name and class name should match. The class of the component must be one in the file.

### For class component with properties outside (JS)

* Component file name: 

```
Button.comp.js
```

* Component class declaration:

```javascript

import ButtonTypes from './ButtonTypes.props';

/**
 * Here is the valuable description of the component that will appear in the component's README in Webcodesk
 */
class Button extends React.Component {

}

Button.propTypes = ButtonTypes;

Button.defaultProps = {
  label: 'Button'
};

export default Button;
```

> The file name and class name should match. The class of the component must be one in the file.

* PropTypes file name:

```
ButtonTypes.props.js
``` 

* PropTypes declaration:

```javascript
import PropTypes from 'prop-types';

export const ButtonTypes = {
  /**
   * Button label text
   */
  label: PropTypes.string,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['', 'round', 'extended']),
  /**
   * If true the circular progress is shown and button is disabled.
   */
  loading: PropTypes.bool,
  /*
   * Triggered when the user clicks on the button. No output arguments for coupled functions.
   */
  onClick: PropTypes.func
};
```

### For functional component with properties inside (JS)

* Component file name: 

```
Button.comp.js
```

* Component function declaration:

```javascript
/**
 * Here is the valuable description of the component that will appear in the component's README in Webcodesk
 */
const Button = (props) => {
};

Button.propTypes = {
  /**
   * Button label text
   */
  label: PropTypes.string,
  /*
   * Triggered when the user clicks on the button. No output arguments for coupled functions.
   */
  onClick: PropTypes.func
};

Button.defaultProps = {
  label: 'Button'
};

export default Button;
```

> The file name and the name of the constant should match. The constant of the component function should be the only one in the file.

### Possible component property types

Input props

* `PropTypes.string`
* `PropTypes.bool`
* `PropTypes.number`
* `PropTypes.object`
* `PropTypes.oneOf(['', 'val1', 'val2'])` - use only text or numeric values. Use it for the dropdown in the property editor.
* `PropTypes.node` - using for component composition. Use `node` if you want to show the placeholder in the page tree, but not in the page.
* `PropTypes.element` - using for component composition. Use for placeholder in the page tree and in the page editor.
* `PropTypes.arrayOf(<any possible type>)`
* `PropTypes.shape({...})` - using for grouping properties. Also, you can use if you want to split property types file: `PropTypes.shape(AnotherPropTypes)`

Output props

* `PropTypes.func` - each function property corresponds to the output point of the component instance in the flow diagram.     

File name pattern for external PropTypes file:
* For JS `*.props.js`
* For TS `*.props.ts`

## The function source code

Unlike components, several functions can be located in the same file. In tutorial they were called `Functions set`.
The name of the file with functions should also have a double extension:
* For JS `*.funcs.js`
* For TS `*.funcs.ts`

> You can use any other file names without double extensions, then Webcodesk will ignore them.

Functions in Webcodesk play the role of a link between components in flow diagram.

Use the following template to declare a function in a file:

```javascript
/**
 * A valuable description of the function. 
 * This description you will see in the Function set README in Webcodesk
 */
export const functionName = (options, {stateByDispatch, history}) => dispatch => {
};
```

Let's take a closer look at the real example of the function declaration below.

```javascript
/**
 * Performs the navigation to the page specified in the `pageRoutePath` property 
 * of the associated instance of the `PageRouteAnchor` component.
 * There's no incoming argument.
 */
export const goToPage = (options, {stateByDispatch, history}) => dispatch => {
  if (stateByDispatch && history) {
    const { pageRouteAnchorProps } = stateByDispatch;
    if (pageRouteAnchorProps && pageRouteAnchorProps.pageRoutePath) {
      history.push(pageRouteAnchorProps.pageRoutePath);
    }
    dispatch({
      pageRouteAnchorProps
    });
  }
};
```

First we need to figure out what a "dispatch" is. 
This is a callback function that is invoked by the React App Framework engine while the `goToPage` function is running.

In this example, you see the declaration of a single `dispatch` function call. 
The `dispatch` argument of the function must be an object. The names of the object fields will be used as output connection points on the diagram.

> That is, if you want to transfer data at some stage in the function, you just call `dispatch` with the declaration of the object and the field in it. 
  And you put the data into the field of the object.

In the example, you can see that `dispatch` is called for an object with `pageRouteAnchorProps` field. 
So when you place the function on the flow diagram, you will see `pageRouteAnchorProps` output in the function element.

Now about the arguments.

* **options** - the argument that is passed from the incoming connection in the flow diagram. 
For example, if you connect the `onClick` output of a component that passes a string, then the value of that string will be in `options`.

* **stateByDispatch** - the object used to get the state of component instance properties at runtime.
For example, if you connect the `pageRouteAnchorProps` output to the `props` input of a component instance, then there will be a state of that component instance in the `pageRouteAnchorProps` field of the `stateByDispatch` object.

So, if you want to change the properties of a component instance, you can get a reference to its state and create a new object.
Then you can change the values in the fields of the new state object and pass it to `dispatch`.

```javascript
export const setError = (options, {stateByDispatch}) => dispatch => {
  if (stateByDispatch) {
    const { newNoteFormProps } = stateByDispatch;
    dispatch({ newNoteFormProps: {...newNoteFormProps, ...{isError: true}} });
  }
};
``` 

> Each function output, which is connected to a component instance, is mapped to the `stateByDispatch` object.

* **history** - React Router history, you can use it when you want to navigate to other application pages.

In the example, you can see that the function gets the state of the connected component from `pageRouteAnchorProps`.
And goes to the page with the address in `pageRoutePath` property.

```javascript
export const goToPage = (options, {stateByDispatch, history}) => dispatch => {
  if (stateByDispatch && history) {
    const { pageRouteAnchorProps } = stateByDispatch;
    if (pageRouteAnchorProps && pageRouteAnchorProps.pageRoutePath) {
      history.push(pageRouteAnchorProps.pageRoutePath);
    }
    dispatch({
      pageRouteAnchorProps
    });
  }
};
``` 

## Build application

Use the command `yarn build` to create a distribution of your application.

If you have components or features that have not been included in the pages or flow diagrams, they will not be included in the application build.

Find all distribution files in the `build` directory.

## Ask questions

Visit the forum []():

* If you have questions about application development in Webcodesk
* If you have any suggestions for improving this document
* If you have any ideas to popularise Webcodesk in the developer community


-------

