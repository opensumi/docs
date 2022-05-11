---
id: lifecycle
title: Application Lifecycle
slug: lifecycle
order: 2
---

In[Quick Start](../../integrate/quick-start/web), we instantiate a 'ClientAPP' and call its `start` mode to start OpenSumi.  

```typescript
const app = new ClientAPP(/*..options*/);
app.start();
```

The Start process is simple and perceivable, mainly responsible for the following tasks

- To create the front and back end connections, Websocket will be employed for the Web end, and IPC for the Electron end 
- To initialize ApplicationService to cache some system-level state, such as the OS currently running on the OpenSumi backend  
- execute all [Contribution Points](./contribution-point) 
  - initialize
  - onStart
  - onDidStart
-  Rendering the main screen

In this case, `Contributions` are actually a series of life-cycle methods connected by`ClientAppContribution` in the`Contributions` mechanism, which are invoked at different stages of OpenSumi operation. In addition to the lifecycle methods described above in Start, there are other methods related to closing Windows, connection changes, etc, and this paper will describes these lifecycle and how they are used in detail.  

![lifecycle](https://img.alicdn.com/imgextra/i2/O1CN01qpr3WB1iOcZNLbrcu_!!6000000004403-55-tps-3006-1224.svg)

## initialize

Initialize is the stage that initialize the entire application. Generally, some core functions are initialized in this stage, for example. reading some local caches to quickly instantiate some services after the main screen is rendered. In addition, to speed up the interaction time, the Initialize phase starts the extension process and performs a series of registration operations for extension contribution points.  

## render

<!-- 未发布的版本中 renderApp 会被调整到 initialize 之前，在此之前文档先保持原状 --> 

RenderApp is responsible for rendering the main framework of the entire application. The core is to call the Render mode of ReactDOM to render the main interface. Different from ordinary applications, OpenSumi's view part can be dragged and dropped to change the order and size, and it also supports the contribution of new view interface through integration, extensions, etc.  

> In the next release, renderApp will be reordered before Initialize

## onStart

onStart is executed after the rendering of the main interface; at this time you can access the DOM, loosely speaking you can monitor some events and other operations in the onStart phase. In addition, other functions that are not visible above the fold can also be placed in onStart to delay execution.

## onDidStart

When the entire application is loaded and the core functionality is available (except for extension), the IDE's basic functionalities should be complete.  

## onWillStop

OnStop is also applied to the Electron terminal and is executed after onWillStop when the user confirms that the window can be closed  

## onStop

OnStop is also applied to the Electron terminal and is executed after onWillStop, when the user confirms that the window can be closed  

## onDisposeSideEffects

Similar to the onStop trigger time, but `onDisposeSideEffects` is a special kind of life cycle. When the IDE is taken as a component, it may be possible to uninstall the whole IDE without refreshing the page. At this time, all side effects of the IDE must be made clear. It can be triggered by actively calling the `clientApp.dispose` method.  

## onReconnect

The current connection doesn't work and the module will be triggered automatically after reconnection. After the reconnection, some modules need to be re-initialized (files and cache may be damaged during the disconnection and need to be re-initialized).  
