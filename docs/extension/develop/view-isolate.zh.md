---
id: view-isolate
title: 视图隔离注意事项
slug: view-isolate
order: 5
---

#### 样式失效问题

对于一些常见的组件库（如 antd），当使用 `Dialog`、`Overlay`、`Popover` 等组件时，它们会在组件树的顶层通过 `createPortal` 的方式插入一个根节点。由于 portal 的特性，这些组件会被插入到插件视图槽（即插件 `ShadowDOM`）之外。

同时，由于 `ShadowDOM` 的隔离性，插件中对这些组件的自定义样式会无效。这是因为插件的 head 样式只会被插入到它自身所在的 `ShadowDOM` 内。

对于 `@ali/ide-components` 中的 `Dialog`、`Overlay` 等组件，当插件中使用 `import * as kaitian from 'kaitian-browser'` 导入时，会为 Portal 类的组件创建一个新的 `ShadowDOM`，并将样式单独注入到 Portal 的上下文中。

![ide-components](https://img.alicdn.com/imgextra/i2/O1CN01YrLPCf24SDLpkmCO6_!!6000000007389-2-tps-1342-332.png)

而对于 antd，这类组件一般会提供一个 `getContainer` 的属性，用于指定它们所挂载的 DOM 根节点，可以将 Container 设置为插件所注册组件的根元素。例如：

```jsx
// antd Modal
import Modal from 'antd/lib/modal';

const MyPanel = () => {
  const rootRef = React.createRef();
  return (
    <div ref={rootRef}>
      <Modal getContainer={() => rootRef.current}>{content}</Modal>
    </div>
  );
};

// antd Popover
import Popover from 'antd/lib/popover';

const MyPanel = () => {
  const rootRef = React.createRef(null);
  return (
    <div ref={rootRef}>
      <Popover getPopupDomNode={() => rootRef.current}>{content}</Popover>
    </div>
  );
};
```

最终的渲染效果如下图所示：

![preview](https://img.alicdn.com/imgextra/i4/O1CN01l27JZS1MAxKoIAv63_!!6000000001395-2-tps-1300-914.png)

#### 事件问题

由于 React 基于事件委托实现的合成事件依赖 DOM 树根节点，在某些组件中（如 antd/popover）可能无法捕获到其子组件冒泡上来的事件（具体原因还在排查中）。这会导致这类组件的子组件的事件处理程序失效。建议使用 [react-shadow-dom-retarget-events](https://npm.alibaba-inc.com/package/react-shadow-dom-retarget-events) 手动将事件委托的根节点指定为上述的 container 组件。例如

```jsx
import Popover from 'antd/lib/popover';
import retargetEvents from 'react-shadow-dom-retarget-events';

const MyPanel = () => {
  const rootRef = React.createRef(null);
  return (
    <div ref={rootRef}>
      <Popover
        getPopupDomNode={() => {
          retargetEvents(rootRef.current);
          return rootRef.current;
        }}
      >
        {content}
      </Popover>
    </div>
  );
};
```
