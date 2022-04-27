---
id: how-to-design-module
title: How to Design Module
slug: how-to-design-module
order: 2
---

本文主要介绍基于 OpenSumi 体系下搭建模块来拓展原生框架功能的思路，对于模块的创建及具体实践可参考我们的[经典案例](./sample/overview), 案例中有针对具体模块创建的一些基础思路及做法。This article introduces the idea of building modules based on the OpenSumi system to extend the functionality of the native framework, for the creation of modules and specific practices can refer to our [classic case](. /sample/overview), which has some basic ideas and practices for creating specific modules.

## Know about Dependency Injection

在了解模块前，建议先看一下 [依赖注入](./basic-design/dependence-injector.zh.md) 这篇文章，在 OpenSumi 中，所有的服务注册及调用都是基于这套统一的依赖注入结构进行服务的实现与调用逻辑的解耦，让框架开发者的开发能够聚焦于开发模块，实现更加独立的模块建设。
Before learning the module, it is recommended to read [Dependency Injection](./basic-design/dependence-injector.zh.md) . In OpenSumi, all service registration and invocation are based on this unified dependency injection structure to implement services and decoupling the implementation of services and invocation logic, allowing framework developers to focus their development on developing modules and achieve more independent module construction.

## What is a module?

Loosely speaking, modules are code blocks that rely on the OpenSumi framework to extend native capabilities by `BrowserModule` and `NodeModule` methods.

Taking the extension module of the `Browser` layer as an example, a `BrowserModule` basic format is defined as follows:

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

Contribution point files provide registration of capabilities such as `Command`, `Menu`, `Keybinding`, `ComponentView`, etc.

And some other Service definitions

## How to Encode

> When you first start to learn about OpenSumi module coding, we recommend that you look at OpenSumi first to see if there is any type of functionality or layout, and then refer to the source code to do the relevant coding. This can be accomplished with half the effort.   

To start with basic needs, module coding can be generally divided into the following two categories:  

- Functional requirements based on view
- Demand based on service capability

### Functional Requirements Based on View

The first step for all view requirements is to create a view, and in the OpenSumi framework, the steps to create a view can be divided into two steps.

1. Register the view module
2. Introduce the module
3. Used under the specific `Location （Layout Block）`case

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

When registering a view component, you can also import a specific rendering component so that the view block will be rendered with that component, for example, the `Search` panel is registered with the corresponding component directly, as shown here.

![Search](https://img.alicdn.com/imgextra/i1/O1CN01wo34Pj1YjYZj9JPkH_!!6000000003095-0-tps-200-134.jpg)

If you want to register a drawerlayout that can hold multiple view components in the left and right sidebar, you can leave it here and then unregister the view in another module, such as the drawerlayout in `Explorer` , as shown in the picture below:  

![Explorer](https://img.alicdn.com/imgextra/i1/O1CN01nOueUR1ExwhcLPjvv_!!6000000000419-0-tps-200-111.jpg)

The corresponding registration method can refer to the code:[file-tree-contribution.ts#L139](https://github.com/opensumi/core/blob/e28ecb7eecb59e996fc92418d2ebc878456388b7/packages/file-tree-next/src/browser/file-tree-contribution.ts#L139)。

Then define `BrowserModule`in the `browser/index.ts` file as follows: 

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

import { ExplorerContribution } from './explorer-contribution';

@Injectable()
export class ExplorerModule extends BrowserModule {
  providers: Provider[] = [ExplorerContribution];
}
```

Detailed code reference:[explorer/src/browser/index.ts](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/explorer/src/browser/index.ts)。

In the end, you just need to import this module in the Browser layer and add the registered view ID to the corresponding layout Settings. Take the [opensumi/ide-startup]() project as an example:  

To import `ExplorerModule`in [common-modules.ts#L44](https://github.com/opensumi/ide-startup/blob/master/src/browser/common-modules.ts#L44) , 同时，在 [layout-config.ts#L7](https://github.com/opensumi/ide-startup/blob/master/src/browser/layout-config.ts#L7) 下去声明布局区块下渲染的视图 ID 即可，如下所示：

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

The above code declares that the view component registered with ID '@OpenSumi/IDE-Explorer' is rendered in the right sidebar area of the IDE.  

For more information about view layout, see:[Custom View
](../integrate/universal-integrate-case/custom-view) document introduction。 

###  Demand Based on Service Capability

基于视图的需求一般也会包含基于服务的需求，通常而言，在 OpenSumi 框架中提供了大量基础能力支持各种场景下的功能需求，如 `文件服务`，`弹窗服务`，`存储服务` 等，在你需要定制相关服务能力前，可以先看看通过简单的功能组合是否可以达到期望的效果，如果不行，此时你便要考虑定制自定义的服务能力来满足你的需求了。In general, the OpenSumi framework provides a lot of basic capabilities to support various scenarios, such as `File Service`, `Popup Service`, `Storage Service`, etc. Before you need to customize the related service capabilities, you can see if the desired effect can be achieved through a simple combination of features, if not, then you should consider customizing the service capabilities to meet your needs.

Translated with www.DeepL.com/Translator (free version)

For services such as `commands`, menus, shortcuts, configurations, etc., we recommend that you use [Contribute Points](./basic-design/contribution-point) for extensions. The final use is through the following base declaration.

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

For personalized service capability registration, we recommend you to extend through[Dependency Injection](./basic-design/dependence-injector.zh.md), and eventually register by `Token + Service`.

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
Specific practical examples can be found in the[classic case](./sample/overview). A basic OpenSumi module generally needs to have the following hierarchical structure:  

## Hidden Rules About Dependencies

A basic OpenSumi module generally needs to have the following hierarchical structure:  

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

The desired dependency structure is as follows:

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

Place the Browser layer and build dependencies in `devDependencies`, and Node layer dependencies in `dependencies`.  

### Dependent Structure Diagram

![Dependence](https://img.alicdn.com/imgextra/i3/O1CN01bFR3Nf1XPZgCyIDBM_!!6000000002916-2-tps-1586-820.png)

For some of the OpenSumi global dependency structures, there are some unspoken rules as follows.

1. `@opensumi/ide-core-common` is the shared dependency of  `@opensumi/ide-core-node` ， `@opensumi/ide-core-browser`and `@opensumi/ide-electron` 

2. Modules do not directly depend on `@opensumi/ide-core-common`, but indirectly through `@opensumi/ide-core-node` and `@opensumi/ide-core-browser`

3. Browser resources are usually packaged and built with scripts, while Node resources need to rely directly on `node_modules`. Therefore, we expected the Browser layer dependency of the module to be placed in `DevDepedences` in the early design. Node layer dependencies are placed on 'Dependences'.  

4. All modules are built through using `@opensumi/ide-dev-tool` to import dependencies, such as `typescript`, `webpack`  etc  

5. Based on this directory structure, if there are public dependencies for multiple Browser modules, putting them in `@opensumi/ide-core-browser` will reduce the version maintenance workload, so many public dependencies in the front and back ends of OpenSumi are declared independently in `@opensumi/ide-core-browser` and `@opensumi/ide-core-node` respectively.

6. In principle, the module `common` can only import content from `@opensumi/ide-core-common` , but if the module is pure `Browser` or `Node` module, it can be imported from the corresponding  `@opensumi/ide-core-browser` and `@opensumi/ide-core-node` .  

Now that you have your initial understanding of the OpenSumi module, all that remains is to practice and gain more practical experiences.If you have more questions about practice, please feel free to submit them to [Issue](https://github.com/opensumi/doc/issues) and we will handle your questions promptly.
