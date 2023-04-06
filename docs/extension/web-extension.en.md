---
id: web-extension
title: Web Extensions
slug: web-extension
order: 2
---

In OpenSumi, we provide a `Web Worker Extension Host` implemented by Web Worker, which provides some computing-intensive capabilities that are not related to NodeJS capabilities.

The Web Worker API has the capabilities of most Node extension processes, but removes some capabilities that strongly rely on NodeJS, such as FileSystem, Terminal, Task, Debug, etc.

Through this layer of design, we further support [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions) in VS Code, you can conveniently use it in our pure front-end version Use some pure front-end extensions such as:

- [microsoft/vscode-anycode](https://github.com/microsoft/vscode-anycode)
- [vscode/typescript-language-features](https://github.com/erha19/vscode/blob/8cea434decbabf5259b47e927eca67afede7ad10/extensions/typescript-language-features/package.json#L76)

## Usage

### Compatible with VS Code Web Extensions

> Reference [Web Extensions](https://code.visualstudio.com/api/extension-guides/web-extensions)

In VS Code, specify the Web Extension entry through the `browser` field in `package.json`, which is a required field. At the same time, in addition to not including the `main` field, some contribution points are not supported:

- `localizations`
- `debuggers`
- `terminal`
- `typescriptServerPlugins`

Such extensions can be used directly in OpenSumi.

### Another usage

In addition to being compatible with the usage of VS Code's Web Extensions, OpenSumi also supports the way to import extensions in the Worker environment to execute code by declaring in `sumiContributes#workerMain` in `package.json`.

The Worker extension is very similar to the NodeJS extension, but it should be noted that some native modules should not be referenced in the Worker extension. At the same time, the Worker API supports two module names from `sumi-worker` and `sumi`, because many Worker The plugin is migrated from the NodeJS version, and the module name `sumi` is reserved to be compatible with this kind of plugin.

```ts
// import API from sumi-worker
import * as sumi from 'sumi–worker';
// or sumi, this is for compatibility with some extensions migrated to the Worker environment
// import * as sumi from 'sumi';
// or vscode, also for compatibility with some VS Code extensions migrated to the Worker environment
import * as vscode from 'vscode';

export function activate(context) {
  sumi.window.showInformationMessage('Hello OpenSumi Worker Extension!');
}

export function deactivate() {}
```

## API Supported

The Worker API is a subset of the NodeJS API. Basically, except for APIs related to FileSystem, Terminal, Task, and Debug, everything else can run in Worker. Currently supported APIs include:

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

The usage of these APIs remains completely consistent. In other words, if your plugin only uses the above APIs and does not depend on the NodeJS environment, then you can migrate to the Worker plugin smoothly.
