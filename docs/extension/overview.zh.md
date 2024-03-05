---
id: overview
title: 如何开发插件
slug: overview
order: 0
---

在 OpenSumi 中，我们提供了一个强大的插件生态系统，在兼容 [VS Code 插件 API](https://code.visualstudio.com/api) 的同时，我们也有着自己的 OpenSumi API 用于进一步拓展 IDE 界面及能力。

插件能力实现结构图如下：

![Extension Features](https://img.alicdn.com/imgextra/i2/O1CN01xpzgfe24PvNA26s4q_!!6000000007384-2-tps-1371-940.png)

## 开发 VS Code 插件

在插件开发中，你可以遵循 VS Code 的开发模式，在 VS Code 内完成你的插件开发后，将实现的插件产物引入到基于 OpenSumi 搭建的 IDE 中使用，详细可参考 VS Code 插件文档 [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview)。

下面是一些常用的示例及文档：

- [eclipse-theia/vscode-builtin-extensions](https://github.com/eclipse-theia/vscode-builtin-extensions) —— 基于 VS Code 版本打包其内置插件的工程项目
- [microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) —— VS Code 官方的插件 API 示例仓库
- [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview) —— VS Code 插件开发向导文档
- [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension) —— 快速开始插件开发
- [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions) —— 在 OpenSumi 中也支持了这类插件，在纯前端环境有着十分重要的作用

## 开发 OpenSumi 插件

OpenSumi 中存在着一部分仅能运行在基于 OpenSumi 开发的 IDE 之中，提供的能力包括但不限于：

- 通过 React 技术栈进行视图的拓展定制
- Toolbar 定制
- Electron Webview 管理
- 布局能力
- 全视图的自定义渲染

一个完整的 OpenSumi 插件目录结构如下：

```bash
.
├── .gitignore          # git 忽略目录
├── README.md           # 插件说明
├── src
    ├── extend
        ├── browser     # 插件 Browser 端入口， 提供 UI 定制能力
        ├── node        # 插件 Node 端入口，提供本地环境运行能力
        ├── worker      # 插件 Worker 端入口，提供 WebWorker 环境运行能力
│   └── extension.ts    # 插件源码 (VS Code 插件入口)
├── package.json        # Extension manifest
├── tsconfig.json
```

### 目录说明

`src/extensions.ts` 为 VS Code 插件入口，关于 VS Code 插件开发请参阅 [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview)。

`src/extend` 目录下为 OpenSumi 自有插件体系，包含 `Browser/Node/Worker` 端入口。

### 入口说明

> VS Code 插件在 OpenSumi 运行时会保持与 VS Code 特定版本一致的行为，例如当前 `2.23.0` 版本兼容 VS Code 的插件 API 版本为 `1.68.0`。

Browser 端支持通过 `React` 组件的方式在界面暴露的插槽中定制 UI ，如果你的插件需要在界面注册 UI 组件，可以将其编写在 Browser 端。

Node 端支持纯 Node 环境运行时，在 Node 端插件拥有与 VS Code 插件一致的 API，同时还可以调用 OpenSumi 自有的插件 API，如果你的插件需要调用原生 Node.js 的 API 或运行一些本地任务，可以将其编写在 Node 端。

Worker 端拥有 WebWorker 环境运行时，如果你的插件包含一些计算量较大的任务，同时不需要本地能力，可以将其编写在 Worker 端。

**不论是 VS Code 插件还是 `Browser/Node/Worker` 三端都是可选的，也就是说如果你只需要原生 VS Code 插件能力，则可以忽略 extend 目录。同样如果你只需要 OpenSumi 插件三端之一的能力，也可以忽略其他，仅需要修改少量的配置。**

## 开始开发

参考 [快速开始](./quick-start) 文档，使用 OpenSumi CLI 快速在本地搭建插件开发环境。

## 插件示例

除了上面提到的 [VS Code Extension Samples](https://github.com/microsoft/vscode-extension-samples)，OpenSumi 也有自己的插件示例仓库 [OpenSumi Extension Samples](https://github.com/opensumi/opensumi-extension-samples)，包含了一些常见的插件示例代码。

- Toolbar Sample
- i18n Sample
- Gulp compile Sample
- Gulp
- Custom webpack compile Sample
- Configuration Sample
- Upload OSS Sample
- Plain Webview Sample
- Git Operation Sample
- Command Sample

## 插件市场

当前 OpenSumi 支持两种插件市场，如下面所示：

![Extension Marketplace](https://img.alicdn.com/imgextra/i2/O1CN01Kq3jZf25zTjbBJWzR_!!6000000007597-2-tps-1906-732.png)

- [AlipayCloud](https://ide.cloud.alipay.com/marketplace/square) —— 蚂蚁集团开放的支付宝小程序云插件市场
- [OpenVSX](https://open-vsx.org/) —— Eclipse 基金会开放的公共插件市场服务（源码开源）

可以根据使用场景自由进行源的切换，见文档 [自定义插件市场源](../integrate/universal-integrate-case/custom-marketplace-entrypoint)。
