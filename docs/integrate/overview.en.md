---
id: overview
title: OverView
slug: overview
order: 0
---

<<<<<<< HEAD
OpenSumi framework aims to solve the redundant building problem of IDE product development within Alibaba, endeavours to fulfill IDE customization capabilities in more vertical scenarios, implement the shared underlying layer of Web and local clients, so that IDE development can move from the early "slash-and-burn" era to the "machine-based mass production" era.
=======
OpenSumi framework aims to solve the redundant building problem of IDE product development within Alibaba, to fulfill IDE customization capabilities in more vertical scenarios, and to implement the shared underlying layer of Web and local clients, so that IDE development can move from the early "slash-and-burn" era to the "machine-based mass production" era.
>>>>>>> origin/main

If you are interested in building OpenSumi's framework, welcome to view [How to contribute code](../develop/how-to-contribute) and help build the OpenSumi framework.

## Overall Architecture

<<<<<<< HEAD
To ensure that the framework can run in both `Web` and `Electron` environments, OpenSumi uses a set of project structure that separate the frontend and backend, call each other by a layer of abstract communication.
=======
To ensure that the framework can run in both `Web` and `Electron` environments, OpenSumi uses a set of front and back ends separation, through a layer of abstract communication layer to call each other's project structure.
>>>>>>> origin/main

On `Web`, we use [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket) to communicate.

On `Electron`, we use `IPC` communication.

<<<<<<< HEAD
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
=======
Each communicating connection corresponds to a separate [DI (Dependence Inject)](../develop/basic-design/dependence-injector)container on the front and back ends, so **OpenSumi's backend implementation is stateless** and the different connections are strictly isolated from each other.

There are three core processes within OpenSumi:

- Extension Process（Extension Process）
- Back End Process （Node Process）
- Front End Process（Browser Process）

To ensure that the performance of the IDE will not be affected by extension issues, similar to `VS Code` in terms of extension capability, OpenSumi starts the extension where a separate extension process and the extension process will communicate with frontend process through the backend process.

![OpenSumi Overall Structure](https://img.alicdn.com/imgextra/i2/O1CN01qNPXUm1wbMFgrPieN_!!6000000006326-2-tps-1332-1180.png)

The different implementations of OpenSumi's capabilities are split into different modules, which are implemented through the [Contribution Point](../develop/basic-design/contribution-point), [Dependence Inject](../develop/basic-design/dependence-injector). They have a weak dependency on each other, and some core basic modules, such as theme service and layout service, are also directly dependent by other modules.

**Therefore, it is necessary to ensure the introduction sequence of some modules during the integration development process.**

The overall start-up life cycle is shown in the following diagram:
>>>>>>> origin/main

![Life Cycle](https://img.alicdn.com/imgextra/i4/O1CN01G6C1nf21GoZEzAlJk_!!6000000006958-2-tps-1564-874.png)

## What Is a Module?

<<<<<<< HEAD
A module refers to a package in the `package` directory in [OpenSumi](https://github.com/opensumi/core). It can be published to `npm` and referenced by installing dependencies at integration time.

Typically, a module is a standalone feature implementation, for example, the `debug` module implements a layer of generic debugging adapters based on [DAP](https://microsoft.github.io/debug-adapter-protocol/), core features including debugger front-end and session management. It is provided to extensions to call by means of extension APIs.

The following is the basic structure of a module.
=======
A module is a package in the `package` directory in [OpenSumi](https://github.com/opensumi/core) that can be published to `npm` and referenced by installing dependencies at integration time.

Typically, a module is a standalone feature implementation, e.g. the `debug` module implements a layer of generic debugging adapters based on [DAP](https://microsoft.github.io/debug-adapter-protocol/), core features including debugger front-end, session management, etc. And it is provided to extensions to call by means of a extension API.

The basic structure of a module is as follows
>>>>>>> origin/main

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

<<<<<<< HEAD
> In [OpenSumi](https://github.com/opensumi/core), you can automatically create and associate references by using `yarn run create [module name]`.

Module includes both `Browser` level code and `Node` level code.
=======
> In [OpenSumi](https://github.com/opensumi/core), you can automatically create and associate references by means of `yarn run create [module name]`.

Module includes both `Browser` level code or `Node` level code
>>>>>>> origin/main

- The `browser` layer code is generally used to handle view-related capabilities. Taking `search` module in OpenSumi as an example, the search interface is implemented by the `browser` layer.

- The `node` layer code is generally used to handle the logic that uses `Node.js` capabilities, for example, the global search capability in the search panel is implemented by the `node` layer.

<<<<<<< HEAD
- The `common` layer is generally used to store some public variables, tool methods, type declarations and so on.

### Expand Browser layer Capability

We extend the `Browser` layer capability with the following file structure. You can extend this capability by declaring the relevant content in `providers`. For detailed examples, see [Todo List cases](../develop/sample/overview).
=======
- The `common` layer is generally used to store some public variables, tool methods, type declarations, etc.

### Expand Browser layer Capabilities

We extend the `Browser` layer capabilities with the following file structure. You can extend the capabilities by declaring the relevant content in `providers`. Please refer to our [Todo List cases](../develop/sample/overview)for detailed examples.
>>>>>>> origin/main

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

<<<<<<< HEAD
### Extend Node Layer Capability

We extend the `Node` layer capability with the following file structure. You can extend this capability by declaring the relevant content in `providers`. For detailed examples, see [Todo List case](../develop/sample/overview).
=======
### Extending Node Layer Capabilities

We extend the `Browser` layer capabilities with the following file structure. You can extend the capabilities by declaring the relevant content in `providers`. Please refer to our [Todo List case](../develop/sample/overview) for detailed examples.
>>>>>>> origin/main

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

<<<<<<< HEAD
Extension, is a type of program files supported by OpenSumi framework. By installing extension files on a specific location, the interface and functions of IDE can be re-developed. It is designed to be compatible with the [VSCode Extension API](https://code.visualstudio.com/api), that is, IDE products developed by OpenSumi are naturally compatible with `VSCode` plug-in system.

> We will roll out support for OpenSumi extension development-related R&D process links in the future, so stay tuned.
=======
Extension, is a type of program files supported by the OpenSumi framework. By installing extension files on a specific location, the interface and functions of IDE can be re-developed. It is designed to be compatible with the [VSCode Extension API](https://code.visualstudio.com/api), i.e. IDE products developed by OpenSumi naturally compatible with `VSCode` plug-in system.

> Support for OpenSumi extension development-related R&D process links will be rolled out in the future, so stay tuned.
>>>>>>> origin/main

![Extension](https://img.alicdn.com/imgextra/i3/O1CN01gHphRQ26x18NyYeTz_!!6000000007727-2-tps-1156-800.png)

### How to Release

<<<<<<< HEAD
Due to protocol issues, OpenSumi cannot directly use the VS Code extension market source. By default OpenSumi currently integrates with [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) service developed by Eclipse company. Developers can use directly the service or build their own extension Marketplace based on [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php). Later on, we will also build our own extension marketplace to develop free extension hosting services for more developers.
=======
Due to protocol issues, OpenSumi cannot directly use the VS Code extension market source. Currently OpenSumi integrates with the [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) service developed by Eclipse company by default, which developers can use directly or build their own extension Marketplace based on [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php). Later on, we will also build our own extension marketplace to develop free extension hosting services for more developers.
>>>>>>> origin/main

Reference documentation：[Publishing Extensions](https://github.com/eclipse/openvsx/wiki/Publishing-Extensions)
