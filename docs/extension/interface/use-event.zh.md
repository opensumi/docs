---
id: use-event
title: 事件使用
slug: use-event
order: 2
---

在 OpenSumi 中，你可以通过 `Event` 机制来实现跨插件的通信，如：

```ts
import * as sumi from 'sumi';

// 插件 A 中发出事件
function activate() {
  sumi.event.fire('event-from-extension-a', { data: 'a' });
}

// 插件 B 中接收事件
function activate() {
  sumi.event.subscribe('event-from-extension-a', data => {
    console.log(data); // a
  });
}
```

同样的，你也可以通过 Command（命令） 的方式来实现类似逻辑，参考：[VS Code API#commands](https://code.visualstudio.com/api/references/vscode-api#commands)。
