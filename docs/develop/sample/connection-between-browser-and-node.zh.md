---
id: connection-between-browser-and-node
title: 实现前后端通信
slug: connection-between-browser-and-node
order: 6
---

实现前后端的双向通信，我们需要依赖 `BrowserModule` 和 `NodeModule` 特殊的服务声明。

首先，需要定义一个双向通信的消息唯一通道，我们定义一个 `ITodoConnectionServerPath` 作为消息通道的唯一 ID，前后端的服务都通过这个通道进行消息分发。

```ts
export const ITodoConnectionServerPath = 'ITodoConnectionServerPath';
```

## 关联前后端服务

首先，需要在 `TodoService` 和 `TodoNodeService` 上继承 `RPCService`。

```ts
@Injectable()
export class TodoService extends RPCService implements ITodoService { ... }
```

```ts
@Injectable()
export class TodoNodeService extends RPCService implements ITodoNodeService { ... }
```

在双端的 `TodoListModule` 上进行关联。

### 关联前端服务

```ts
import { Provider, Injectable } from '@ali/common-di';
import { BrowserModule } from '@ali/ide-core-browser';
import { TodoContribution } from './todo.contribution';
import { TodoService } from './todo.service';
import { ITodoConnectionServerPath, ITodoService } from '../common';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [
    {
      token: ITodoService,
      useClass: TodoService
    },
    TodoContribution
  ];

  backServices = [
    {
      servicePath: ITodoConnectionServerPath, // 双端通信通道唯一路径
      clientToken: ITodoService // 关联前端服务
    }
  ];
}
```

### 关联后端服务

```ts
import { Provider, Injectable } from '@ali/common-di';
import { NodeModule } from '@ali/ide-core-node';
import { ITodoNodeService, ITodoConnectionServerPath } from '../common';
import { TodoNodeService } from './todo.service';

@Injectable()
export class TodoListModule extends NodeModule {
  providers: Provider[] = [
    {
      token: ITodoNodeService,
      useClass: TodoNodeService
    }
  ];

  backServices = [
    {
      servicePath: ITodoConnectionServerPath, // 双端通信通道唯一路径
      token: ITodoNodeService // 关联后端服务
    }
  ];
}
```

## 实现前后端服务

本案例实现了，在 Todo 项点击的同时，传递消息到后端服务，后端服务在接收到消息时，重新组织消息内容后回传给前端进行消息展示。核心实现如下：

前端服务展示消息时同时通知到后端服务。

```ts
@Injectable()
export class TodoService extends RPCService implements ITodoService {
  ...
  @Autowired(ITodoConnectionServerPath)
  private todoNodeService: ITodoNodeService;

  // 展示消息时调用后端服务
  showMessage = (message: string) => {
    this.messageService.info(message);
    this.todoNodeService.showMessage(message);
  };
  // 接收后端消息
  onMessage = (message: string) => {
    this.messageService.info(message);
  };
  ...
}
```

后端服务接收到消息后回传到前端服务。

```ts
import { Injectable } from '@ali/common-di';
import { ITodoNodeService } from '../common';
import { RPCService } from '@ali/ide-connection';

@Injectable()
export class TodoNodeService extends RPCService implements ITodoNodeService {
  showMessage = (message: string) => {
    // 这里的 this.rpcClient![0] 可以直接获取到通信通道下的 proxy 实例
    this.rpcClient![0].onMessage(`I got you message, echo again. ${message}`);
  };
}
```

## 效果展示

![双向通信](https://img.alicdn.com/imgextra/i1/O1CN01ItcgHk1l0kmoQIjmb_!!6000000004757-1-tps-1200-706.gif)

自此，我们便完成了整个案例的完整教学，你也可以直接访问 [kaitian/todo-list](https://code.alipay.com/kaitian/todo-list) 仓库，重新回顾整个模块的实现。
