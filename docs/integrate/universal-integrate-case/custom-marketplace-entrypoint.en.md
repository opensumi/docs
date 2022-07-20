---
id: custom-marketplace-entrypoint
title: Custom Extension Marketplace
slug: custom-marketplace-entrypoint
order: 8
---

In the default extension marketplace module of OpenSumi, we are compatible with [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) launched by Eclipse, besides using the default `https://open-vsx.org`, you can also implement your own extension marketplace by studying the OpenVSX deployment documentation.

Currently we supports two mirror sites:

1. China mirror site: [https://marketplace.smartide.cn](https://marketplace.smartide.cn)
2. Official mirror site: [https://open-vsx.org](https://open-vsx.org)

## Configuration

Generally, the initial project of the framework will use the configuration of the mirror site in two places, one is the `download script` to install the default plug-in, and the other is the `extension marketplace` configuration when the framework is started.

### How to modify the download script

You just need to find files such as `scripts/download.js` and modify the site information used in it

```typescript
- const api = 'https://open-vsx.org/api/';
+ const api = 'https://marketplace.smartide.cn/api/'; // China Mirror
```

### How to modify the plugin market source

You can refer to the code here: [node/start-server.ts#L18](https://github.com/opensumi/opensumi-module-samples/blob/main/example/src/node/start-server.ts# L18).

You only need to add the following parameter information to the configuration parameters of Node process startup:

```typescript
let opts: IServerAppOpts = {
  ...
  marketplace: {
    endpoint: 'https://open-vsx.org/api', // Official Registry
    // endpoint: 'https://marketplace.smartide.cn/api', // China Mirror
  },
  ...
};
```

If you encounter the problem that the extension marketplace cannot be accessed normally, please switch the entrypoint of the extension marketplace in time to solve the problem.
