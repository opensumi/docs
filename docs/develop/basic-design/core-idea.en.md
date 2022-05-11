---
id: core-idea
title: Core Idea
slug: core-idea
order: 1
---

OpenSumi is positioned as an `IDE framework`, on which you can build IDE products based on Cloud or Desktop. OpenSumi provides the following capabilities by default:

- Basic functional modules, such as FileTree, Editor, SCM, etc. 
- Rich customizable features, such as integration, extensions, etc.  
- Compatible with VS Code plug-in system, supporting mainstream protocols such as LSP and DAP

In contrast, OpenSumi does not provide the following capabilities for some ends currently 

- Container/VM management in Cloud IDE 
- Window management in Desktop IDE 

Below is a list of some common concepts, terms and explanations you may find in OpenSumi

## Module

OpenSumi's offerings are NPM packages from different modules. Each package is a **module**, and deals with different functions. Modules are generally composed of several parts: frontend, backend, public code and type. A common module structure is as follows:

```bash
.
├── README.md
├── __tests__
│   ├── browser
│   ├── common
│   ├── node
├── package.json
├── src
│   ├── browser
│   ├── common
│   ├── index.ts
│   └── node
└── webpack.config.js
```

### Responsibilities of the Module 

In general, modules provide some basic functions. For example, the `search` module can perform a full-text search, where the `src/browser` directory includes UI-related code in front-end, while the search is performed by the code under the `src/node` directory.一般意义上模块可以提供一些基础功能，例如 `search` 模块提供了全文搜索功能，在该模块的 `src/browser` 目录下包含了前端 UI 相关的代码，而执行搜索的则是 `src/node` 目录下的代码。


The front end communicates with the back via RPC, which is not too different from calling an asynchronous method, so you don't need to concern about communication details, just refer to the existing pattern to organize the code. You can refer to [front-end and back-end communication](./connection)

Neither `browser/node/common` is a necessity in the module code, and module providing front-end UI or back-end functionalities only are allowed. 

A module can provide Contribution to another, and other one in turn can register contribution points based on the `ContributionProvider` declared by that module. The contribution point mechanism is mainly used in scenarios where modules provide registration capabilities to other modules. For example, `main-layout` provides component-level contribution points, while other modules can freely assemble IDE interfaces by registering components with Layout's capabilities, and menu modules provide contribution points for registering menus.

### Module Layer and Dependencies

We divide the modules into` core modules` and` functional modules` . They have certain dependency relations. A typical module, taking `file-service` as an example, is responsible for file reading and writing, file system registration and management, etc. In many functional modules, read and write operations will depend on `file-service`.  
 
Core modules are some mandatory modules that make up the core functionality of the IDE and cannot be removed. For example, `main-layout` is responsible for the overall layout of the main interface and view registration, `core-browser` and `core-node` are responsible for maintaining the declaration cycle of IDE ClientApp and ServerApp instances and related contribution point management.

Functional modules are generally pluggable, which means that they can be removed from the integration code or replaced without affecting other functions. However, the removal of some modules with extension API will lead the extension malfunctioning, since `Extension` relies on most of the functional modules to provide APIs. The following modules are the currently pluggable:

- Outline
- File-search
- Terminal-next
- Comments
- Opened-editor
- Toolbar

## Dependency Injection

By a self-developed DI framework `@opensumi/di`, OpenSumi manages and acquires instances among these modules, and the dependency abstraction interface convention allows us to easily overlap part of the service or even the module implementation to improve extensibility.

For more details on the usage of `@opensumi/di`, please refer to the document [Dependency Injection](./dependence-injector), or visit the source code at [opensumi/di](https://github.com/opensumi/di).

## Extension and API

As mentioned before, many of OpenSumi's functional modules are pluggable, and those that cannot be plugged are because they provide extension APIs (in other words, they can be pluggable after the Extension module is removed). OpenSumi's extension system is based on the extension of VS Code, which can be regarded as a superset of VS Code extensions. For detailed introduction of the extension system, please refer to [Extension Mechanism](./extension-mechanism).

The OpenSumi extension is similar to the VS Code extensions. We will keep its compatibility with the VS Code extension API, and constantly update and iterate the extension API. The extension API is a collection of objects, such as methods, classes, etc., available for third-party code to call. Extension modules includes all extensions and extension API-related implementations, but when it comes to a certain extension API, the ultimately called module is the one implemented them. For instance, the `sumi.window.createTerminal` capability is provided by the ` terminal-next` module, while the extension just takes its package for the extension to call.
