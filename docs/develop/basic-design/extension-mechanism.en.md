---
id: extension-mechanism
title: Extension Mechanism
slug: extension-mechanism
order: 3
---

OpenSumi extension system is a superset of VS Code extensions. In addition to official VS Code APIs, we also have extended some API extensions of our own, including frontend, WebWorker extensions, etc. This article mainly introduces the basic principle and API implementation process of OpenSumi extensions.  

## Basic Principle

![OpenSumi Extension](https://img.alicdn.com/imgextra/i4/O1CN01anYrzq1Kcm1vW2Vkk_!!6000000001185-2-tps-2220-1485.png)

As shown in the figure, the whole extension system involves four environments: front-end UI, Web Worker, back-end main process, and extension process.

The OpenSumi extension has three entrances: `main` , `browserMain` and `workerMain`. All of them are optional. `Main` is the extension running in the independent Node.js process as shown above, its API remain fully compatible with VS Code. Let's start from the main entrance of the extension process step by step to introduce the principle of the whole extension system.  

### Extension Process (Extension Node Host)

If you know about VS Code's extension system, you will know that the VS Code plugin process is completely independent of the main process. The same is true of OpenSumi's extension process, as the extension process itself is a completely isolated sub process from the main process：they communicate though Node.js's IPC.

![](https://img.alicdn.com/imgextra/i3/O1CN01ttWp3E1dludC7Qkt5_!!6000000003777-2-tps-1723-726.png)

Extensions, since they all run in the same process, are accessible to each other, also inherited from VS Code's design. For example, when calling the `sumi.extensions.getExtension` or `sumi.extensions.all`, or even other APIs exposed by rest extensions, we can fetch other extension instances, all of these are allowed.  

### Web Worker Extension Process (Extension Worker Host)

The Web Worker extension environment mentioned above can be seen as a low-profile version of Extension Node Host<!--or subset?  Lite version? -->. This is because at the beginning of the design, the Web Worker extension thread is only used to undertake some dense computational tasks without reference to Node.js. Its architecture diagram is basically the same as Extension Node Host, but some APIs that strongly depend on Node.js are removed, for example, FS, Terminal, Task, and Debug.  

### Browser Extensions

The Browser extension is unique to OpenSumi, which is the biggest difference from VS Code. The Browser extension declares the register point by `Contributes`, exporting related React component into the code. Contributes Point is fixed, including left, right, and bottom panels, as well as Toolbar.  

## Extension API

### API in Node Environment 

The `main` and `sumiContributes#nodeMain` entry declared in `package.json` are the extension's Node.js environment, which has access to the OpenSumi Node environment's APIs.
Calling `import * as sumi from 'sumi'` or `const sumi = require('sumi')` in the extension will grant you the access to the extension APIs, and those APIs are distinguished by different namespace based on their functionality. Here importing `sumi` will access to the VS Code + OpenSumi API, while using `import vscode from 'vscode'` will only give access to the VS Code standard API.

### API in the Worker Environment 

The `package.json` declares that the entrance of `sumiContributes#workerMain` is the extension Worker environment, which can access the API in the OpenSumi Worker environment.  

The Worker API supports both `sumi-worker`and `sumi` module names. This is because many Worker extensions migrate from the Node version, leaving the `sumi` module name incompatible with such extensions.  

The Worker API is a subset of the Node side APIs, basically every APIs except those related to FS, ChildProcess, and Terminal can run in the Worker.

### API in Browser Environment

The `package.json` declares that the entrance of `sumiContributes#workerMain` is the extension Worker environment, which can access the API in the OpenSumi Worker environment. 
The Browser environment provides fewer APIs, which can be called by referring to  `sumi-browser`. At its core, 'executeCommand' is provided to execute commands. The latter can be called across processes, such as commands registered in Node/Worker. The Browser environment is designed solely for view rendering. It's better to perform some complex business logic in Node/Worker environment.
