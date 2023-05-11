---
id: use-builtin-component
title: Components
slug: use-builtin-component
order: 10
---

## 内置组件

在 OpenSumi 的 Browser 插件中，`sumi-browser` 已导出 `@ali/ide-components` 中所有的组件，所以当我们需要使用组件，直接通过 `sumi-browser` 引用即可，示例如下：

```ts
import * as React from 'react';
import { Button, Input } from 'sumi-browser';

export class Sample extends React.Component {
  render() {
    return (
      <div>
        <Button>This is a button</Button>
        <Input />
      </div>
    );
  }
}
```

## 第三方组件

在 OpenSumi 的 `sumi-browser` 中导出的组件多为 OpenSumi 中的常用组件，可能你会需要使用更多组件，比如 `antd` 之类组件库，需要注意的是，若你的插件运行环境已开启 `ShadowDom` 模式（避免样式污染，目前是默认开启），请注意在使用全局通知类的组件如 `notification/dialog` 等需要注意 css 可能被隔离导致样式失效，请选择 `sumi-browser` 中导出的 `messsage/dialog` 组件以满足开发需求，或将组件挂载至当前组件下，详见：[视图隔离注意事项](../opensumi-api/view-isolate)。

我们也提供了针对 AntD 4 版本的主题包 [opensumi/antd-theme](https://github.com/opensumi/antd-theme)，你可以通过如下的方式使用：

```ts
import '@opensumi/antd-theme/lib/index.css';
...

return (
  <ConfigProvider prefixCls="sumi_antd">
    <App />
  </ConfigProvider>
);

```

开发同类主题文件，可参考 [opensumi/antd-theme](https://github.com/opensumi/antd-theme#developement) 仓库。
