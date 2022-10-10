---
id: collaboration
title: Collaboration Module
slug: collaboration
order: 1
---

## Overview

You can use the hot-pluggable module `@opensumi/ide-collaboration` to implement real-time multi-person collaborative editing for the editor part of your IDE.

<video controls autoplay loop style="width:100%">
    <source src="https://gw.alipayobjects.com/os/antfincdn/BhOIHyo%26E/co-editing-example.mp4" type="video/mp4">
</video>

## Platform Support

The module currently only supports the Cloud IDE scenario of Browser + Node.

## How to use

The use of this module is very simple, just add this module to browser side and node side of your IDE.

```typescript
// on browser side
renderApp({
  modules: [...CommonBrowserModules, CollaborationModule],
  wsPath: 'your-ws-path-here',

// on node side
startServer({
  modules: [...CommonNodeModules, CollaborationModule],
```

And then register your user information to `CollaborationModuleContribution`.

```typescript
export interface CollaborationModuleContribution {
  info: UserInfo;
}

export interface UserInfo {
  id: string; // unique id
  nickname: string; // will be displayed on live cursor
}
```

Here is a simple contribution to this module.

```typescript
import {
  CollaborationModuleContribution,
  UserInfo
} from '@opensumi/ide-collaboration';
import { Domain } from '@opensumi/ide-core-common';

@Domain(CollaborationModuleContribution)
export class SampleContribution implements CollaborationModuleContribution {
  info: UserInfo = {
    id: 'your id',
    nickname: 'your name'
  };
}
```

Currently collaborative communication goes through TCP port 12345. URL(except port) of the collaborative communication is the same as your IDE server's [wsPath](https://github.com/opensumi/core/blob/5511c0c2f625f814100271c405f96861cde8643b/packages/core-browser/src/react-providers/config-provider.tsx#L81) defined in `AppConfig`. Please check and configure your server's firewall settings.

## Limitations

Currently, the collaborative editing module is an **early version**. Moreover, since the current design of OpenSumi considers the one-to-one architecture of client (Browser)/server (Node), this module still has many limitations.

- Co-editing functions outside the IDE editor (such as terminal) are not supported
- Does not support handling external modifications to workspace files (like `git pull`, where file content was modified with other software instead of an editor)
- Does not support front-end-only and Electron platform
- Does not support cross-file modification within the IDE (such as variable renaming, a kind of refactoring using the vscode plugin)
