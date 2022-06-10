---
id: lifecycle
title: Application Lifecycle
slug: lifecycle
order: 2
---

In [Quick Start](../../integrate/quick-start/web), we create an instance of a `ClientAPP` and call its `start` mode to enable OpenSumi.  

```typescript
const app = new ClientAPP(/*..options*/);
app.start();
```

The Start process is simple and perceivable, mainly responsible for the following tasks：

- to create the frontend and backend connections, Websocket will be employed for the Web end, and IPC for the Electron end 
- to initialize ApplicationService to cache some system-level state, such as the OS currently running on the OpenSumi backend  
- to execute all [Contribution Points](./contribution-point) 
  - initialize
  - onStart
  - onDidStart
-  to Render the main screen

In this case, `Contributions` are actually a series of life-cycle methods connected by `ClientAppContribution` in the`Contributions` mechanism. They are invoked in different stages of OpenSumi operation. In addition to the lifecycle methods described above in Start, there are other ways including closing Windows and connecting changes. This section will introduces these lifecycle and how they are used in detail.  

![lifecycle](https://img.alicdn.com/imgextra/i2/O1CN01qpr3WB1iOcZNLbrcu_!!6000000004403-55-tps-3006-1224.svg)

## initialize

Initialize is the stage that initializes the entire application. Generally, some core functions are initialized in this stage. For example, read some local caches to quickly create an instance of some services after the main screen is rendered. In addition, to speed up the interaction time, the initialize phase starts the extension process and performs a series of registration operations for extension contribution points.  

## render

In this part, renderApp is responsible for rendering the main framework of the whole application. The core is to call the render mode of ReactDOM to render the main interface. Different from typical applications, OpenSumi's view part can be dragged and dropped to change the order and size, and it also creates new view interface based on integration and extension methods.  

> In the next release, renderApp will be reordered before initialize phase.

## onStart

onStart is executed after the rendering of main interface; at this time you can access the DOM, loosely speaking you can monitor some events and other operations in the onStart phase. In addition, other functions that are not visible above the fold can also be placed in onStart to delay execution.

## onDidStart

When the entire application is loaded and the core functions are available (except extensions), the IDE's basic functionalities should be adequate.  

## onWillStop

OnWillStop mainly acts on the Electron terminal to perform some collection and confirmation actions before the window is about to close. For example, if there is an unsaved file, the pop-up window asks the user whether to save the file before close it. 

## onStop

OnStop is also applied to the Electron terminal and is executed after onWillStop, when the user confirms that the window can be closed  

## onDisposeSideEffects

Similar to the onStop trigger mechanism, but `onDisposeSideEffects` is a special kind of life cycle. When the IDE is taken as a component, it may be possible to uninstall the whole IDE without refreshing the page. At this time, all side effects of the IDE must be made clear. It can be triggered by calling the `clientApp.dispose` method actively.  

## onReconnect

The current connection doesn't work and the module will be triggered automatically after reconnecting it. After reconnection, some modules need to be re-initialized (files and cache may be damaged during the disconnection phase and need to be re-initialized).  
