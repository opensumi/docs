---
id: custom-marketplace-entrypoint
title: Custom Extension Marketplace
slug: custom-marketplace-entrypoint
order: 8
---

OpenSumi support both [Ant Cloud IDE marketplace](https://marketplace.opentrs.cn/square) and [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php), and can be switched between each other through configuration. At present, the default is the Ant Cloud IDE extension marketplace


## Configuration

Generally, the initial project of the framework will use the configuration of the mirror site in two places, one is the download script to install the default extensions, and the other is the extension marketplace configuration when the framework is started.


### How to modify the download script

The download script (`scripts/download.js`) uses the Ant Cloud IDE extension marketplace by default. If you need to switch, you can specify the extension marketplace type in the `download-extension` directive in the `package.json` file:

```json
{
  "scripts": {
    -"download-extension": "cross-env DEBUG=InstallExtension node scripts/download.js"
    +"download-extension": "cross-env DEBUG=InstallExtension MARKETPLACE=openvsx node scripts/download.js"
  }
}
```

### How to modify the plugin market source

You can refer to the code here: [node/start-server.ts#L18](https://github.com/opensumi/opensumi-module-samples/blob/main/example/src/node/start-server.ts# L18), add relevant parameter information in the configuration parameters of the Node process startup. The specific configuration is as follows:

#### Ant Cloud IDE marketplace

```typescript
let opts: IServerAppOpts = {
  ...
  marketplace: {
    endpoint: 'https://marketplace.opentrs.cn',
    accountId: 'clcJKq_Gea47whxAJGrgoYqf',
    masterKey: '_V_LPJ6Ar-1nrSVa05xDGBYp',
  },
  ...
};
```

#### Eclipse Open VSX

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

## Extension Synchronization Mechanism

At present, OpenSumi has a certain lag (about three months) in compatibility with the VSCode extension API. Therefore, the VSCode extension hosted in the marketplace must first scan the code before synchronizing. If you find that the extension you want is missing
, you can put forward the extension synchronization requirement in the [OpenSumi project](https://github.com/opensumi/core/issues) issues list, and the project team members will scan the extension and synchronize the available version.
