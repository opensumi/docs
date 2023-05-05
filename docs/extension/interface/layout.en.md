---
id: layout
title: Layout
slug: layout
order: 4
---

The OpenSumi extension API contains a namespace called `layout`. In addition to the intuitive `toggleBottomPanel`, `toggleLeftPanel`, `toggleRightPanel` and other methods, you can use `getTabbarHandler` to pass in the ID of a specific Tabbar panel to obtain a handler object. Use For finer control Tabbar.

This ID refers to the ID of the registered view on the UI side of the extension. Generally, we can simply find this information through the Dom structure, such as:

![Debug Console](https://img.alicdn.com/imgextra/i3/O1CN01dMQBzL1I16MUIkxwe_!!6000000000832-2-tps-1566-772.png)

![Explorer](https://img.alicdn.com/imgextra/i4/O1CN01ousv8M26hRlrYpMxj_!!6000000007693-2-tps-1510-1202.png)

## Instructions

```ts
import * as sumi from 'sumi';

const tabbar = sumi.layout.getTabbarHandler(`explorer`);
tabbar.setSize(500); // Set the panel size
tabbar.activate(); //Expand the panel
tabbar.deactivate(); // collapse the panel
tabbar.setVisible(); // set to hidden state
tabbar.onActivate(); // event when the panel expands
tabbar.onInActivate(); // event when the panel is closed
tabbar.setIcon(); // Set the icon on the corresponding Tab
tabbar.setTitle(); // Set the text on the corresponding Tab
tabbar.setBadge('12'); // Set the Tab's badge
```

For views registered by other extensions, you can get its instance through the `getExtensionTabbarHandler` method, and you need to pass in the ID of the corresponding extension when using it, such as:

```ts
const tabbar = sumi.layout.getExtensionTabbarHandler('viewId', 'extensionId');
```

If you have any questions, feel fress to ask on our Issues ~
