---
id: extension-mechanism
title: Extension Mechanism
slug: extension-mechanism
order: 3
---

OpenSumi extension system is a superset of VS Code extensions. In addition to official VS Code APIs, we also have extended some API extensions of our own, including frontend and WebWorker extensions. This section mainly introduces the basic principle and API implementation process of OpenSumi extensions.  

## Basic Principle

![OpenSumi Extension](https://img.alicdn.com/imgextra/i4/O1CN01anYrzq1Kcm1vW2Vkk_!!6000000001185-2-tps-2220-1485.png)

The preceding figure illustrates that the whole extension system involves four environments: frontend UI, Web Worker, backend main process and extension process.

The OpenSumi extension gets three entrances: `main`, `browserMain` and `workerMain`. All of them are optional. `Main` is the extension that is running in the independent Node.js process as shown above, its APIs remain fully compatible with VS Code. We can start from the main entry of the extension process step by step to introduce the principle of the whole extension system.  

### Extension Process (Extension Node Host)

If you have heard of VS Code's extension system, you will know that the VS Code plugin process is completely independent from the main process. The same is true of OpenSumi's extension process. As the extension process itself is a completely isolated subprocess from the main process, they communicate by Node.js's IPC.

![](https://img.alicdn.com/imgextra/i3/O1CN01ttWp3E1dludC7Qkt5_!!6000000003777-2-tps-1723-726.png)

Because all extensions run in the same process, they are accessible to each other and inherit from VS Code's design. For example, you can call `sumi.extensions.getExtension` or `sumi.extensions.all` to get other extension instances, or even call other APIs exposed by rest extensions. All of these are permitted.  

### Web Worker Extension Process (Extension Worker Host)

The Web Worker extension environment mentioned above can be seen as a low-profile version of Extension Node Host. This is because at the beginning of the design, the Web Worker extension thread is only used to undertake some dense computational tasks without reference to Node.js. Its architecture diagram is basically the same as Extension Node Host, but some APIs that strongly depend on Node.js are removed, for example, FS, Terminal, Task and Debug.  

### Browser Extension

The Browser extension is exclusive to OpenSumi, which is the biggest difference from VS Code. The Browser extension declares the register point by `Contributes`, exporting related React component into the code. Contributes Point is fixed, including left, right and bottom panels, as well as Toolbar.  

## Extension API

### API in Node Environment 

The `main` and `sumiContributes#nodeMain` entry declared in `package.json` are the Node.js environment for extensions, which get access to the OpenSumi Node environment's APIs.
Calling `import * as sumi from 'sumi'` or `const sumi = require('sumi')` in the extension will grant you the access to the extension APIs, and those APIs are distinguished by different namespace based on their functionality. Importing `sumi` here will grant you the access to the API of VS Code and OpenSumi, while you can only use VS Code standard API if `import vscode from 'vscode'`.

### API in the Worker Environment

The `package.json` declares that the entry of `sumiContributes#workerMain` is the Worker environment for extensions, which can access the API in the OpenSumi Worker environment.  

The Worker API supports both `sumi-worker`and `sumi` module names. This is because many Worker extensions migrate from the Node version, keeping the module name `sumi` compatible with such extensions.  

The Worker API is a subset of the Node side APIs, basically every APIs can run in the Worker, except those related to FS, ChildProcess and Terminal.

### API in Browser Environment

The `package.json` declares that the entry of `sumiContributes#workerMain` is the Browser environment for extensions, which can access the API in the OpenSumi Browser environment. The Browser environment provides fewer APIs, which can be called by referring to `sumi-browser`. At its core, `executeCommand` is provided to execute commands. The commands here can be called across processes, such as those registered in Node/Worker. The Browser environment is designed solely for view rendering. It's better to perform some complex business logic in Node/Worker environment.
