---
id: use-event
title: Event
slug: use-event
order: 2
---

In OpenSumi, you can use the `Event` mechanism to achieve cross-plugin communication, such as:

```ts
import * as sumi from 'sumi';

// emit event in plugin A
function activate() {
  sumi.event.fire('event-from-extension-a', { data: 'a' });
}

// Receive events in plugin B
function activate() {
  sumi.event.subscribe('event-from-extension-a', data => {
    console.log(data); // a
  });
}
```

Similarly, you can also use Command to implement similar logic, refer to: [VS Code API#commands](https://code.visualstudio.com/api/references/vscode-api#commands).
