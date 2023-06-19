---
id: offline-deployment
title: 离线部署
slug: offline-deployment
order: 9
---

## 概览

OpenSumi 天然支持离线部署场景，只需要将内部的一些网络资源如（icon、onig-wasm）等通过浏览器端的配置替换成内网的资源地址即可

## 需要修改的配置项

浏览器端的配置见文档 [如何自定义浏览器端配置](https://opensumi.com/zh/docs/integrate/universal-integrate-case/custom-config#%E6%B5%8F%E8%A7%88%E5%99%A8%E7%AB%AF%E9%85%8D%E7%BD%AE)

然后在 `new ClientAPP` 时传入配置参数

```typescript
// 导入本地 icon 资源, 不使用 cdn 版本, 导入后需要设置 useCdnIcon 为 false
import '@opensumi/ide-core-browser/lib/style/icon.less';

new ClientAPP({
  // other ...
  useCdnIcon: false, // 见上
  onigWasmUri: '', // onig wasm 文件
  extensionBrowserStyleSheet: {
    componentUri: '', // 配置插件 browser 层的 component 样式文件
    iconfontUri: '' // 配置插件 browser 层的 iconfont 样式文件
  }
});
```

#### 可以从以下方式获取到所需的资源

- **onigWasmUri**: 从 https://g.alicdn.com/kaitian/vscode-oniguruma-wasm/1.5.1/onig.wasm 下载
- **componentUri**: 从 `node_modules/@opensumi/ide-components/dist/index.css` 获取
- **iconfontUri**: 从 `node_modules/@opensumi/ide-components/lib/icon/iconfont/iconfont.css` 获取

将这些资源上传到内网环境，然后将内网资源地址填写到对应配置项即可

## ide-startup-lite 插件本地化

### 插件资源

[ide-startup-lite](https://github.com/opensumi/ide-startup-lite) 内插件为 CDN 引用方式，所有插件资源 [lite-worker-extensions](https://github.com/opensumi/lite-worker-extensions) 已打包输出

### 代码修改

需同步修改 Lite 内插件引入[相关代码](https://github.com/opensumi/ide-startup-lite/blob/main/web-lite/extension/utils.ts#L56)

```diff
export async function getExtension(extensionId: string, version: string): Promise<IExtensionMetaData | undefined> {
  const [, extName] = extensionId.split('.')
-  const extPath = `gw.alipayobjects.com/os/marketplace/extension/${extensionId}-${version}/`;
+  const extPath = `${your local path}`;
  const packageJSON = await fetch(`https://${extPath}package.json`)
    .then((res) => res.json());
  packageJSON.contributes = mergeContributes(
    packageJSON.kaitianContributes,
    packageJSON.contributes,
  );

...
```
