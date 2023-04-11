---
id: opensumi-devtools
title: OpenSumi DevTools
slug: opensumi-devtools
order: 2
---

一款任何基于 OpenSumi 开发的 IDE 产品都能使用的 Chrome DevTools 插件，同时支持 Web 客户端和 Electron 客户端。

![OpenSumi DevTools Gif](https://img.alicdn.com/imgextra/i2/O1CN01kCf4wE254ga71iSmB_!!6000000007473-1-tps-1164-879.gif)

GitHub：https://github.com/opensumi/devtools

## 功能

目前该插件主要聚焦于 OpenSumi 内部通信消息的捕获与呈现：

- OpenSumi 前后端的 RPC 通信消息
- Electron 客户端中的[部分](https://github.com/opensumi/core/issues/2359#issuecomment-1495977098) IPC 通信消息（仅 Electron 端）

用户可以：

- 开始/停止捕获消息
- 组合过滤消息
- 以 JSON 视图查看消息内容
- 查看 RPC 通信流量
- 查看前后端之间的网络延迟

## 安装

请见 README 中的 [Install](https://github.com/opensumi/devtools#install) 部分。

## 集成

只有将 OpenSumi 中与 devtools 相关的配置项打开后，安装的插件才会生效。集成方可以通过这些配置项来决定是否开启对 OpenSumi DevTools 的支持。

### Web 客户端

[core-browser](https://github.com/opensumi/core/tree/main/packages/core-browser) 模块中的 [`ClientApp`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/bootstrap/app.ts) 使得集成方能够快速启动他们的 Web IDE 产品。现在我们在 [AppConfig](https://github.com/opensumi/core/blob/main/packages/core-browser/src/react-providers/config-provider.tsx) 中增加了`devtools`这个配置项。如此一来，集成方就能控制是否在 Web 客户端中开启 devtools 支持，请见[此例](https://github.com/opensumi/core/blob/main/packages/startup/entry/web/app.tsx)。

```javascript
export interface AppConfig {
  ...
  /**
   * 是否开启对 OpenSumi DevTools 的支持
   * 默认值为 false
   */
  devtools?: boolean;
}
```

### Electron 客户端

目前，OpenSumi DevTools 只捕获并展示 Electron Renderer 进程一侧的通信消息。由于 Renderer 进程也会利用 core-browser 模块进行初始化，所以和 Web 客户端类似，集成方只需要在 core-browser 侧开启对 devtools 的支持即可，请见[此例](https://github.com/opensumi/core/blob/main/tools/electron/src/browser/index.ts)。
