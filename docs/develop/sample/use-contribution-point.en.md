---
id: use-contribution-point
title: Use Contribution Point
slug: use-contribution-point
order: 3
---

In module development, You may need to deal with contribution points on a regular basis. In OpenSumi we implement a contribution point mechanism for many key logics. For more details, you can see [contribution points](../basic-design/contribution-point).

To register our TodoList list on the left Explorer panel, we need to use the `MainLayoutContribution` to register the panel.

## Create a Front View

First, the following code shows a simple front-end presentation component:

```ts
import * as React from 'react';
import * as styles from './todo.module.less';

export const Todo = () => {
  return <h1 className={styles.name}>Hello world</h1>;
};
```

## Create a Contribution Point

To create the`todo.contribution.ts` file, you can use the `onDidRender` contribution points to register our Todo panel in the OpenSumi rendering phase, see:  

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

The preceding code registers our Todo component in the Explorer panel view during the rendering phase of OpenSumi, when we use the service capability provided by  `IMainLayoutService` .  

At the same time, we need to show a declaration of the reference to contribution point file in the module entry file, as follows:

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [TodoContribution];
}
```

## Results Preview  

![Hello World](https://img.alicdn.com/imgextra/i2/O1CN01l3ioLn1wWJr2kidlG_!!6000000006315-2-tps-2738-1810.png)

In the next section, we will learn how to further present our TodoList list information.  
