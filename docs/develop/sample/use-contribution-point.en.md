---
id: use-contribution-point
title: Use Contribution Point
slug: use-contribution-point
order: 3
---

In module development, You may need to deal with contribution points on a regular basis. In OpenSumi we have implemented a contribution point mechanism for many key logics, as detailed in the documentation [contribution points](../basic-design/contribution-point).

To register our TodoList list on the left Explorer panel, we need to use the `MainLayoutContribution` to register the panel.

## Creating a Front View

First, let's write a simple front-end presentation component as follows:

```ts
// modules/todo/browser/todo.view.tsx

import * as React from 'react';
import * as styles from './todo.module.less';

export const Todo = () => {
  return <h1 className={styles.name}>Hello world</h1>;
};
```

## Creat a Contribution Point

To create the`todo.contribution.ts`file, use the `onDidRender`contribution points to register our Todo panel in the OpenSumi rendering phase, see:

```ts
// modules/todo/browser/todo.contribution.ts

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

The above code registers our Todo component in the Explorer panel View of the during the rendering phase of OpenSumi, with the service capability provided by `IMainLayoutService` .

At the same time, we need to show a declaration of the reference to the contribution point file in the module's entry file, as follows.

```ts
// modules/todo/browser/index.ts

import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { TodoContribution } from './todo.contribution';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [TodoContribution];
}
```

## Results Preview

![Hello World](https://img.alicdn.com/imgextra/i2/O1CN01l3ioLn1wWJr2kidlG_!!6000000006315-2-tps-2738-1810.png)

In the next section, we'll learn how to further present our TodoList list information.
