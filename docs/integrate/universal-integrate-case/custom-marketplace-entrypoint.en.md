---
id: custom-marketplace-entrypoint
title: Custom Extension Marketplace
slug: custom-marketplace-entrypoint
order: 8
---

OpenSumi support both [Ant CloudIDE Marketplace](https://marketplace.opentrs.cn/square) and [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php), and can be switched between each other through configuration. At present, the default is the Ant CloudIDE extension marketplace


## Configuration

Generally, the initial project of the framework will use the configuration of the mirror site in two places, one is the download script to install the default extensions, and the other is the extension marketplace configuration when the framework is started.


### How to modify the download script

The download script (`scripts/download.js`) uses the Ant CloudIDE extension marketplace by default. If you need to switch, you can specify the extension marketplace type in the `download-extension` directive in the `package.json` file:

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

#### Ant CloudIDE Marketplace

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
The accountId and masterKey used in the above configuration are the public secret key provided by the Ant CloudIDE Marketplace. This secret key can access all public extensions in the marketplace by default. If you need to customize the secret key, you can refer to the client management section in the [Ant CloudIDE Marketplace documentation](https://www.opentrs.cn/cloudide/documents/documentDetail?productStr=cloudide-20221026&nameSpace=trms2d/xyyfdt&slug=ooxr2vxp32r9hv4q). Through the custom secret key, users can access their private extensions hosted in the marketplace.


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

At present, OpenSumi has a certain lag (about three months) in compatibility with the VSCode extension API. Therefore, the VSCode extension hosted in the marketplace must first scan the code before synchronizing. If you find that the extension you want is missing, you can put forward the extension synchronization requirement in the [OpenSumi Issues](https://github.com/opensumi/core/issues) issues list, and the project team members will scan the extension and synchronize the available version.
