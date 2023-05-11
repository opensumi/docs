---
id: toolbar
title: Toolbar
slug: toolbar
order: 1
---

The Toolbar is located on the right side of the top menu bar of the IDE by default. According to the configuration of different integrators, it can also be displayed as a separate column, similar to the Alipay applet developer tools. As shown below:

![sample1](https://img.alicdn.com/imgextra/i2/O1CN01vZ7d8C1cyS0IU2qtR_!!6000000003669-2-tps-1685-86.png)
![sample2](https://img.alicdn.com/imgextra/i4/O1CN01qSsHwA21oFZktRttG_!!6000000007031-2-tps-1651-87.png)
![sample3](https://img.alicdn.com/imgextra/i2/O1CN01cNra151YvvM7eJw2A_!!6000000003122-2-tps-1529-46.png)

Include toolbar-related APIs in `sumi.toolbar` namespace, which can be combined with [Toolbar contribution point](../contributes/toolbar) for finer-grained control over the toolbar.

Toolbar contains three methods for obtaining or registering a Toolbar Action, such as:

```ts
/**
 * Register a Toolbar Action of select type
 * @param contribution IToolbarSelectContribution
 * Return a handle for operating and responding to the corresponding select control on the toolbar
 */
export function registerToolbarAction<T>(
  contribution: IToolbarSelectContribution<T>
): Promise<IToolbarSelectActionHandle<T>>;
/**
 * Register a Toolbar action of button type
 * @param contribution IToolbarButtonContribution
 * Return a handle for operating and responding to the corresponding button control on the toolbar
 */
export function registerToolbarAction(
  contribution: IToolbarButtonContribution
): Promise<IToolbarButtonActionHandle>;

/**
 * Get a handle of Toolbar action, which is used to operate and respond to the button on the toolbar
 * @param id
 */
export function getToolbarActionButtonHandle(
  id: string
): Promise<IToolbarButtonActionHandle>;

/**
 * Get a handle of Toolbar action, which is used to operate and respond to the select on the toolbar
 * @param id
 */
export function getToolbarActionSelectHandle<T = any>(
  id: string
): Promise<IToolbarSelectActionHandle<T>>;
```

## registerToolbarAction

Use `registerToolbarAction` to dynamically register Toolbar elements. Unlike registration through Toolbar contribution points, the Toolbar Action of contribution points will be displayed regardless of whether the plug-in is activated, but through the API, it will only be registered and displayed on the toolbar after the plug-in is activated. .

The parameters are basically the same as the Toolbar contribution point, and the content declared by the contribution point can basically be called directly as a parameter.

```ts
sumi.toolbar.registerToolbarAction({
  type: 'button',
  title: 'Run',
  iconPath: './icons/gua.svg',
  id: 'common-start',
  // Use mask to render svg, the foreground color is --activityBar-inactiveForeground
  iconMaskMode: true,
  // Define several states of the button
  states: {
    // Set the title foreground color to red by default
    default: {
      titleForeground: '#FF004F'
    },
    // gray in clicked state
    clicked: {
      titleForeground: '#CCC'
    }
  }
});

sumi.toolbar.registerToolbarAction({
  type: 'select', // Register a toolbar action of select type
  title: "What to give for Children's Day?",
  description: "What to give for Children's Day?",
  // bind do-select command
  command: 'do-select',
  id: 'common-select',
  iconMaskMode: false,
  // select dropdown value list
  options: [
    {
      iconPath: '/icons/gift.svg',
      label: 'gift',
      value: 'gift'
    },
    {
      iconPath: '/icons/book.svg',
      label: 'Five-year college entrance examination',
      value: 'book'
    }
  ],
  states: {
    // default state
    default: {
      labelForegroundColor: '#FF004F'
    },
    clicked: {
      labelForegroundColor: '#CCC'
    }
  }
});
```

## getToolbarActionButtonHandle/getToolbarActionSelectHandle

For usage, refer to the case in the [Toolbar Contribution Point](../contributes/toolbar) document.

## Example repository

[OpenSumi Extension Sample - Toolbar](https://github.com/opensumi/opensumi-extension-samples/tree/main/toolbar-sample)
