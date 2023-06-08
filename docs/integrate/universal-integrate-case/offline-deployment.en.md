---
id: offline-deployment
title: Offline Deployment
slug: offline-deployment
order: 10
---

## Overview
OpenSumi naturally supports offline deployment scenarios. You only need to replace some internal network resources such as (icon, onig-wasm) with the resource addresses of the intranet through browser-side configuration.

## Configuration items that need to be modified

See the document [How to Customize Browser Configuration](https://opensumi.com/zh/docs/integrate/universal-integrate-case/custom-config#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AB%AF%E9%85%8D%E7%BD%AE) for browser-side configuration.

Then pass the configuration parameters when new ClientAPP.

```typescript
// Import local icon resources, do not use cdn version, and set useCdnIcon to false after importing
import '@opensumi/ide-core-browser/lib/style/icon.less';

new ClientAPP({
  // other ...
  useCdnIcon: false, // see above
  onigWasmUri: '', // onig wasm file
  extensionBrowserStyleSheet: {
    componentUri: '', // Configuration plugin browser layer component style file
    iconfontUri: '' // Configuration plugin browser layer iconfont style file
  }
})
```

#### You can obtain the required resources from the following methods
- **onigWasmUri**: Download from https://g.alicdn.com/kaitian/vscode-oniguruma-wasm/1.5.1/onig.wasm
- **componentUri**: Get from `node_modules/@opensumi/ide-components/dist/index.css`
- **iconfontUri**: Get from `node_modules/@opensumi/ide-components/lib/icon/iconfont/iconfont.css`

Upload these resources to the intranet environment, and then fill in the corresponding configuration items with the intranet resource address.
