---
id: use-builtin-component
title: Use Components
slug: use-builtin-component
order: 10
---

## Built-in components

In OpenSumi's Browser extension, `sumi-browser` has exported all the components in `@ali/ide-components`, so when we need to use components, we can directly reference them through `sumi-browser`, the example is as follows:

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

## Third-party components

Most of the components exported in OpenSumi's `sumi-browser` are commonly used components in OpenSumi, and you may need to use more components, such as `antd` and other component libraries. It should be noted that if your extension operating environment has Enable the `ShadowDom` mode (to avoid style pollution, it is currently enabled by default), please note that when using global notification components such as `notification/dialog`, you need to pay attention to the fact that css may be isolated and cause the style to fail, please select `sumi-browser` Export the `messsage/dialog` component to meet the development needs, or mount the component under the current component, see: [view isolation considerations](../opensumi-api/view-isolate) for details.

We also provide a theme package [opensumi/antd-theme](https://github.com/opensumi/antd-theme) for AntD 4 version, you can use it as follows:

```ts
import '@opensumi/antd-theme/lib/index.css';
...

return (
  <ConfigProvider prefixCls="sumi_antd">
    <App />
  </ConfigProvider>
);

```

To develop similar theme files, please refer to [opensumi/antd-theme](https://github.com/opensumi/antd-theme#developement) repository.
