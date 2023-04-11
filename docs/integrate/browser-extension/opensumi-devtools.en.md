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
- IPC messages([partial](https://github.com/opensumi/core/issues/2359#issuecomment-1495977098)) between Electron processes (Electron client only)

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

The [`ClientApp`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/bootstrap/app.ts) of the [core-browser](https://github.com/opensumi/core/tree/main/packages/core-browser) package is provided for integrators to bootstrap their Web IDEs. Now we have added a `devtools` option to [AppConfig](https://github.com/opensumi/core/blob/main/packages/core-browser/src/react-providers/config-provider.tsx). So integrators are allowed to toggle the devtools support for Web clients like [this
example](https://github.com/opensumi/core/blob/main/packages/startup/entry/web/app.tsx).

```javascript
export interface AppConfig {
  ...
  /**
   * If enable the support for OpenSumi DevTools
   * The default is false
   */
  devtools?: boolean;
}
```

### Electron client

At the moment, OpenSumi DevTools captures IPC messages in Renderer processes side only. Since Renderer processes also depend on the core-browser package to initialize apps, integrators just need to enable devtools support in core-browser side (see [this](https://github.com/opensumi/core/blob/main/tools/electron/src/browser/index.ts)) like they do for Web clients.
