---
id: overview
title: 框架介绍
slug: overview
order: 0
---

OpenSumi 框架旨在解决阿里经济体内部 IDE 产品研发的重复建设问题，满足 IDE 在更多垂直场景的定制能力，同时实现 Web 与本地客户端共用底层，让 IDE 研发从早期的“刀耕火种”时代向“机器化大生产”时代迈进。

如果你对 OpenSumi 框架的建设有兴趣，欢迎查看 [如何贡献代码](../develop/how-to-contribute) 为 OpenSumi 框架建设出一份力。

## 整体架构

为了保证框架可以同时在 `Web` 和 `Electron` 环境下运行，OpenSumi 采用了一套前后端分离、通过一层抽象的通信层进行相互调用的项目结构。

在 `Web` 上，我们使用 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) 来作为通信的实现。

在`Electron` 上，我们则是 `IPC` 通信。

每一个通信的连接对应前后端一个独立的 [DI (Dependence Inject)](../develop/basic-design/dependence-injector) 容器，所以 **OpenSumi 的后端实现是无状态的**，不同连接之间是严格隔离的。

在 OpenSumi 内主要有三个核心进程：

- 插件进程 （Extension Process）
- 后端进程 （Node Process）
- 前端进程 （Browser Process）

为了保证插件的问题不会影响 IDE 的性能表现，插件能力上 OpenSumi 采用了跟 `VS Code` 类似的方案，通过独立的插件进程去启动插件，插件进程再通过后端进程与前端进程进行通信。

OpenSumi 的不同能力实现被拆分到了不同的模块内，这些模块通过 [贡献点机制 (Contribution Point)](../develop/basic-design/contribution-point)、[DI 机制 (Dependence Inject)](../develop/basic-design/dependence-injector) 互相之间有较弱的依赖关系，对于一些比较核心的基础模块，如主题服务、布局服务等，也会被其他模块直接依赖。

**因此，在集成开发过程中需要保证一些模块的引入顺序。**

整体启动的生命周期如下图所示：

![生命周期](https://img.alicdn.com/imgextra/i4/O1CN01G6C1nf21GoZEzAlJk_!!6000000006958-2-tps-1564-874.png)

## 什么是模块？

模块是指 [OpenSumi](https://github.com/opensumi/core) 中 `package`  目录下的一个包，它可以发布到 `npm`，并通过集成时安装依赖的方式引用。

通常情况下，模块是一个独立的功能实现，例如 `debug`  模块基于 [DAP](https://microsoft.github.io/debug-adapter-protocol/) 实现了一层通用的调试适配器，包括了调试器前端、会话管理等核心功能。并通过插件 API 的方式将其提供给插件调用。

一个模块的基本结构如下

```bash
.
├── __tests__
│   ├── browser
│   └── node
└── src
│   ├── browser
│   ├── common
│   └── node
└── webpack.config.js
└── package.json
└── README.md
```

> 在 [OpenSumi](https://github.com/opensumi/core) 中，你可以通过 `yarn run create [模块名]` 的方式自动创建并关联引用关系。

模块即可以包含 `Browser` 层代码，也可以包含 `Node` 层代码

- `browser` 层代码一般用于处理视图相关的能力，以 OpenSumi 中的 `search`  模块为例，搜索的界面就是由 `browser` 层进行实现。
- `node` 层代码一般用于处理需要使用到 `Node.js` 能力的逻辑，例如搜索面板中的全局搜索能力就需要 `node` 层进行实现。
- `common` 层一般用于存放一些公共的变量、工具方法、类型声明等。

### 拓展 Browser 层能力

我们通过以下的文件结构拓展 `Browser` 层能力，你可以通过在 `providers` 中声明相关内容来拓展能力，详细案例可见我们的 [Todo List 案例](../develop/sample/overview)。

```javascript
// Browser 模块入口
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { HelloWorld } from './hello-world.view';

@Injectable()
export class ModuleDemoModule extends BrowserModule {
  providers: Provider[] = [];
}
```

### 拓展 Node 层能力

我们通过以下的文件结构拓展 `Node` 层能力，你可以通过在 `providers` 中声明相关内容来拓展能力，详细案例可见我们的 [Todo List 案例](../develop/sample/overview)。

```javascript
// Node 模块入口
import { Provider, Injectable } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';

@Injectable()
export class ModuleDemoModule extends NodeModule {
  providers: Provider[] = [];
}
```

## 什么是插件？

插件, 也可称为 Extension，是指当前 OpenSumi 框架下支持的，通过在特定位置安装插件文件，从而对 IDE 的界面、功能进行二次插件的一类程序文件，设计上兼容 `VSCode` 中的 [VSCode Extension API](https://code.visualstudio.com/api)，即对于使用 OpenSumi 进行开发的 IDE 产品天然兼容 `VSCode` 的插件体系。

![插件](https://img.alicdn.com/imgextra/i3/O1CN01gHphRQ26x18NyYeTz_!!6000000007727-2-tps-1156-800.png)

插件开发文档见：[Extension API 概览](../extension/overview);

### 如何发布

由于协议问题，OpenSumi 无法直接使用 VS Code 插件市场源，当前 OpenSumi 默认集成了 Eclipse 公司研发的 [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) 服务，开发者可以直接使用，也可以基于 [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) 建设自己的插件市场， 后续，我们也将建设自己的插件市场开发免费的插件托管服务给更多开发者使用。

参考文档：[Publishing Extensions](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
