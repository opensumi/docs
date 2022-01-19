---
id: extension-mechanism
title: 插件机制
slug: extension-mechanism
order: 3
---

OpenSumi 插件系统是 VS Code 插件的超集，除了兼容 VS Code 官方的 API 之外，我们还有自己扩展的一些插件 API，以及包括前端、WebWorker 的插件等。本文主要介绍 OpenSumi 插件的基本原理与 API 实现流程。

## 基本原理

![OpenSumi Extension](https://img.alicdn.com/imgextra/i4/O1CN01anYrzq1Kcm1vW2Vkk_!!6000000001185-2-tps-2220-1485.png)

如图中所示，整个插件系统涉及到前端 UI、Web Worker、后端主进程，插件进程四个环境。

OpenSumi 插件可以有 3 个入口，分别是 `main` 、`browserMain` 以及 `workerMain`，这三个入口都是可选的，其中 `main` 是运行于上图中独立的 Node.js 进程中的插件，也具有与 VS Code 完全保持兼容的 API。我们从 main 入口的插件进程开始一步一步介绍整个插件系统的原理。

### 插件进程 (Extension Node Host)

如果你了解过 VS Code 的插件系统就会知道，VS Code 插件进程是完全独立于主进程的，而 OpenSumi 的插件进程也保持了这一特性，插件进程本身是与主进程完全隔离的一个子进程，它们之间通过 Node.js 的 IPC 通信。

![](https://img.alicdn.com/imgextra/i3/O1CN01ttWp3E1dludC7Qkt5_!!6000000003777-2-tps-1723-726.png)

而插件由于全部运行于同一个进程，它们之间是可以相互访问的，这也是继承自 VS Code 的设计，例如可以通过调用 `sumi.extensions.getExtension` 或 `sumi.extensions.all` 来获取到其他插件的实例，甚至可以调用其他插件暴露的 API，这些都是允许的。

### Web Worker 插件进程 (Extension Worker Host)

前文中提到的 Web Worker 插件环境可以看作是 Extension Node Host 的低配版<!--有没有更好的形容词，子集？精简版？-->，这是因为在设计之初 Web Worker 插件线程只用于承担一些与 Node.js 无关的、密集计算型的任务，它的架构图大体上与 Extension Node Host 一致，只是去掉了一些强依赖 Node.js 能力的 API，例如 FS、Terminal、Task 、Debug 等。

### Browser 插件

Browser 插件是 OpenSumi 特有的，也是与 VS Code 最大的差异点。Browser 插件通过 `Contributes` 来声明注册点，代码中导出对应的 React 组件来实现的。Contributes Point 是固定的，包括左、右、底部面板，以及 Toolbar 等位置。

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
