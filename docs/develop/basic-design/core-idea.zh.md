---
id: core-idea
title: 核心概念
slug: core-idea
order: 1
---

OpenSumi 定位是一款 `IDE 框架` ，基于 OpenSumi 你可以搭建出 Cloud 或 Desktop 端的 IDE 产品。OpenSumi 默认会提供以下能力

- 基础功能模块，例如 FileTree、Editor、SCM 等
- 提供丰富的自定义能力，包括集成、插件等形式
- 兼容 VS Code 的插件系统，支持 LSP/DAP 等主流协议

与之相对的，OpenSumi 目前不提供针对特定端的以下能力

- Cloud IDE 场景下的容器/虚拟机管理
- Desktop IDE 场景下的窗口管理

以下列举了一些你可能会遇到 OpenSumi 中常见的概念、名词与解释

## 模块

OpenSumi 的发布产物是不同模块的 NPM 包，每个包就是一个**模块**，它们分别负责不同的功能。模块一般由前端、后端以及公共代码、类型几部分组成。一个常见的模块结构如下：

```bash
.
├── README.md
├── __tests__
│   ├── browser
│   ├── common
│   ├── node
├── package.json
├── src
│   ├── browser
│   ├── common
│   ├── index.ts
│   └── node
└── webpack.config.js
```

### 模块的职责

一般意义上模块可以提供一些基础功能，例如 `search` 模块提供了全文搜索功能，在该模块的 `src/browser` 目录下包含了前端 UI 相关的代码，而执行搜索的则是 `src/node` 目录下的代码。

前端与后端通过 RPC 的方式通信，与调用一个异步方法没有太大区别，你不需要关心通信细节，只需要参考已有的模式来组织代码即可。关于模块前后端通信的使用可以参考 [前端后端通信](./connection)。

模块代码中 `browser/node/common` 都不是必须的，允许存在仅提供前端 UI 或后端功能的模块。

模块可以提供贡献点(Contribution)给其他模块，其他模块可以根据该模块声明的 `ContributionProvider` 进行贡献点的注册。贡献点机制主要用于模块提供注册能力给其他模块的场景，例如 `main-layout` 提供组件级别的贡献点，而其他模块通过注册组件后，可以结合 Layout 的能力自由组装 IDE 界面，菜单模块会提供注册菜单的贡献点。

### 模块分层与依赖

我们将模块划分为 `核心模块` 、`功能模块`。模块之间存在一定的依赖关系，典型的例如 `file-service` 模块负责文件读写、以及文件系统注册与管理等功能，在许多功能模块中读写相关的操作都会依赖 `file-service`。

核心模块是指组成 IDE 核心功能的一些必选模块，这些模块不可被去除。例如 `main-layout` 负责实现主界面整体布局及视图注册功能， `core-browser` 、 `core-node` 负责维护 IDE ClientApp、ServerApp 实例的声明周期以及相关贡献点管理。

功能模块一般是可插拔的，也就是在集成代码中可以将这些模块去除，或者重新替换实现，并不会影响其他功能。但一些提供插件 API 的模块如果去除会导致插件无法正常工作。因为 `extension` 依赖了大部分功能模块来提供 API。目前可以插拔的模块有：

- 大纲 outline
- 跨文件搜索 file-search
- 终端 terminal-next
- 评论 comments
- 已打开编辑器 opened-editor
- 工具栏 toolbar

## 依赖注入

OpenSumi 使用一款自研的 DI 框架 `@opensumi/di` 来实现这些模块间的实例管理与获取，依赖抽象接口的约定可以让我们很轻松的覆盖部分 Service 甚至是模块的实现，提高可拓展性。
关于 `@opensumi/di` 的具体使用及详细介绍可以参考文档 [依赖注入](./dependence-injector)，或访问源码查看 [opensumi/di](https://github.com/opensumi/di)。

## 插件与 API

前面提到，OpenSumi 很多功能模块是可插拔的，而无法插拔的模块则是因为它们提供了插件 API (换句话说将 extension 模块移除后这些模块也可以插拔)。OpenSumi 的插件体系是基于 VS Code 的拓展，可以看作是 VS Code 插件的超集，关于插件体系的详细介绍参考 [插件机制](./extension-mechanism)。

OpenSumi 插件与 VS Code 插件类似，我们会保持与 VS Code 插件 API 的兼容性，也会不断更新、迭代插件 API 。插件 API 是以方法、类等形式提供给第三方代码来调用的对象集合。extension 模块包含了所有插件及插件 API 相关的实现，但具体到某一个插件 API ，最终调用的则是实现它们的模块，例如 `sumi.window.createTerminal` 能力是由 `terminal-next` 模块提供的，而 extension 中只是将其包装提供给插件调用而已。
