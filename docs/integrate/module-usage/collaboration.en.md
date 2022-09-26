---
id: collaboration
title: Collaboration Module
slug: collaboration
order: 8
---

## Overview

You can use the hot-pluggable module `@opensumi/ide-collaboration` to implement real-time multi-person collaborative editing for the editor part of your IDE.

## Platform Support

The module currently only supports the Cloud IDE scenario of Browser + Node.

## How to use

The use of this module is very simple, just add this module to your IDE and register your user information to `CollaborationModuleContribution`.

```typescript
export interface CollaborationModuleContribution {
  info: UserInfo;
}

export interface UserInfo {
  id: string; // unique id
  nickname: string; // will be displayed on live cursor
}
```

Currently collaborative communication goes through TCP port 12345, please check and configure your server's firewall settings.

## Limitations

Currently, the collaborative editing module is an **early version**. Moreover, since the current design of OpenSumi considers the one-to-one architecture of client (Browser)/server (Node), this module still has many limitations.

- Co-editing functions outside the IDE editor (such as terminal) are not supported
- Does not support handling external modifications to workspace files (like `git pull`, where file content was modified with other software instead of an editor)
- Does not support front-end-only and Electron platform
- Does not support cross-file modification within the IDE (such as variable renaming, a kind of refactoring using the vscode plugin)
