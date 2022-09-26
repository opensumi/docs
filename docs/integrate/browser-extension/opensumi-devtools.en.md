---
id: opensumi-devtools
title: OpenSumi DevTools
slug: opensumi-devtools
order: 2
---

A Chrome DevTools Extension for any OpenSumi based IDE, with support for both Web clients and Electron clients.

![OpenSumi DevTools Gif](https://img.alicdn.com/imgextra/i2/O1CN01kCf4wE254ga71iSmB_!!6000000007473-1-tps-1164-879.gif)

GitHub：https://github.com/opensumi/devtools

## Features

Currently OpenSumi DevTools focuses on inner messages capturing and presenting:

- RPC messages between frontend and backend
- IPC messages between Electron processes (Electron client only)

Users are allowed to:

- Toggle capturing
- Filter messages
- View parsed messages
- Check communication traffic
- Check network latency

## Install

See the [Install](https://github.com/opensumi/devtools#install) section of README.

## Integrate

The installed extension works only when the devtools supports are enabled first. Several options have been provided to allow integrators to decide if the devtools supports are enabled in OpenSumi.

### Web client

The [`ClientApp`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/bootstrap/app.ts) of the [core-browser](https://github.com/opensumi/core/tree/main/packages/core-browser) package is provided for integrators to bootstrap their Web IDEs.

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

Now we have added a `devtools` option to [AppConfig](https://github.com/opensumi/core/blob/main/packages/core-browser/src/react-providers/config-provider.tsx). So integrators are allowed to toggle the devtools support for Web clients like [this
example](https://github.com/opensumi/core/blob/main/packages/startup/entry/web/app.tsx).

### Electron client

The [`ElectronMainApp`](https://github.com/opensumi/core/blob/main/packages/core-electron-main/src/bootstrap/app.ts) of the [core-electron-main](https://github.com/opensumi/core/tree/main/packages/core-electron-main) package is provided for integrators to bootstrap their Electron IDEs.

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

Now we have added a `devtools` option to [ElectronAppConfig](https://github.com/opensumi/core/blob/main/packages/core-electron-main/src/bootstrap/types.ts). So integrators are allowed to toggle the devtools support for Electron clients like [this
example](https://github.com/opensumi/core/blob/main/tools/electron/src/main/index.ts).

Wait, there is more. Integrators also need to enable devtools support in core-browser side (see [this](https://github.com/opensumi/core/blob/main/tools/electron/src/browser/index.ts)) like they do for Web clients, since Electron clients also depend on the core-browser package.

So, integrators should enable `devtools` in one place for Web clients but two places for Electron clients.
