---
id: create-module
title: Create Module
slug: create-module
order: 2
---

Since the OpenSumi module does not run independently, we recommend that you create your module directory outside the project directory when creating the module. Taking the template repository provided by Quick Start as an example, you can quickly start an IDE project:  

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn					   # Install dependencies  
$ yarn start		       # Start the frontend and backend in parallel
```

You can also directly clone our case project[opensumi/todo-list-sample](https://github.com/opensumi/todo-list-sample) to start Quick module experience. 

## Directory Structure 

Once you have your project in place, you can create a `modules` folder in your project and directory to store module files. The following is the basic directory structure:  

```bash
.
└── workspace                   # Work directory 
├── modules                     # Directory for storing modules
├── extensions                  # extension directory
├── src
│   ├── browser
│   └── node
├── tsconfig.json
├── webpack.browser.config.js
├── webpack.node.config.js
├── package.json
└── README.md
```

## Create Entry Files

In the `modules` directory, we start to create our front and back entry files with the following basic directory structure:  

```bash
.
└── ...
├── modules                     # to store module directory
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

### Front-end Module Entrance

```ts
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

@Injectable()
export class TodoListModule extends BrowserModule {
  providers: Provider[] = [];
}
```

### Back-End Module Entrance

```ts
import { Provider, Injectable } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';

@Injectable()
export class TodoListModule extends NodeModule {
  providers: Provider[] = [];
}
```

### To Introduce Custom Modules

We find the front and back end entry files of the framework and introduce our custom modules separately in `common-modules.ts`.

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

Thus, the creation and introduction of our TodoList module is finished.
