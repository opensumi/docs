---
id: use-contribution-point
title: 使用贡献点
slug: use-contribution-point
order: 5
---

在模块开发中，你可能需要经常与贡献点打交道，在 OpenSumi 中，我们实现了许多关键逻辑的贡献点机制，详细可见：[贡献点](../modules/contribution-point) 文档。

为了让我们的 TodoList 列表注册在左侧的资源管理器面板上，我们需要使用到 `MainLayoutContribution` 来进行面板的注册工作。

## 创建前端视图

首先，我们先编写一个简单的前端展示组件，见：

```ts
import * as React from 'react';
import * as styles from './todo.module.less';

export const Todo = () => {
  return <h1 className={styles.name}>Hello world</h1>;
};
```

## 创建贡献点

创建 `todo.contribution.ts` 文件，使用 `onDidRender` 的贡献点，在 OpenSumi 渲染阶段注册我们的 Todo 面板，见：

```ts
import { Autowired } from '@opensumi/di';
import { Domain, localize } from '@opensumi/ide-core-browser';
import { ExplorerContainerId } from '@opensumi/ide-explorer/lib/browser/explorer-contribution';
import {
  MainLayoutContribution,
  IMainLayoutService
} from '@opensumi/ide-main-layout';
import { Todo } from './todo.view';

@Domain(MainLayoutContribution)
export class TodoContribution implements MainLayoutContribution {
  @Autowired(IMainLayoutService)
  private mainLayoutService: IMainLayoutService;

  onDidRender() {
    this.mainLayoutService.collectViewComponent(
      {
        component: Todo,
        collapsed: false,
        id: 'todo-view',
        name: 'Todo'
      },
      ExplorerContainerId
    );
  }
}
```

上述的代码是在 OpenSumi 的渲染阶段，通过 `IMainLayoutService` 提供的服务能力，在资源管理器面板的视图上，注册上了我们的 Todo 组件。

同时，我们还需要在模块的入口文件中，显示声明一下该贡献点文件的引用，如下：

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [TodoContribution];
}
```

## 效果预览

![Hello World](https://img.alicdn.com/imgextra/i2/O1CN01l3ioLn1wWJr2kidlG_!!6000000006315-2-tps-2738-1810.png)

下一节，我们将进一步学习如何进一步展示我们的 TodoList 列表信息。
