---
id: web-extension
title: 纯前端插件（Web Extensions）
slug: web-extension
order: 2
---

在 OpenSumi 中，我们提供了一个 Web Worker 实现的 `Web Worker 插件进程`，提供了一些与 NodeJS 能力无关的、密集计算型的能力。

Web Worker API 具备大多数 Node 插件进程所具备的能力，只是去掉了一些强依赖 NodeJS 的能力，如 FileSystem、Terminal、Task、Debug 等。

通过这层设计，我们进一步支持了 VS Code 中的 [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions)，你可以在我们的纯前端版本中方便的使用一些纯前端插件如：

- [microsoft/vscode-anycode](https://github.com/microsoft/vscode-anycode)
- [vscode/typescript-language-features](https://github.com/erha19/vscode/blob/8cea434decbabf5259b47e927eca67afede7ad10/extensions/typescript-language-features/package.json#L76)

## 用法

### 兼容 VS Code Web Extensions

> 参考资料 [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions)

在 VS Code 中，通过在 `package.json` 中的 `browser` 字段去指定 Web Extension 入口，该字段是必选字段， 同时，除了不包含 `main` 字段外，一些贡献点也是不支持的：

- `localizations`
- `debuggers`
- `terminal`
- `typescriptServerPlugins`

这类插件可以直接在 OpenSumi 中使用。

### 另一种用法

除了兼容 VS Code 的 Web Extensions 用法，OpenSumi 也支持在 `package.json` 中的 `sumiContributes#workerMain` 中声明的方式来引入 Worker 环境的插件执行代码。

Worker 插件与 NodeJS 端插件非常类似，但需要注意的是不要在 Worker 插件中引用一些原生的模块，同时，Worker API 支持从 `sumi-worker` 和 `sumi` 两种模块名，这是因为很多 Worker 插件是从 NodeJS 版本迁移而来的，保留 `sumi` 这个模块名来兼容这类插件。

```ts
// 从 sumi-worker 中引入 API
import * as sumi from 'sumi–worker';
// or sumi，这是为了兼容一些迁移到 Worker 环境的插件
// import * as sumi from 'sumi';
// or vscode，也是为了兼容一些迁移到 Worker 环境的 VS Code 插件
import * as vscode from 'vscode';

export function activate(context) {
  sumi.window.showInformationMessage('Hello OpenSumi Worker Extension!');
}

export function deactivate() {}
```

## 支持的能力

Worker API 是 NodeJS API 的子集，基本上除了与 FileSystem、Terminal、Task、Debug 相关的 API，其他都可以运行在 Worker 中。目前支持的 API 包含：

- VS Code API
  - [x] language
  - [x] editor
  - [x] command
  - [x] comments
  - [x] workspace
  - [x] extensions
  - [x] window
  - [x] env
- SUMI API
  - [x] layout

这些 API 的用法保持完全一致，换句话说如果你的插件仅使用了以上 API，同时又没有对 NodeJS 环境的依赖，那么完全可以平滑的迁移到 Worker 插件。
