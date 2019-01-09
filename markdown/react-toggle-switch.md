# Build a Custom Toggle Switch with React

Building web applications usually involves making provisions for user interactions. One of the major ways of making provision for user interactions is through forms. Different form components exist for taking different kinds of input from the user. For example, a password component takes sensitive information from a user and masks the information so that it is not visible.

Most times, the information you need to get from a user is **boolean-like** - for example: _yes_ or _no_, _true_ or _false_, _enable_ or _disable_, _on_ or _off_, etc. Traditionally, the checkbox form component is used for getting these kinds of input. However, in modern interface designs, toggle switches are commonly used as checkbox replacements, although there are some accessibility concerns.

![{block|border} Checkbox vs Toggle Switch](https://i.imgur.com/VmaxGKX.png "Checkbox vs Toggle Switch")

In this tutorial, we will see how to build a custom toggle switch component with React. At the end of the tutorial, we would have built a very simple demo React app that uses our custom toggle switch component.

Here is a demo of the final application we will be building in this tutorial.

![{block|border} Application Demo](https://i.imgur.com/5ePljO1.gif "Application Demo")

## Prerequisites

Before getting started, you need to ensure that you have [Node][nodejs] already installed on your machine. I will also recommend that you install the [Yarn][yarn] package manager on your machine, since we will be using it for package management instead of [npm][npm] that ships with Node. You can follow this [Yarn installation guide][yarn-install] to install `yarn` on your machine.

We will create the boilerplate code for our React app using the [`create-react-app`][create-react-app] command-line package. You also need to ensure that it is installed globally on your machine. If you are using `npm >= 5.2` then you may not need to install `create-react-app` as a global dependency since we can use the `npx` command.

Finally, this tutorial assumes that you are already familiar with React. If that is not the case, you can check the [React Documentation][reactjs] to learn more about React.

## Getting Started

### Create new Application

Start a new React application using the following command. You can name the application however you desire.

```sh
create-react-app react-toggle-switch
```

> **`npm >= 5.2`**
>
> If you are using `npm` version `5.2` or higher, it ships with an additional `npx` binary. Using the `npx` binary, you don't need to install `create-react-app` globally on your machine. You can start a new React application with this simple command:
>
>```sh
>npx create-react-app react-toggle-switch
>```

### Install Dependencies

Next, we will install the dependencies we need for our application. Run the following command to install the required dependencies.

```sh
yarn add lodash bootstrap prop-types classnames
yarn add -D npm-run-all node-sass-chokidar
```

We have installed `node-sass-chokidar` as a development dependency for our application to enable us use SASS. For more information about this, see [this guide][create-react-app-sass].

### Modify the npm Scripts

Edit the `package.json` file and modify the `scripts` section to look like the following:

```json
"scripts": {
  "start:js": "react-scripts start",
  "build:js": "react-scripts build",
  "start": "npm-run-all -p watch:css start:js",
  "build": "npm-run-all build:css build:js",
  "test": "react-scripts test --env=jsdom",
  "eject": "react-scripts eject",
  "build:css": "node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/",
  "watch:css": "npm run build:css && node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --watch --recursive"
}
```

### Include Bootstrap CSS

We installed the `bootstrap` package as a dependency for our application since we will be needing some default styling. To include Bootstrap in the application, edit the `src/index.js` file and add the following line before every other `import` statement.

```js
import "bootstrap/dist/css/bootstrap.min.css";
```

### Start the Application

Start the application by running the following command with `yarn`:

```sh
yarn start
```

The application is now started and development can begin. Notice that a browser tab has been opened for you with _live reloading_ functionality to keep in sync with changes in the application as you develop.

At this point, the application view should look like the following screenshot:

![{block|border} SInitial View](https://i.imgur.com/7aJLTHt.png "Initial View")

## The `ToggleSwitch` Component

Create a new directory named `components` inside the `src` directory of your project. Next, create another new directory named `ToggleSwitch` inside the `components` directory. Next, create two new files inside `src/components/ToggleSwitch`, namely: `index.js` and `index.scss`.

Add the following content into the `src/components/ToggleSwitch/index.js` file.

```js
/* src/components/ToggleSwitch/index.js */

import PropTypes from 'prop-types';
import classnames from 'classnames';
import isString from 'lodash/isString';
import React, { Component } from 'react';
import isBoolean from 'lodash/isBoolean';
import isFunction from 'lodash/isFunction';
import './index.css';

class ToggleSwitch extends Component {}

ToggleSwitch.propTypes = {
  theme: PropTypes.string,
  enabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  onStateChanged: PropTypes.func
}

export default ToggleSwitch;
```

In this code snippet, we created the `ToggleSwitch` component and added typechecks for some of its props.

- `theme` - is a `string` indicating the style and color to be used for the toggle switch.
- `enabled` - can be either a `boolean` or a `function` that returns a `boolean`, and it determines the state of the toggle switch when it is rendered.
- `onStateChanged` - is a callback function that will be called when the state of the toggle switch changes. This is useful for triggering actions on the parent component when the switch is toggled.

### Initializing the `ToggleSwitch` State

In the following code snippet, we initialize the state of the `ToggleSwitch` component and define some component methods for getting the state of the toggle switch.

```js
/* src/components/ToggleSwitch/index.js */

class ToggleSwitch extends Component {

  state = { enabled: this.enabledFromProps() }

  isEnabled = () => this.state.enabled

  enabledFromProps() {
    let { enabled } = this.props;

    // If enabled is a function, invoke the function
    enabled = isFunction(enabled) ? enabled() : enabled;

    // Return enabled if it is a boolean, otherwise false
    return isBoolean(enabled) && enabled;
  }

}
```

Here, the `enabledFromProps()` method resolves the `enabled` prop that was passed and returns a `boolean` indicating if the switch should be enabled when it is rendered. If `enabled` prop is a `boolean`, it returns the boolean value. If it is a `function`, it first invokes the function before determining if the returned value is a boolean. Otherwise, it returns `false`.

Notice that we used the return value from `enabledFromProps()` to set the initial `enabled` state. Also, we have added the `isEnabled()` method to get the current `enabled` state.

### Toggling the `ToggleSwitch`

Let's go ahead and add the method that actually toggles the switch when it is clicked.

```js
/* src/components/ToggleSwitch/index.js */

class ToggleSwitch extends Component {

  // ...other class members here

  toggleSwitch = evt => {
    evt.persist();
    evt.preventDefault();

    const { onClick, onStateChanged } = this.props;

    this.setState({ enabled: !this.state.enabled }, () => {
      const state = this.state;

      // Augument the event object with SWITCH_STATE
      const switchEvent = Object.assign(evt, { SWITCH_STATE: state });

      // Execute the callback functions
      isFunction(onClick) && onClick(switchEvent);
      isFunction(onStateChanged) && onStateChanged(state);
    });
  }

}
```

Since this method will be triggered as a `click` event listener, we have declared it with the `evt` parameter. First, this method toggles the current `enabled` state using the logical `NOT` (`!`) operator. When the state has been updated, it triggers the callback functions passed to the `onClick` and `onStateChanged` props.

Notice that since `onClick` requires an event as its first argument, we augmented the event with an additional `SWITCH_STATE` property containing the new state object. However, the `onStateChanged` callback is called with the new state object.

### Rendering the `ToggleSwitch`

Finally, let's implement the `render()` method of the `ToggleSwitch` component.

```js
/* src/components/ToggleSwitch/index.js */

class ToggleSwitch extends Component {

  // ...other class members here

  render() {
    const { enabled } = this.state;

    // Isolate special props and store the remaining as restProps
    const { enabled: _enabled, theme, onClick, className, onStateChanged, ...restProps } = this.props;

    // Use default as a fallback theme if valid theme is not passed
    const switchTheme = (theme && isString(theme)) ? theme : 'default';

    const switchClasses = classnames(
      `switch switch--${switchTheme}`,
      className
    )

    const togglerClasses = classnames(
      'switch-toggle',
      `switch-toggle--${enabled ? 'on' : 'off'}`
    )

    return (
      <div className={switchClasses} onClick={this.toggleSwitch} {...restProps}>
        <div className={togglerClasses}></div>
      </div>
    )
  }

}
```

A lot is going on in this `render()` method - so let's try to break it down.

1. First, the `enabled` state is destructured from the component state.
2. Next, we destructure the component props and extract the `restProps` that will be passed down to the switch. This enables us to intercept and isolate the special props of the component.
3. Next, we use **classnames** to construct the classes for the switch and the inner toggler, based on the `theme` and the `enabled` state of the component.
4. Finally, we render the DOM elements with the appropriate props and classes. Notice that we passed in `this.toggleSwitch` as the `click` event listener on the switch.

## Styling the `ToggleSwitch`

Now that we have the `ToggleSwitch` component and its required functionality, we will go ahead and write the styles for the toggle switch.

Add the following code snippet to the `src/components/ToggleSwitch/index.scss` file you created earlier:

```scss
/* src/components/ToggleSwitch/index.scss */

// DEFAULT COLOR VARIABLES

$ball-color: #ffffff;
$active-color: #62c28e;
$inactive-color: #cccccc;

// DEFAULT SIZING VARIABLES

$switch-size: 32px;
$ball-spacing: 2px;
$stretch-factor: 1.625;

// DEFAULT CLASS VARIABLE

$switch-class: 'switch-toggle';


/* SWITCH MIXIN */

@mixin switch($size: $switch-size, $spacing: $ball-spacing, $stretch: $stretch-factor, $color: $active-color, $class: $switch-class) {}
```

Here, we defined some default variables and created a `switch` mixin. In the next section, we will we will implement the mixin, but first, let's examine the parameters of the `switch` mixin:

- **`$size`** - The height of the switch element. It must have a length unit. It defaults to `32px`.
- `$spacing` - The space between the circular ball and the switch container. It must have a length unit. It defaults to `2px`.
- `$stretch` - A factor used to determine the extent to which the width of the switch element should be stretched. It must be a unitless number. It defaults to `1.625`.
- `$color` - The color of the switch when in active state. This must be a valid color value. Note that the circular ball is always white irrespective of this color.
- `$class` - The base class for identifying the switch. This is used to dynamically create the state classes of the switch. It defaults to `'switch-toggle'`. Hence, the default state classes are `.switch-toggle--on` and `.switch-toggle--off`.

### Implementing the Switch Mixin

Here is the implementation of the `switch` mixin:

```scss
/* src/components/ToggleSwitch/index.scss */

@mixin switch($size: $switch-size, $spacing: $ball-spacing, $stretch: $stretch-factor, $color: $active-color, $class: $switch-class) {

  // SELECTOR VARIABLES

  $self: '.' + $class;
  $on: #{$self}--on;
  $off: #{$self}--off;

  // SWITCH VARIABLES

  $active-color: $color;
  $switch-size: $size;
  $ball-spacing: $spacing;
  $stretch-factor: $stretch;
  $ball-size: $switch-size - ($ball-spacing * 2);
  $ball-slide-size: ($switch-size * ($stretch-factor - 1) + $ball-spacing);

  // SWITCH STYLES

  height: $switch-size;
  width: $switch-size * $stretch-factor;
  cursor: pointer !important;
  user-select: none !important;
  position: relative !important;
  display: inline-block;

  &#{$on},
  &#{$off} {

    &::before,
    &::after {
      content: '';
      left: 0;
      position: absolute !important;
    }

    &::before {
      height: inherit;
      width: inherit;
      border-radius: $switch-size / 2;
      will-change: background;
      transition: background .4s .3s ease-out;
    }

    &::after {
      top: $ball-spacing;
      height: $ball-size;
      width: $ball-size;
      border-radius: $ball-size / 2;
      background: $ball-color !important;
      will-change: transform;
      transition: transform .4s ease-out;
    }

  }

  &#{$on} {
    &::before {
      background: $active-color !important;
    }
    &::after {
      transform: translateX($ball-slide-size);
    }
  }

  &#{$off} {
    &::before {
      background: $inactive-color !important;
    }
    &::after {
      transform: translateX($ball-spacing);
    }
  }

}
```

In this mixin, we start by setting some variables based on the parameters passed to the mixin. Then we go ahead, creating the styles. Notice that we are using the `::after` and `::before` pseudo-elements to dynamically create the components of the switch. `::before` creates the switch container while `::after` creates the circular ball.

Also notice how we constructed the state classes from the base class and assign them to variables. The `$on` variable maps to the selector for the enabled state, while the `$off` variable maps to the selector for the disabled state.

We also ensured that the base class (`.switch-toggle`) must be used together with a state class (`.switch-toggle--on` or `.switch-toggle--off`) for the styles to be available. Hence, we used the `&#{$on}` and `&#{$off}` selectors.

### Creating Themed Switches

Now that we have our `switch` mixin, we will continue to create some themed styles for the toggle switch. We will create two themes, namely: `default` and `graphite-small`.

Append the following code snippet to the `src/components/ToggleSwitch/index.scss` file.

```scss
/* src/components/ToggleSwitch/index.scss */

@function get-switch-class($selector) {

  // First parse the selector using `selector-parse`
  // Extract the first selector in the first list using `nth` twice
  // Extract the first simple selector using `simple-selectors` and `nth`
  // Extract the class name using `str-slice`

  @return str-slice(nth(simple-selectors(nth(nth(selector-parse($selector), 1), 1)), 1), 2);

}

.switch {
  $self: &;
  $toggle: #{$self}-toggle;
  $class: get-switch-class($toggle);

  // default theme
  &#{$self}--default > #{$toggle} {

    // Always pass the $class to the mixin
    @include switch($class: $class);

  }

  // graphite-small theme
  &#{$self}--graphite-small > #{$toggle} {

    // A smaller switch with a `gray` active color
    // Always pass the $class to the mixin
    @include switch($color: gray, $size: 20px, $class: $class);

  }
}
```

Here we first create a Sass function named `get-switch-class` that takes a `$selector` as parameter. It runs the `$selector` through a chain of Sass functions and tries to extract the first class name. For example, if it receives:

- `.class-1 .class-2, .class-3 .class-4`, it returns `class-1`.
- `.class-5.class-6 > .class-7.class-8`, it returns `class-5`.

Next, we define styles for the `.switch` class. We dynamically set the toggle class to `.switch-toggle` and assign it to the `$toggle` variable. Notice that we assign the class name returned from the `get-switch-class()` function call to the `$class` variable. Finally, we include the `switch` mixin with the necessary parameters to create the theme classes.

Notice that the structure of the selector for the themed switch looks like this: `&#{$self}--default > #{$toggle}` (_using the default theme as an example_). Putting everything together, this means that the elements hierarchy should look like the following in order for the styles to be applied:

```html
<!-- Use the default theme: switch--default  -->
<element class="switch switch--default">

  <!-- The switch is in enabled state: switch-toggle--on -->
  <element class="switch-toggle switch-toggle--on"></element>

</element>
```

Here is a simple demo showing what the toggle switch themes look like:

![{block|border} Switch Themes](https://i.imgur.com/k9DI3Eg.gif "Switch Themes")

## Building the Sample App

Now that we have the `ToggleSwitch` React component with the required styling, let's go ahead and start creating the sample app we saw at the beginning section.

Modify the `src/App.js` file to look like the following code snippet:

```js
/* src/App.js */

import classnames from 'classnames';
import snakeCase from 'lodash/snakeCase';
import React, { Component } from 'react';
import Switch from './components/ToggleSwitch';
import './App.css';

// List of activities that can trigger notifications
const ACTIVITIES = [
  'News Feeds', 'Likes and Comments', 'Live Stream', 'Upcoming Events',
  'Friend Requests', 'Nearby Friends', 'Birthdays', 'Account Sign-In'
];

class App extends Component {

  // Initialize app state, all activities are enabled by default
  state = { enabled: false, only: ACTIVITIES.map(snakeCase) }

  toggleNotifications = ({ enabled }) => {
    const { only } = this.state;
    this.setState({ enabled, only: enabled ? only : ACTIVITIES.map(snakeCase) });
  }

  render() {
    const { enabled } = this.state;

    const headingClasses = classnames(
      'font-weight-light h2 mb-0 pl-4',
      enabled ? 'text-dark' : 'text-secondary'
    );

    return (
      <div className="App position-absolute text-left d-flex justify-content-center align-items-start pt-5 h-100 w-100">
        <div className="d-flex flex-wrap mt-5" style={{width: 600}}>

          <div className="d-flex p-4 border rounded align-items-center w-100">
            <Switch theme="default"
              className="d-flex"
              enabled={enabled}
              onStateChanged={this.toggleNotifications}
            />

            <span className={headingClasses}>Notifications</span>
          </div>

          {/* ...Notification options here... */}

        </div>
      </div>
    );
  }

}

export default App;
```

Here we initialize the `ACTIVITIES` constant with an array of activities that can trigger notifications. Next, we initialized the app state with two properties:

- `enabled` - a `boolean` that indicates whether notifications are enabled.
- `only` - an `array` that contains all the activities that are enabled to trigger notifications.

Notice that we used the `snakeCase` utility from Lodash to convert the activities to snakecase before updating the state. Hence, `'News Feeds'` becomes `'news_feeds'`.

Next, we defined the `toggleNotifications()` method that updates the app state based on the state it receives from the notification switch. This is used as the callback function passed to the `onStateChanged` prop of the toggle switch. Notice that when the app is enabled, all activities will be enabled by default, since the `only` state property is populated with all the activities.

Finally, we rendered the DOM elements for the app and left a slot for the notification options which will be added soon. At this point, the app should look like the following screenshot:

![{block|border} Initial App View](https://i.imgur.com/FbHIyQr.gif "Initial App View")

Next go ahead and look for the line that has this comment:

```js
{/* ...Notification options here... */}
```

and replace it with the following content in order to render the notification options:

```js
{ enabled && (

  <div className="w-100 mt-5">
    <div className="container-fluid px-0">

      <div className="pt-5">
        <div className="d-flex justify-content-between align-items-center">
          <span className="d-block font-weight-bold text-secondary small">Email Address</span>
          <span className="text-secondary small mb-1 d-block">
            <small>Provide a valid email address with which to receive notifications.</small>
          </span>
        </div>

        <div className="mt-2">
          <input type="text" placeholder="mail@domain.com" className="form-control" style={{ fontSize: 14 }} />
        </div>
      </div>

      <div className="pt-5 mt-4">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
          <span className="d-block font-weight-bold text-secondary small">Filter Notifications</span>
          <span className="text-secondary small mb-1 d-block">
            <small>Select the account activities for which to receive notifications.</small>
          </span>
        </div>

        <div className="mt-5">
          <div className="row flex-column align-content-start" style={{ maxHeight: 180 }}>
            { this.renderNotifiableActivities() }
          </div>
        </div>
      </div>

    </div>
  </div>

) }
```

Notice here that we made a call to `this.renderNotifiableActivities()` to render the activities. Let's go ahead and implement this method and the other remaining methods.

Add the following methods to the `App` component.

```js
/* src/App.js */

class App extends Component {

  toggleActivityEnabled = activity => ({ enabled }) => {
    let { only } = this.state;

    if (enabled && !only.includes(activity)) {
      only.push(activity);
      return this.setState({ only });
    }

    if (!enabled && only.includes(activity)) {
      only = only.filter(item => item !== activity);
      return this.setState({ only });
    }
  }

  renderNotifiableActivities() {
    const { only } = this.state;

    return ACTIVITIES.map((activity, index) => {
      const key = snakeCase(activity);
      const enabled = only.includes(key);

      const activityClasses = classnames(
        'small mb-0 pl-3',
        enabled ? 'text-dark' : 'text-secondary'
      );

      return (
        <div key={index} className="col-5 d-flex mb-3">
          <Switch theme="graphite-small"
            className="d-flex"
            enabled={enabled}
            onStateChanged={ this.toggleActivityEnabled(key) }
          />

          <span className={activityClasses}>{ activity }</span>
        </div>
      );
    })
  }

}
```

Here, we have implemented the `renderNotifiableActivities` method. We iterate through all the activities using `ACTIVITIES.map()` and render each with a toggle switch for it. Notice that the toggle switch uses the `graphite-small` theme. We also detect the `enabled` state of each activity by checking whether it already exists in the `only` state variable.

Finally, we defined the `toggleActivityEnabled` method which was used to provide the callback function for the `onStateChanged` prop of each activity's toggle switch. We defined it as a higher-order function so that we can pass the activity as argument and return the callback function. It checks if an activity is already enabled and updates the state accordingly.

Now the app should look like the following screenshot:

![{block|border} Final App View](https://i.imgur.com/KYh2cgE.gif "Final App View")

If you prefer to have all the activities disabled by default instead of enabled as shown in the initial screenshot, then you could make the following changes to the `App` component:

```js
/* src/App.js */

class App extends Component {

  // Initialize app state, all activities are disabled by default
  state = { enabled: false, only: [] }

  toggleNotifications = ({ enabled }) => {
    const { only } = this.state;
    this.setState({ enabled, only: enabled ? only : [] });
  }

}
```

## Accessibility Concerns

Using toggle switches in our applications instead of traditional checkboxes can enable us create neater interfaces, especially considering the fact that it is difficult to style a traditional checkbox however we want.

However, using toggle switches instead of checkboxes has some accessibility issues, since the user-agent may not be able to interpret the component's function correctly.

A few things can be done to improve the accessibility of the toggle switch and enable user-agents to understand the role correctly. For example, you can use the following ARIA attributes:

```html
<switch-element tabindex="0" role="switch" aria-checked="true" aria-labelledby="#label-element"></switch-element>
```

You can also listen to more events on the toggle switch to create more ways the user can interact with the component.

## Conclusion

In this tutorial, we have been able to create a custom toggle switch for our React applications with proper styling that supports different themes. We have also been able to see how we can use it in our application instead of traditional checkboxes and the accessibility concerns involved.

For the complete sourcecode of this tutorial, checkout the [react-toggle-switch-demo][toggle-switch-demo] repository on Github. You can also get a [live demo of this tutorial on Code Sandbox][code-demo].


[code-demo]: https://codesandbox.io/s/7km5n36vzx
[create-react-app]: https://github.com/facebook/create-react-app
[create-react-app-sass]: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc
[nodejs]: https://nodejs.org/en/
[npm]: https://npmjs.com/
[toggle-switch-demo]: https://github.com/gladchinda/react-toggle-switch-demo
[reactjs]: https://reactjs.org/docs/
[yarn]: https://yarnpkg.com/
[yarn-install]: https://yarnpkg.com/lang/en/docs/install/
