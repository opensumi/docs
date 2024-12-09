---
id: overview
title: How To Develop Extension
slug: overview
order: 0
---

OpenSumi provides a powerful extension ecosystem that is compatible with the VS Code extension API while also having its own OpenSumi API for further expanding the IDE interface and abilities.

The structure diagram of the extension capabilities is as follows:

![Extension Features](https://img.alicdn.com/imgextra/i2/O1CN01xpzgfe24PvNA26s4q_!!6000000007384-2-tps-1371-940.png)

## Developing VS Code Extensions

In extension development, you can follow the development model of VS Code, complete your extension development in VS Code, and then import the implemented extension products into IDE based on OpenSumi for use.

For more details, refer to the [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview) of the VS Code extension document.

Here are some commonly used examples and documents:

- [eclipse-theia/vscode-builtin-extensions](https://github.com/eclipse-theia/vscode-builtin-extensions) —— 基于 VS Code 版本打包其内置插件的工程项目
- [microsoft/vscode-extension-samples](https://github.com/microsoft/vscode-extension-samples) —— VS Code 官方的插件 API 示例仓库
- [Extension Guides](https://code.visualstudio.com/api/extension-guides/overview) —— VS Code 插件开发向导文档
- [Your First Extension](https://code.visualstudio.com/api/get-started/your-first-extension) —— 快速开始插件开发
- [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions) —— 在 OpenSumi 中也支持了这类插件，在纯前端环境有着十分重要的作用

## Developing OpenSumi Extensions

There is a part of OpenSumi that can only run in IDEs built on OpenSumi and provides capabilities including but not limited to:

- Extending and customizing views through React technology stack
- Toolbar customization
- Electron Webview management
- Layout capability
- Full view custom rendering

The directory structure of a complete OpenSumi extension is as follows:

```bash
.
├── .gitignore       # git ignore directory
├── README.md        # extension description
├── src
 ├── extend
 ├── browser         # extension Browser entry, providing UI customization capability
 ├── node            # extension Node entry, providing local environment operation capability
 ├── worker          # extension Worker entry, providing WebWorker environment operation capability
│ └── extension.ts   # extension source code (VS Code extension entry)
├── package.json     # Extension manifest
├── tsconfig.json
```

### Directory Explanation

The `src/extensions.ts` file is the entry point for the VS Code extension. Refer to the Extension Guides for VS Code extension development.

The `src/extend` directory contains OpenSumi's own extension system, including Browser/Node/Worker entry points.

### Entry Point Explanation

> VS Code extensions will behave consistently with a specific version of VS Code when running in OpenSumi, for example, the current `2.23.0` version is compatible with the VS Code extension API version `1.68.0`.

The Browser supports UI customization through `React` components in exposed slots. If your extension needs to register UI components in the interface, you can write them in the Browser.

The Node supports pure Node environment operations. The Node extension has the same API as the VS Code extension and can also call OpenSumi's own extension API. If your extension needs to call native Node.js APIs or run some local tasks, you can write them in the Node.

The Worker has the ability to run in a WebWorker environment. If your extension contains tasks with large amounts of calculations that do not require local capabilities, you can write them in the Worker.

**Whether it's a VS Code extension or `Browser/Node/Worker`, all three are optional. In other words, if you only need native VS Code extension capabilities, you can ignore the extend directory. Similarly, if you only need the capabilities of one of OpenSumi's extensions, you can ignore the other and only need to modify a small amount of configuration.**

## Getting Started

Refer to the [Quick Start](./quick-start) document to quickly set up a extension development environment using OpenSumi CLI locally.

## Extension Examples

In addition to the [VS Code Extension Samples](https://github.com/microsoft/vscode-extension-samples) mentioned above, OpenSumi also has its [OpenSumi Extension Samples](https://github.com/opensumi/opensumi-extension-samples), which includes some common extension sample code.

- Toolbar Sample
- i18n Sample
- Gulp compile Sample
- Gulp
- Custom webpack compile Sample
- Configuration Sample
- Upload OSS Sample
- Plain Webview Sample
- Git Operation Sample
- Command Sample?
