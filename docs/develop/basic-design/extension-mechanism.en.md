---
id: extension-mechanism
title: Extension Mechanism
slug: extension-mechanism
order: 3
---

OpenSumi extension system is a superset of VS Code extensions. In addition to official VS Code APIs, we also have extended some API extensions of our own, including front-end, WebWorker extensions, etc. This paper mainly introduces the basic principle and API implementation process of OpenSumi extensions.  

## Basic Principle

![OpenSumi Extension](https://img.alicdn.com/imgextra/i4/O1CN01anYrzq1Kcm1vW2Vkk_!!6000000001185-2-tps-2220-1485.png)

As shown in the figure, the whole extension system involves four environments: front-end UI, Web Worker, back-end main process, and extension process.

The OpenSumi extension has three entrances: `main` , `browserMain` and `workerMain`, all of which are optional. `Main` is the extension running in the independent Node.js process shown above, its API remaining fully compatible with VS Code. Let's start from the main entrance of the extension process step by step to introduce the principle of the whole extension system.  

### 插件进程 (Extension Node Host)

If you know about VS Code's extension system, you know that the VS Code plugin process is completely independent of the main process. The same is true of OpenSumi's extension process, as the extension process itself is a completely isolated sub process from the main process: they communicate though Node.js's IPC.

![](https://img.alicdn.com/imgextra/i3/O1CN01ttWp3E1dludC7Qkt5_!!6000000003777-2-tps-1723-726.png)

而插件由于全部运行于同一个进程，它们之间是可以相互访问的，这也是继承自 VS Code 的设计，例如可以通过调用 `sumi.extensions.getExtension` 或 `sumi.extensions.all` 来获取到其他插件的实例，甚至可以调用其他插件暴露的 API，这些都是允许的。Extensions, since they all run in the same process, are accessible to each other, which is also inherited from VS Code's design. For example, when calling the ` sumi. Extensions. GetExtension ` or ` sumi. Extensions. All `, or even other APIs exposed by rest extensions, we can get other extension instances, all of these are allowed.  

### Web Worker 插件进程 (Extension Worker Host)

前文中提到的 Web Worker 插件环境可以看作是 Extension Node Host 的低配版<!--有没有更好的形容词，子集？精简版？-->，这是因为在设计之初 Web Worker 插件线程只用于承担一些与 Node.js 无关的、密集计算型的任务，它的架构图大体上与 Extension Node Host 一致，只是去掉了一些强依赖 Node.js 能力的 API，例如 FS、Terminal、Task 、Debug 等。

### Browser Extensions

Browser 插件是 OpenSumi 特有的，也是与 VS Code 最大的差异点。Browser 插件通过 `Contributes` 来声明注册点，代码中导出对应的 React 组件来实现的。Contributes Point 是固定的，包括左、右、底部面板，以及 Toolbar 等位置。The Browser extension is unique to OpenSumi and is the biggest difference from VS Code. The Browser extension declare the register point by `Contributes`  exporting the React component into the code.  Contributes Point is fixed and includes left, right, and bottom panels, as well as Toolbar, and so on.  

## 插件 API

### Node 环境中的 API

`package.json` 中声明 `main` 以及 `sumiContributes#nodeMain` 的入口即是插件的 Node.js 环境，可以访问到 OpenSumi Node 环境的 API。
在插件中调用 `import * as sumi from 'sumi'` 或 `const sumi = require('sumi')` 即可访问到插件 API，这些 API 根据功能由不同的 namespace 区分。这里导入 `sumi` 将可以访问到 VS Code + OpenSumi 的 API ，而如果使用 `import vscode from 'vscode'` 则只能使用 VS Code 标准的 API。

### Worker 环境中的 API

`package.json` 中声明 `sumiContributes#workerMain` 的入口即是插件的 Worker 环境，可以访问到 OpenSumi Worker 环境中的 API。

Worker API 支持从 `sumi-worker` 和 `sumi` 两种模块名，这是因为很多 Worker 插件是从 Node 版本迁移而来的，保留 `sumi` 这个模块名来兼容这类插件。

Worker API 是 Node 端 API 的子集，基本上除了与 FS、ChildProcess、Terminal 相关的 API，其他都可以运行在 Worker 中。

### Browser 环境 API

`package.json` 中声明 `sumiContributes#browserMain` 的入口即是插件的 Browser 环境，可以访问到 OpenSumi Browser 环境中的 API。
Browser 环境中提供的 API 较少，可以通过引用 `sumi-browser` 来调用，核心是提供了 `executeCommand` 来执行命令，这里的命令可以是跨进程调用，例如注册在 Node/Worker 中的命令。Browser 环境的设计原则是尽量只负责视图渲染，一些复杂的业务逻辑最好使用 Node/Worker 环境。
