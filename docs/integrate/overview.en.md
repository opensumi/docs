---
id: overview
title: OverView
slug: overview
order: 0
---

OpenSumi framework aims to solve the redundant building problem of IDE product development within Alibaba, endeavours to fulfill IDE customization capabilities in more vertical scenarios, implement the shared underlying layer of Web and local clients, so that IDE development can move from the early "slash-and-burn" era to the "machine-based mass production" era.

If you are interested in building OpenSumi's framework, welcome to view [How to contribute code](../develop/how-to-contribute) and help build the OpenSumi framework.

## Overall Architecture

To ensure that the framework can run in both `Web` and `Electron` environments, OpenSumi uses a set of project structure that separate the frontend and backend, call each other by a layer of abstract communication.

On `Web`, we use [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) to communicate.

On `Electron`, we use `IPC` communication.

Each communicating connection corresponds to a separate [DI (Dependence Inject)](../develop/basic-design/dependence-injector)container on the front and back ends, so **OpenSumi's backend implementation is stateless** and different connections are strictly isolated from each other.

There are three core processes within OpenSumi:

- Extension process（Extension Process）
- Backend process （Node Process）
- Frontend process（Browser Process）
 
To ensure that extension problems do not affect IDE performance, OpenSumi uses a similar solution in terms of extension capabilities: similar to `VS Code`, the extension is enabled by a separate extension process, and the extension process communicates with the frontend process by the backend process.

![OpenSumi Overall Structure](https://img.alicdn.com/imgextra/i2/O1CN01qNPXUm1wbMFgrPieN_!!6000000006326-2-tps-1332-1180.png)

The different capability implementations of OpenSumi are split into different modules. The modules have a weak dependency on each other by using [Contribution Point](../develop/basic-design/contribution-point) and [Dependence Inject](../develop/basic-design/dependence-injector). Some core basic modules, such as theme service and layout service, are also directly dependent by other modules.

**Therefore, it is necessary to ensure the introduction sequence of some modules during the integration development process.**

The overall start-up life cycle is shown in the following diagram.

![Life Cycle](https://img.alicdn.com/imgextra/i4/O1CN01G6C1nf21GoZEzAlJk_!!6000000006958-2-tps-1564-874.png)

## What Is a Module?

A module refers to a package in the `package` directory in [OpenSumi](https://github.com/opensumi/core). It can be published to `npm` and referenced by installing dependencies at integration time.

Typically, a module is a standalone feature implementation, for example, the `debug` module implements a layer of generic debugging adapters based on [DAP](https://microsoft.github.io/debug-adapter-protocol/), core features including debugger front-end and session management. It is provided to extensions to call by means of extension APIs.

The following is the basic structure of a module.

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

> In [OpenSumi](https://github.com/opensumi/core), you can automatically create and associate references by using `yarn run create [module name]`.

Module includes both `Browser` level code and `Node` level code.

- The `browser` layer code is generally used to handle view-related capabilities. Taking `search` module in OpenSumi as an example, the search interface is implemented by the `browser` layer.

- The `node` layer code is generally used to handle the logic that uses `Node.js` capabilities, for example, the global search capability in the search panel is implemented by the `node` layer.

- The `common` layer is generally used to store some public variables, tool methods, type declarations and so on.

### Expand Browser layer Capability

We extend the `Browser` layer capability with the following file structure. You can extend this capability by declaring the relevant content in `providers`. For detailed examples, see [Todo List cases](../develop/sample/overview).

```javascript
// Browser module entry
import { Provider, Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { HelloWorld } from './hello-world.view';

@Injectable()
export class ModuleDemoModule extends BrowserModule {
  providers: Provider[] = [];
}
```

### Extend Node Layer Capability

We extend the `Node` layer capability with the following file structure. You can extend this capability by declaring the relevant content in `providers`. For detailed examples, see [Todo List case](../develop/sample/overview).

```javascript
// Node module entry
import { Provider, Injectable } from '@opensumi/di';
import { NodeModule } from '@opensumi/ide-core-node';

@Injectable()
export class ModuleDemoModule extends NodeModule {
  providers: Provider[] = [];
}
```

## What Is an Extension？

Extension, is a type of program files supported by OpenSumi framework. By installing extension files on a specific location, the interface and functions of IDE can be re-developed. It is designed to be compatible with the [VSCode Extension API](https://code.visualstudio.com/api), that is, IDE products developed by OpenSumi are naturally compatible with `VSCode` plug-in system.

> We will roll out support for OpenSumi extension development-related R&D process links in the future, so stay tuned.

![Extension](https://img.alicdn.com/imgextra/i3/O1CN01gHphRQ26x18NyYeTz_!!6000000007727-2-tps-1156-800.png)

### How to Release

Due to protocol issues, OpenSumi cannot directly use the VS Code extension market source. By default OpenSumi currently integrates with [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) service developed by Eclipse company. Developers can use directly the service or build their own extension Marketplace based on [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php). Later on, we will also build our own extension marketplace to develop free extension hosting services for more developers.

Reference documentation：[Publishing Extensions](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
