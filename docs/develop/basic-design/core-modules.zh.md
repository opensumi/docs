---
id: core-modules
title: 核心模块
slug: core-modules
order: 6
---

OpenSumi 的仓库代码是通过 [Monorepo](https://www.perforce.com/blog/vcs/what-monorepo) 的形式组织的，`packages` 目录下的都是 OpenSumi 内置模块，截止 `2.8.0` 版本，OpenSumi 代码仓库中一共有 53 个模块，它们有些是完全独立可插拔的功能，而有些则是提供核心功能的模块。也有一部分由于早期的设计不适用于目前的架构，所以可能在未来的某个时期被移除或者合并到其他模块。

## 核心模块介绍

OpenSumi 有几十个模块，但我们开发过程中并不是每个模块都要接触的，一般情况下我们需要对以下模块有一定的了解。

### Core Browser

core-browser 定位是对 OpenSumi 前端部分的运行时管理，包括前端的 `ClientApp` 以及 `Contribution` 机制，另外 core-browser 还负责初始化与后端的 RPC 连接，**不可被热插拔**。

### Core Node

与 core-browser 类似，core-node 定位对 OpenSumi 后端部分的运行时管理，包括了 `ServerApp` 以及后端的 `Contribution` 机制，同样它**不可被热插拔**。

### Monaco

monaco 模块主要作用是将 Monaco Editor 的 API 重新组织并导出，因为 OpenSumi 一些编辑器功能依赖 Monaco Editor 的私有 API，所以 monaco 模块中的一些 API 会经过重新组织后导出，以供其他模块使用。除此之外，monaco 模块也提供了一些 `Contribution Point` ，其他模块可以注册并实现、覆盖一些内置的 Service。monaco 模块**不可被热插拔**。

### File Service

file-service 是内置的文件服务实现，大部分情况下我们都是基于原生的文件系统，而 file-service 就是默认实现，除此之外，OpenSumi 也支持通过自定义 file-service 的方式来实现其他文件系统，例如 MemoryFS、BrowserFS 等。

### File Tree Next

文件树的默认实现，依赖 file-service 来进行文件树的读取、列表展示等功能。除此之外，file tree 会读取来自 decorations 模块注册的「装饰」来显示文件的状态，例如在 Git 中该文件是否修改等。

### Terminal Next

终端功能的实现，包含前端渲染部分与后端的 Shell 进程管理。终端模块提供了独立的 `TerminalNetworkContribution` 贡献点，支持通过自定义外部的网络通道(WebSocket/Socket)来与后端 Shell 进程连接。同时它还提供了 VS Code Terminal 相关 API。

### OpenSumi Extension

extension 是 OpenSumi 核心的插件系统实现，包括了前端视图插件、Node/VS Code 插件进程环境、WebWorker 插件环境等。同时也包含了所有 OpenSumi 以及兼容的 VS Code 插件 API 实现，extension 依赖了大部分功能模块，同时它可以被直接移除(但也会失去所有插件功能)。

### Extension Manager

extension-manager 主要负责插件的安装、管理、启/禁用等功能，并且支持自定义的源。比较特殊的是，extension-manager 是唯一可以直接依赖 extension 的模块，因为安装、启用插件后需要同步插件状态并激活插件。

## 模块分层

虽然 OpenSumi 使用 Monorepo 组织代码结构，每个模块之间的「代码」关系看上去都是扁平的，但实际上模块之间的逻辑关系是分层的，例如前面提到的 `core-browser` 、`core-node`、`file-service`、`connection`、`monaco` 等模块在大部分情况下是必不可少的，我们可以将其看作`底层模块`，他们无法被安全的移除或「热插拔」。而对于像 `opened-editor`、`markdown`、`search` 等模块，他们的职责比较单一，仅提供部分视图及功能，移除它们不会对 OpenSumi 本身产生破坏性影响，我们称之为 `功能模块`。

判断一个模块是否属于`底层模块`或`核心模块`的一个重要依据就是其是否能被安全的移除。如果我们接收「没有插件功能」，那么实际上 `extension` 也可以作为功能模块，这样其依赖的大多数功能模块都可以被安全的移除。

## 模块列表及概述

```bash
.
├── addons                        # 用于依赖一些模块来实现可能包含副作用的功能，例如监听 file-tree 的拖放事件，并调用 file-service 的 API 来写入文件等
├── comments                      # 用于实现内置的 Code Review 评论功能，提供了标准的 VS Code Comments API 实现
├── components                    # OpenSumi 各个模块共用的一系列基础组件
├── connection                    # 用于实现 Web 及 Electron 端的底层 RPC 框架以及对应的连接管理
├── core-browser                  # Web 端功能的核心框架，包括整个 OpenSumi 的 ClientApp 及生命周期实现
├── core-common                   # 包含了一些基础类型，例如可能被许多模块依赖的内置 Contribution
├── core-electron-main            # 包含了 Electron 端主进程的相关基础功能
├── core-node                     # Node 端功能的核心框架，包括 OpenSumi 的 ServerApp 及生命周期实现
├── debug                         # Debugger 功能模块，实现了标准的 Debug Adapter Protocol 接口，并提供对应的 VS Code API 实现
├── decoration                    # 用于管理和注册除编辑器之外的一些装饰，例如文件树视图中对于 Git 状态的装饰
├── editor                        # 对 Monaco Editor 的上层封装模块，提供了包括编辑器、编辑器组操作及相关管理功能
├── electron-basic                # Electron 端的基础定制功能，包含了例如 Welcome 界面的基础实现
├── explorer                      # 用于为 FileTree 提供基础的视图容器，待废弃
├── express-file-server           # OpenSumi 内置的静态资源服务器，主要提供例如插件资源读取等功能
├── extension-manager             # 内置的插件安装、管理等功能
├── extension-storage             # 用于管理插件相关的存储，提供了 Storage 相关的 VS Code API
├── file-scheme                   # 提供对 file:// 协议的文件处理操作，例如前端使用何种视图来展示文件，以及后端如何进行文件保存等操作
├── file-search                   # 文件搜索服务，基于 vscode-ripgrep 实现的文件搜索(非内容)
├── file-service                  # 文件服务的抽象，集成时可以注册自定义的文件处理服务，并且内置了基于原生 FS 的文件服务
├── file-tree-next                # 文件树实现
├── i18n                          # 内置的 i18n 功能及语言包
├── extension             # OpenSumi 的插件系统实现，包括插件运行时及插件 API 实现
├── keymaps                       # 快捷键功能实现
├── logs-core                     # 内置的 logger 实现
├── main-layout                   # OpenSumi 主界面的框架实现，可以基于 Layout 做高自由度的定制
├── markdown                      # 内置的 Markdown 文件预览功能
├── markers                       # 问题面板实现，基于 LSP 提供的诊断信息并应用到编辑器，提供了标准的 VS Code Diagnostic API 实现
├── menu-bar                      # 内置的菜单栏实现，在 Web 端使用基于 DOM 的菜单，而 Electron 端使用原生菜单
├── monaco                        # 对于 Monaco Editor 的引用及包装，提供了 Contribution，以便其他模块(Editor)注册或覆盖一些内置的 Service
├── monaco-enhance                # 基于 Monaco 的一些上层封装，提供了一些基础的 ZoneWidget、OverlayWidget 等小组件
├── opened-editor                 # 「打开的编辑器」功能实现
├── outline                       # 「大纲」功能实现，基于 LSP 的符号接口，提供了基于 TreeView 的符号跳转等功能
├── output                        # 输出功能实现，并提供标准的 VS Code Output API
├── overlay                       # OpenSumi 内置的浮层功能实现，例如 message、notification、modal 等
├── preferences                   # 设置面板及功能的实现
├── process                       # 提供便捷的子进程管理功能，是一个 Utils 模块
├── quick-open                    # 快速打开功能实现，OpenSumi 的快速打开使用独立的实现，与 Monaco Editor 自带的功能类似
├── scm                           # Source Control 功能抽象接口，并提供了标准的 VS Code SCM API，例如 Git 插件就是基于 SCM 提供的接口实现的
├── search                        # 跨文件文本搜索功能实现
├── startup                       # 示例模块，开发状态下可以基于 startup 模块来启动 OpenSumi
├── status-bar                    # 状态栏功能实现，并提供标准的 VS Code StatusBar API
├── storage                       # 存储功能实现，主要维护 OpenSumi 内的各种缓存读写
├── task                          # 任务功能实现，并提供标准的 VS Code Task API
├── terminal-next                 # 终端功能实现，并提供标准的 VS Code Terminal API
├── theme                         # 颜色主题与图标主题功能实现，兼容 VS Code 图标、颜色主题，提供标准的 VS Code Theme 相关 ContributionPoint
├── toolbar                       # 工具栏功能实现，提供 OpenSumi 扩展的 Toolbar 相关 API
├── types                         # OpenSumi 插件类型声明模块，包含 OpenSumi 兼容的全部 VS Code API 类型声明
├── userstorage                   # 用户缓存功能实现
├── variable                      # 提供运行时各种「魔法变量」的管理与实现，例如在 Task 功能的配置文件中 tasks.json 中，可以通过 ${WorkspaceFolder} 来获取到当前的工作目录
├── webview                       # Webview 功能实现，包含多种 Webview 组件及能力，提供了标准的 VS Code Webview API
├── workspace                     # 工作区功能实现，用于管理当前 OpenSumi 打开的工作区，并支持多工作区功能
└── workspace-edit                # 封装了工作区级别的编辑，例如撤销一个重命名时，需要同时调用 WorkspaceEdit 相关功能实现文件级别的撤销
```
