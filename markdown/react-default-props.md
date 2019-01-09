# A Complete Guide to Default Props in React

React is a very powerful component-based framework for building scalable applications that can be run in different platforms - server, web, mobile, desktop, etc. Millions of applications running on these platforms today are built on top of React. Some of the amazing features of React include: lean framework, virtual DOM, JSX support, code reusablility. You can learn more about React from this documentation.

## Hello, React Component

React apps are usually a composition of several independent components that make up the UI of the application. React components are the building blocks of any React application. A React component is simply a JavaScript function that takes an object of arbitrary inputs known as `props` and returns React elements describing what should be rendered on the UI.

```js
// Simple React Component
function ReactHeader(props) {
  return <h1>React {props.version} Documentation</h1>
}
```

This code snippet defines a very simple React component that renders a `<h1>` element containing a heading for the documentation of a specified React version. It uses the JSX syntax for creating the DOM elements hierarchy of the component in a declarative way. You can learn more about using JSX with React here.

Without JSX, the previous code snippet will be written like this:

```js
// Simple React Component (without JSX)
function ReactHeader(props) {
  return React.createElement('h1', null, `React ${props.version} Documentation`);
}
```

JSX is not required for you to use React. If you intend to use React without any form of compilation, then JSX is not the way to go. In fact, every JSX in your React component is converted to its `createElement` equivalent before it is rendered. However, in this guide, JSX will be used in all code snippets where possible.

From the previous code snippets, it is pretty clear that the `ReactHeader` component requires that a `version` prop be passed to it. The `ReactHeader` component can be rendered on the DOM (inside an arbitrary `<div id="root">` element) as follows:

```js
// Render a React Component
ReactDOM.render(<ReactHeader version={16} />, document.getElementById('root'));
```

Notice here that the `ReactHeader` has been rendered with a `version` prop set to `16`. At the moment, everything seems to be working properly in the `ReactHeader` component as shown in the following screenshot.

## Default Props

**What happens when the `version` prop is not passed?**

Here is what happens when the `ReactHeader` component is rendered without the `version` prop.

```js
// Render the ReactHeader Component
ReactDOM.render(<ReactHeader />, document.getElementById('root'));
```

You probably might have guessed right. Since the `version` prop is not passed, the reference to `props.version` in the component is `undefined`, hence the above screenshot.

One way you could handle this is by applying **conditional rendering**. You can prevent the component from rendering whenever a required prop is not passed or is invalid and render noting instead, as shown in the following snippet:

```js
// Simple React Component
function ReactHeader(props) {
  return (
    Number.isFinite(props.version)
      ? <h1>React {props.version} Documentation</h1>
      : null
  );
}
```

Another way you could fix this is by setting **default props** for the component. You can tweak the component a bit to use a **default value** for the `version` prop whenever it is not passed. Here it is:

```js
// With JSX
function ReactHeader(props) {
  return <h1>React {props.version || 16} Documentation</h1>
}

// OR
// Without JSX
function ReactHeader(props) {
  return React.createElement('h1', null, `React ${props.version || 16} Documentation`);
}
```

Here, the logical `OR` (`||`) operator is used to set a fallback value for the `version` prop whenever it is not passed. A default value of `16` has been set for the `version` prop. This guide explores different methods of setting default props for React components.

In this guide, you will be exposed to different ways of setting default props for different flavours of React components:

1. Using `React.createClass()` API
2. Class Components
3. Functional Components
4. Using Higher-Order Components

## React.createClass()

In React, class components are suited for use cases where you need to maintain state internally within the component or when you want to leverage on the component's lifecycle methods.

When React was released initially, classes have not become a thing in JavaScript. Hence, there was actually no way of creating classes in JavaScript. However, React provided with the `React.createClass()` API for creating class-like components. Over time, this API was deprecated and finally removed from React in favor of ES6 classes.

If you are using a React version prior to `15.5.0`, then you can use the `React.createClass()` API to create a React component as follows:

```js
import React from 'react';

/**
 * ThemedButton Component
 * Using React.createClass()
 *
 * Renders a Bootstrap themed button element.
 */

const ThemedButton = React.createClass({

  // Component display name
  displayName: 'ThemedButton',

  // render() method
  render() {
    const { theme, label, ...props } = this.props;
    return <button className={`btn btn-${theme}`} {...props}>{ label }</button>
  }

});
```

This code snippet creates a very simplistic `ThemedButton` component using the `React.createClass()` API. This component simply renders a Bootstrap themed button based on the `props` passed to it. Also notice that it requires a `theme` prop and a `label` prop to properly render the button.

A set of themed buttons can be rendered on a React app as follows:

```js
import React from 'react';
import ReactDOM from 'react-dom';

function App(props) {
  return (
    <div>
      <ThemedButton theme="danger" label="Delete Item" />
      <ThemedButton theme="primary" label="Create Item" />
      <ThemedButton theme="success" label="Update Item" />
      <ThemedButton theme="warning" label="Add to Cart" />
      <ThemedButton />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
```

Notice here that the `ThemedButton` component has been rendered five times in the app. At the fifth time, the `ThemedButton` isn't passed any props. Here is a screenshot of what the app looks like:

From the above screenshot, you will notice that the fifth button isn't visually represented on the view, since it is rendered without `theme` and `label` props. Hence, there is need to set default props for the `ThemedButton` component.

For components created using the `React.createClass()` API, you can set default props by adding a method named `getDefaultProps` to the object literal.

The `getDefaultProps()` method should return an object representing the default props set for the component. Here it is:

```js
const ThemedButton = React.createClass({

  // Component display name
  displayName: 'ThemedButton',

  // render() method
  render() {
    const { theme, label, ...props } = this.props;
    return <button className={`btn btn-${theme}`} {...props}>{ label }</button>
  },

  // Set default props
  getDefaultProps() {
    return {
      theme: "secondary",
      label: "Button Text"
    };
  }

})
```

In this snippet, default props have been set for the `ThemedButton` component. The `theme` prop defaults to `"secondary"` if not passed, while the `label` prop defaults to `"Button Text"`.

With the default props set, the app should now look like the following screenshot:

## Class Components

With more recent versions of React, class components can be created by leveraging on the ES6 class syntax. This is what the `ThemedButton` component will look like using the ES6 class syntax.

```js
import React, { Component } from 'react';

class ThemedButton extends Component {
  render() {
    const { theme, label, ...props } = this.props;
    return <button className={`btn btn-${theme}`} {...props}>{ label }</button>
  }
}
```

For a React component created using the ES6 class syntax, you can set default props by adding a `static` property named `defaultProps` to the component class.

The `defaultProps` static property should be set to an object representing the default props for the component. This can be done by defining `defaultProps` on the component class itself, outside of the class body, as shown in the following code snippet:

```js
class ThemedButton extends React.Component {
  render() {
    // ...implement render method
  }
}

// Set default props
ThemedButton.defaultProps = {
  theme: "secondary",
  label: "Button Text"
};
```

With the addition of `static` class properties and methods to the ECMAScript specification, you can alternatively specify the `defaultProps` as shown in the following snippet:

```js
class ThemedButton extends React.Component {
  render() {
    // ...implement render method
  }

  // Set default props
  static defaultProps = {
    theme: "secondary",
    label: "Button Text"
  }
}
```

## Functional Components

In React, the function syntax is appropriate for components that simply render elements without keeping track of their state or lifecycle. These components are usually called _functional components_ or _stateless functional components_. Here is what the `ThemedButton` component will look like when re-written as a stateless functional component:

```js
import React from 'react';

function ThemedButton(props) {
  const { theme, label, ...restProps } = props;
  return <button className={`btn btn-${theme}`} {...restProps}>{ label }</button>
}
```

As with class components, you can set default props on a functional component by adding a static property named `defaultProps` to the component function itself.

```js
function ThemedButton(props) {
  // ...render component
}

ThemedButton.defaultProps = {
  theme: "secondary",
  label: "Button Text"
};
```

Alternatively, with the ES6 object destructuring syntax, you can destructure the `props` of a functional component with default values.

Here is what the `ThemedButton` component will look like with destructured props:

```js
import React from 'react';

// METHOD 1:
// Default Props with destructuring
function ThemedButton(props) {
  const { theme = 'secondary', label = 'Button Text', ...restProps } = props;
  return <button className={`btn btn-${theme}`} {...restProps}>{ label }</button>
}

// METHOD 2:
// More compact destructured props
function ThemedButton({ theme = 'secondary', label = 'Button Text', ...restProps }) {
  return <button className={`btn btn-${theme}`} {...restProps}>{ label }</button>
}
```

## Using Higher-Order Components

In React, a **higher-order component (HOC)** is basically a function that takes a React component as its argument and returns another React component, usually an enhancement of the original.

Higher-order components are very useful for component composition and there are a lot of packages that provide higher-order components that can be used with React components - a very popular one being **recompose**.

Recompose is a rich set of higher-order components that can be used with React components. It is more like Lodash for React. You can learn more about the higher-order components and API provided by recompose in [this reference](https://github.com/acdlite/recompose/blob/master/docs/API.md).

You can run the following command to install `recompose` as a dependency for your project:

```sh
npm install recompose --save
```

Recompose exports a `defaultProps` function that returns a higher-order component which sets the specified default props on any React component passed to it and returns the modified React component.

Here is how the `ThemedButton` component can be re-written using the `defaultProps` higher-order component from Recompose.

```js
import React from 'react';
import { defaultProps } from 'recompose';

// React Component
function ThemedButton(props) {
  const { theme, label, ...restProps } = props;
  return <button className={`btn btn-${theme}`} {...restProps}>{ label }</button>
}

// Default Props HOC
const withDefaultProps = defaultProps({
  theme: "secondary",
  label: "Button Text"
});

// Enhanced Component with default props
ThemedButton = withDefaultProps(ThemedButton);
```

## Conclusion

Using default props can bring about great improvements to your React components. In this guide, you have been exposed to several ways in which you can set default props for different flavors of React components you might have in your React application.
