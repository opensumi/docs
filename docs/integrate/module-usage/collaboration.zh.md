---
id: collaboration
title: 协同编辑模块
slug: collaboration
order: 8
---

## 概览

你可以使用支持热插拔的模块`@opensumi/ide-collaboration`来为你的 IDE 的**编辑器部分**实现实时多人协同编辑功能。

<video controls autoplay loop style="width:100%">
    <source src="https://gw.alipayobjects.com/os/antfincdn/BhOIHyo%26E/co-editing-example.mp4" type="video/mp4">
</video>

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

目前该模块的通信走 TCP 12345 端口，请检查并配置你的服务器的防火墙设置。

## 限制

目前协同编辑模块为**早期版本**。并且，由于当前 OpenSumi 的设计考虑的是客户端(Browser)/服务端(Node)一对一的架构，该模块仍存有诸多限制。

- 不支持 IDE 编辑器外的协同编辑功能（如终端）
- 不支持处理工作区文件的外部修改（如 `git pull`，用其他软件而非编辑器修改了文件内容）
- 不支持纯前端与 Electron 平台
- 不支持 IDE 内跨文件的修改（如使用 vscode 插件进行变量重命名重构）
