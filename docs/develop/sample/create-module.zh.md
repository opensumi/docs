---
id: create-module
title: 创建模块
slug: create-module
order: 2
---

由于 OpenSumi 模块无法独立运行，在创建模块时，我们推荐你在的工程目录外侧建立你的模块目录，以通过快速开始提供的模板仓库为例，你可以快速启动一个 IDE 工程：

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn					   # 安装依赖
$ yarn start		       # 并行启动前端和后端
```

你也可以直接克隆我们的案例项目 [opensumi/todo-list-sample](https://github.com/opensumi/todo-list-sample) 快速进行模块体验。

## 目录结构

在具备工程后，你就可以在项目根目录创建一个 `modules` 文件夹用于存放模块文件，基础目录结构如下：

```bash
.
└── workspace                   # 工作目录
├── modules                     # 存放模块目录
├── extensions                  # 插件目录
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── webpack.browser.config.js
├── webpack.node.config.js
├── package.json
└── README.md
```

## 创建入口文件

在 `modules` 目录中，我们开始创建我们的前后端入口文件，基本目录结构如下：

```bash
.
└── ...
├── modules                     # 存放模块目录
│   ├── browser
│   │   └── index.ts
│   │   ├── todo.module.less
│   │   └── todo.view.tsx
│   ├── common
│   │   └── index.ts
│   └── node
│   │   └── index.ts
└── ...
```

### 前端模块入口

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [];
}
```

### 后端模块入口

```ts
import { Provider, Injectable } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';

@Injectable()
export class TodoListModule extends NodeModule {
  providers: Provider[] = [];
}
```

### 引入自定义模块

我们找到框架的前后端入口文件，在 `common-modules.ts` 中将我们的自定义模块分别引入。

```ts
export const CommonBrowserModules: ConstructorOf<BrowserModule>[] = [
  ...TodoListModule
];
```

```ts
export const CommonNodeModules: ConstructorOf<NodeModule>[] = [
  ...TodoListModule
];
```

这样，我们就完成了我们 TodoList 模块的创建及引入。
