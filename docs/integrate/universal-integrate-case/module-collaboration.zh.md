---
id: module-collaboration
title: 使用协同编辑模块
slug: module-collaboration
order: 8
---

## 概览

你可以使用支持支持热插拔的协同编辑模块`@opensumi/ide-collaboration`来为你的 IDE 的**编辑器部分**实现实时多人协同编辑功能。

## 平台支持

模块目前只支持 Browser + Node 的 Cloud IDE 场景。

## 使用

该模块的使用很简单，只需要在你的 IDE 中添加上该模块，并将用户信息给注册到`CollaborationModuleContribution`即可。

```typescript
export interface CollaborationModuleContribution {
  info: UserInfo;
}

export interface UserInfo {
  id: string; // unique id
  nickname: string; // will be displayed on live cursor
}
```

目前通信走 12345 端口(TCP)，请检查并配置你的服务器的防火墙设置。

## 限制

目前协同编辑模块为非常早期的版本。并且，由于当前 OpenSumi 的设计考虑的是服务端(Node)/客户端(Browser)一对一的架构，该模块仍存有诸多限制。

- 仅支持了 IDE 编辑器部分的协同编辑功能
- 暂时仅支持在编辑器编辑文件，未处理外部对 IDE 工作区文件的修改（如 `git pull`，用其他软件修改了文件内容）
- 暂时未支持纯前端与 electron 平台
- 暂时未支持 IDE 内跨文件的修改（如使用 vscode 插件进行变量重命名重构）
