---
id: how-to-design-module
title: 如何设计模块
slug: how-to-design-module
order: 2
---

本文主要介绍基于 OpenSumi 体系下搭建模块来拓展原生框架功能的思路，对于模块的创建及具体实践可参考我们的 [经典案例](./sample/overview), 案例中有针对具体模块创建的一些基础思路及做法。

## 了解依赖注入

在了解模块前，建议先看一下 [依赖注入](./basic-design/dependence-injector) 这篇文章，在 OpenSumi 中，所有的服务注册及调用都是基于这套统一的依赖注入结构进行服务的实现与调用逻辑的解耦，让框架开发者的开发能够聚焦于开发模块，实现更加独立的模块建设。

## 什么是模块？

一般性而言，模块指的是依托 OpenSumi 框架，通过 `BrowserModule` 和 `NodeModule` 的方式进行原生能力拓展的代码块。

以 `Browser` 层的拓展模块为例，一个 `BrowserModule` 基本定义格式如下：

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

@Injectable()
export class ExplorerModule extends BrowserModule {
  providers: Provider[] = [
    AnyContributions, // 贡献点文件
    AnyService // 注册额外的服务
  ];
}
```

贡献点文件提供如 `Command（命令）`，`Menu（菜单）`，`Keybinding（快捷键）`，`ComponentView（视图）` 等能力的注册。

而额外的一些 Service 定义

## 如何编码

> 在初次接触 OpenSumi 的模块编码时，我们建议你可以先看一下 OpenSumi 内是否有类型的功能或布局，再通过参照源码的方式进行相关编码工作，这将会让你事半功倍。

对于模块编码，从基本需求出发，一般可以简单分为如下两类：

- 基于视图的功能需求
- 基于服务能力的需求

### 基于视图的需求

所有视图的需求的第一步便是创建视图，而在 OpenSumi 的框架下，创建视图的步骤可以分为三步：

1. 注册视图模块
2. 引入模块
3. 在特定的 `Location （布局区块）` 下使用

以 `Explorer` 模块为例，我们创建一个 `explorer.contribution.ts` 文件注册一个视图容器：

```ts
@Domain(ComponentContribution)
export class ExplorerContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register('@opensumi/ide-explorer', [], {
      iconClass: getIcon('explorer'),
      title: localize('explorer.title'),
      priority: 10,
      // component: ExplorerComponent,  // 这里可以传入具体的渲染组件
      containerId: ExplorerContainerId
    });
  }
}
```

在注册视图组件的时候，你也可以同时传入具体的渲染组件，这样这个视图区块将会以这个传入的组件进行渲染，如 `Search` 面板便是直接注册了相应的渲染组件，如图所示：

![Search](https://img.alicdn.com/imgextra/i1/O1CN01wo34Pj1YjYZj9JPkH_!!6000000003095-0-tps-200-134.jpg)

而如果你想在左、右侧边栏下注册一个可容纳多视图组件的抽屉布局，则这里可以不传，然后通过其他模块中去注册视图, 如 `Explorer` 中的抽屉布局，如图所示：

![Explorer](https://img.alicdn.com/imgextra/i1/O1CN01nOueUR1ExwhcLPjvv_!!6000000000419-0-tps-200-111.jpg)

相应的注册方法可参考代码：[file-tree-contribution.ts#L139](https://github.com/opensumi/core/blob/e28ecb7eecb59e996fc92418d2ebc878456388b7/packages/file-tree-next/src/browser/file-tree-contribution.ts#L139)。

然后便是在 `browser/index.ts` 文件中定义 `BrowserModule`, 如下：

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { ExplorerContribution } from './explorer-contribution';

@Injectable()
export class ExplorerModule extends BrowserModule {
  providers: Provider[] = [ExplorerContribution];
}
```

详细代码参考：[explorer/src/browser/index.ts](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/explorer/src/browser/index.ts)。

最终，你只需要在 Browser 层引入该模块，同时在对应的布局设置中引入注册的视图 ID 即可，以 [opensumi/ide-startup]() 项目为例：

在 [common-modules.ts#L44](https://github.com/opensumi/ide-startup/blob/master/src/browser/common-modules.ts#L44) 引入 `ExplorerModule`, 同时，在 [layout-config.ts#L7](https://github.com/opensumi/ide-startup/blob/master/src/browser/layout-config.ts#L7) 下去声明布局区块下渲染的视图 ID 即可，如下所示：

```ts
import { SlotLocation } from '@opensumi/ide-core-browser/lib/react-providers/slot';
import { defaultConfig } from '@opensumi/ide-main-layout/lib/browser/default-config';

export const layoutConfig = {
  ...defaultConfig,
  ...{
    [SlotLocation.right]: {
      modules: ['@opensumi/ide-explorer']
    }
  }
};
```

上面这段代码即声明了，在 IDE 的右侧边栏区域渲染注册 ID 为 '@opensumi/ide-explorer' 的视图组件。

更多视图布局相关介绍可参见：[自定义视图
](../integrate/universal-integrate-case/custom-view) 文档介绍。

### 基于服务的需求

基于视图的需求一般也会包含基于服务的需求，通常而言，在 OpenSumi 框架中提供了大量基础能力支持各种场景下的功能需求，如 `文件服务`，`弹窗服务`，`存储服务` 等，在你需要定制相关服务能力前，可以先看看通过简单的功能组合是否可以达到期望的效果，如果不行，此时你便要考虑定制自定义的服务能力来满足你的需求了。

对于 `命令`，菜单，快捷键，配置等服务，我们建议你通过 [贡献点
](./basic-design/contribution-point) 的方式进行拓展。最终通过如下的基础声明使用：

```ts
@Injectable()
export class DemoModule extends BrowserModule {
  providers: Provider[] = [
    ...
    DemoContribution,
    ...
  ];

}
```

而对于个性化的服务能力注册，我们则建议你通过 [依赖注入](./basic-design/dependence-injector) 的方式进行拓展, 最终通过 `Token + Service` 的方式进行注册。

```ts
@Injectable()
export class DemoModule extends BrowserModule {
  providers: Provider[] = [
    ...
    {
      token: IDemoService,
      useClass: DemoService,
    },
    ...
  ];

}
```

具体的实践案例你都可以在 [经典案例](./sample/overview) 中学习到。

## 关于依赖的潜规则

一个基础的 OpenSumi 模块，一般需要具备如下的分层结构：

```
.
└── src
│   ├── browser  # 可选
│   ├── common
│   └── node     # 可选
└── webpack.config.js
└── package.json
└── README.md
```

我们期望的依赖结构如下所示：

```json
 ...
 "dependencies": {
    "@opensumi/ide-core-common": "2.16.10",
    "@opensumi/vscode-jsonrpc": "^8.0.0-next.2",
    "path-match": "^1.2.4",
    "shortid": "^2.2.14",
    "ws": "^7.2.0"
  },
  "devDependencies": {
    "@opensumi/ide-components": "2.16.10",
    "@opensumi/ide-dev-tool": "^1.3.1",
    "mock-socket": "^9.0.2"
  }
  ...
```

在 `devDependencies` 中放置 Browser 层及构建依赖，在 `dependencies` 放置 Node 层依赖。

### 依赖结构图示

![Dependence](https://img.alicdn.com/imgextra/i3/O1CN01bFR3Nf1XPZgCyIDBM_!!6000000002916-2-tps-1586-820.png)

而对于 OpenSumi 全局的一些依赖结构，还有如下的一些潜规则：

1. `@opensumi/ide-core-common` 为 `@opensumi/ide-core-node` ， `@opensumi/ide-core-browser` 和 `@opensumi/ide-electron` 的共同依赖

2. 模块不直接依赖 `@opensumi/ide-core-common`，而是通过 `@opensumi/ide-core-node` 和 `@opensumi/ide-core-browser` 间接依赖

3. 由于 Browser 资源一般有脚本进行打包构建，而 Node 资源一般需要直接依赖 `node_modules` ，故我们前期设计上期望模块的 Browser 层依赖放在 `DevDepedences`，而 Node 层依赖放在 `Dependences`.

4. 所有模块的构建，统一依赖 `@opensumi/ide-dev-tool` 方式引入构建依赖，如 `typescript`, `webpack` 等

5. 基于这种目录结构，如果存在多个 Browser 模块的公共依赖，放在 `@opensumi/ide-core-browser` 将能减少版本维护的烦恼，故 OpenSumi 中许多前后端的公共依赖会分别在 `@opensumi/ide-core-browser` 及 `@opensumi/ide-core-node` 中独立声明。

6. 原则上如果模块 `common` 中只能引入 `@opensumi/ide-core-common` 中的内容，但如果该模块为纯 `Browser` 或 `Node` 模块，则允许从对应的 `@opensumi/ide-core-browser` 和 `@opensumi/ide-core-node` 中引入。

自此，你便完成了对于 OpenSumi 模块的初步认识，剩下的便是不断实践，收获更多的实践经验，如果你有更多关于实践上的问题，也欢迎到 [Issue](https://github.com/opensumi/docs/issues) 提交，我们会及时处理你的相关问题。
