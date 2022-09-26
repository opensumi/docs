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
- Electron 客户端中的 IPC 通信消息（仅 Electron 端）

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

[core-browser](https://github.com/opensumi/core/tree/main/packages/core-browser) 模块中的 [`ClientApp`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/bootstrap/app.ts) 使得集成方能够快速启动他们的 Web IDE 产品。

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

现在我们在 [AppConfig](https://github.com/opensumi/core/blob/main/packages/core-browser/src/react-providers/config-provider.tsx) 中增加了`devtools`这个配置项。如此一来，集成方就能控制是否在 Web 客户端中开启 devtools 支持，请见[此例](https://github.com/opensumi/core/blob/main/packages/startup/entry/web/app.tsx)。

### Electron 客户端

[core-electron-main](https://github.com/opensumi/core/tree/main/packages/core-electron-main) 模块中的 [`ElectronMainApp`](https://github.com/opensumi/core/blob/main/packages/core-electron-main/src/bootstrap/app.ts) 使得集成方能够快速启动他们的 Electron IDE 产品。

```javascript
export interface ElectronAppConfig {
  ...
  /**
   * 是否开启对 OpenSumi DevTools 的支持
   * 默认值为 false
   */
  devtools?: boolean;
}
```

现在我们在 [ElectronAppConfig](https://github.com/opensumi/core/blob/main/packages/core-electron-main/src/bootstrap/types.ts) 中增加了`devtools`这个配置项。如此一来，集成方就能控制是否在 Electron 客户端中开启 devtools 支持，请见[此例](https://github.com/opensumi/core/blob/main/tools/electron/src/main/index.ts)。

请注意，集成方同时还需要在 core-browser 侧开启对 devtools 的支持（ 见[此例](https://github.com/opensumi/core/blob/main/tools/electron/src/browser/index.ts)），这是因为 Electron 客户端与 Web 客户端一样，都依赖 core-browser 模块。

也就是说，对于 Web 客户端，集成方只需将一处的`devtools`设置为`true`便能开启对 OpenSumi DevTools 的支持；而对于 Electron 客户端，集成方需要在两处将`devtools`设置为`true`才能完全开启对插件的支持。
