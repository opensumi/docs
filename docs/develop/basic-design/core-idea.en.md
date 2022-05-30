---
id: core-idea
title: Core Idea
slug: core-idea
order: 1
---

OpenSumi is positioned as an `IDE framework`, on which you can build IDE products based on Cloud or Desktop. OpenSumi provides the following capabilities by default:

- Basic functional modules, such as FileTree, Editor, and SCM. 
- Rich customizable features, such as integration and extensions.  
- Compatible with VS Code extension system, supporting mainstream protocols, such as LSP and DAP.

In contrast, OpenSumi does not provide the following capabilities for some ends currently.

- Container/VM management in Cloud IDE 
- Window management in Desktop IDE 

The following is a list of common concepts, terms and explanations you may find in OpenSumi.

## Module

OpenSumi's offerings are NPM packages from different modules. Each package is a **module** and deals with different functions. Modules are generally composed of several parts: frontend, backend, public code and type. The following is a common module structure:

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

In general, modules provide some basic functions. For example, the `search` module performs a full-text search, where the `src/browser` directory includes UI-related code in frontend, while the search is performed by the code under the `src/node` directory.

The frontend communicates with backend via RPC, which is no much difference from calling an asynchronous method, so you don't need to concern about communication details, just refer to the existing pattern to organize the code. You can see [frontend and backend communication](./connection)

None of the `browser/node/common` is a necessity in the module code. Modules that are providing frontend UI or backend functionalities only are allowed. 

A module can provide Contribution to another, and other one in turn can register contribution points based on the `ContributionProvider` declared by that module. The contribution point mechanism is mainly used in scenarios where modules provide registration capabilities to other modules. For example, `main-layout` provides component-level contribution points, while other modules can freely assemble IDE interfaces by registering components with Layout's capabilities, and menu modules provide contribution points for registering menus.

### Module Layer and Dependencies

We divide the modules into` core modules` and` functional modules`. Modules have certain dependency relations. Taking `file-service` as an example, a typical module inclues file reading and writing, file system registration and management. In many functional modules, to read and write operations will depend on `file-service`.  
 
Core modules are mandatory that make up the core functionality of the IDE and cannot be removed. For example, `main-layout` is responsible for the overall layout of the main interface and view registration, `core-browser` and `core-node` are responsible for maintaining the declaration cycle of IDE ClientApp and ServerApp instances and related contribution point management.

Functional modules are generally pluggable, which means that they can be removed from the integration code or replaced without affecting other functions. However, the removal of some modules with extension API will lead the extension malfunctioning, because `Extension` relies on most of the functional modules to provide APIs. The following modules are the currently pluggable:

- Outline
- File-search
- Terminal-next
- Comments
- Opened-editor
- Toolbar

## Dependency Injection

By a self-developed DI framework `@opensumi/di`, OpenSumi manages and acquires instances among these modules, and the dependency abstraction interface convention allows us to easily overlap part of the service or even the module implementation to improve extensibility. For more details on the usage of `@opensumi/di`, see [Dependency Injection](./dependence-injector), or visit the source code at [opensumi/di](https://github.com/opensumi/di).

## Extension and API

As mentioned before, many of OpenSumi's functional modules are pluggable, and those that cannot be plugged is because they provide extension APIs (in other words, they can be pluggable after the Extension module is removed). OpenSumi extension system is based on the extension of VS Code, which can be regarded as a superset of VS Code extensions. For detailed introduction of the extension system, see [Extension Mechanism](./extension-mechanism).

The OpenSumi extension is similar to the VS Code extensions. We will keep its compatibility with the VS Code extension API, and constantly update and iterate the extension API. The extension API is a collection of objects, such as methods and classes, offered to third-party code to call . Extension modules contains all extensions and extension API-related implementations, but when it comes to a certain extension API, the ultimately called module is the one implemented them. For example, `terminal-next` module offers `sumi.window.createTerminal` capability, while the extension just takes its package for the plug-in to call.


