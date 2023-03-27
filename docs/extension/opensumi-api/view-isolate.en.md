---
id: view-isolate
title: View Isolation Considerations
slug: view-isolate
order: 5
---

#### Style Failure Issues

Some common component libraries like `antd` use the `createPortal` method to insert a root node at the top of the component tree for components like `Dialog`, `Overlay`, `Popover`, etc.

When these components are used in the views registered by the plugin, due to the nature of portals, they are inserted outside of the plugin view slot (i.e., the plugin's `ShadowDOM`). Additionally, because of the isolation of the `ShadowDOM`, any custom styles for these components in the plugin will not take effect because the plugin's head styles are only inserted into the `ShadowDOM` in which it resides.

For components like Dialog and Overlay in `@ali/ide-components`, when imported into the plugin using `import * as kaitian from 'kaitian-browser`, a new `ShadowDOM` is created for the Portal component by default, and the styles are injected separately into the context of the Portal.

![ide-components](https://img.alicdn.com/imgextra/i2/O1CN01YrLPCf24SDLpkmCO6_!!6000000007389-2-tps-1342-332.png)

For `antd`, these components usually provide a getContainer prop to specify the root node they are mounted on. You can set the container to the root element of the component registered by the plugin, for example:

```jsx
// antd Modal
import Modal from 'antd/lib/modal';

const MyPanel = () => {
  const rootRef = React.createRef();
	return (<div ref={rootRef}>
    <Modal getContainer={() => rootRef.current}>{content}</Modal>
  </div>
};


// antd Popover
import Popover from 'antd/lib/popover';

const MyPanel = () => {
  const rootRef = React.createRef(null);
	return (<div ref={rootRef}>
    <Popover getPopupDomNode={() => rootRef.current}>{content}</Popover>
  </div>
};

```

The component will rendering as:

![preview](https://img.alicdn.com/imgextra/i4/O1CN01l27JZS1MAxKoIAv63_!!6000000001395-2-tps-1300-914.png)

#### Event Issue

Since React's synthetic events are based on event delegation and rely on the root node of the DOM tree, in some components (such as `antd/popover`), it may be impossible to capture events bubbled up from their child components (the exact reason is still under investigation). This can cause event handlers for child components of these components to fail. It is recommended to use [react-shadow-dom-retarget-events](https://npm.alibaba-inc.com/package/react-shadow-dom-retarget-events) to manually specify the root node delegated for events to the above-mentioned container component, for example:

```jsx
import Popover from 'antd/lib/popover';
import retargetEvents from 'react-shadow-dom-retarget-events';

const MyPanel = () => {
  const rootRef = React.createRef(null);
	return (<div ref={rootRef}>
    <Popover getPopupDomNode={() => {
    retargetEvents(rootRef.current);
		return rootRef.current;
    }}>{content}</Popover>
  </div>
};
```
