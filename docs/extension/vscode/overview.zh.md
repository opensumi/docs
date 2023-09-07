---
id: overview
title: 如何开始
slug: overview
order: 0
---

> 当前已支持 VS Code 1.74.0 以下的大部分标准 API

OpenSumi 插件是 VS Code 插件的一个超集，这意味着一个 OpenSumi 插件即可以包含 VS Code 插件体系，同时还支持 OpenSumi 自有的插件体系，它们都是可选的。

你可以通过下面的一些文档了解 VS Code 插件的相关开发技巧

## 相关资料

- [VS Code 插件开发文档](https://code.visualstudio.com/api)
- [VS Code 插件开发文档（汉化）](https://github.com/Liiked/VS-Code-Extension-Doc-ZH)
- [VS Code 插件示例](https://github.com/microsoft/vscode-extension-samples)

## 预备知识

### 非 JS 开发者的第一步

本章节并不是官方教程的一部分，作为读者的你可能擅长于 C++，Python，Java 等其他主流语言，而并不了解基于现代前端技术构建的 VS Code 和他的插件开发语言和模式。

本章参考了官方文档模式，循序渐进地带你了解制作插件的一些编程基础，以免你在阅读文档时晕头转向，本章结束之后，你应该能比较顺利地阅读文档中出现的所有 TypeScript 代码，没有障碍地学习 VS Code 插件基础，但是如果你希望达到一定程度的 TypeScript 编程水平，请参考 [TypeScript 汉化版文档](https://www.tslang.cn/)。

当然，本章并不是所有读者必须阅读的，你可以按照自己的喜好或者需要，查询对应的小节，如果你有足够的经验也完全可以跳过本章。

#### 前端和客户端技术

众所周知，客户端界面技术已是一门非常“老古董”的技术了，从图形系统诞生至今，各类客户端开发技术和模式你方唱罢我登场，淘汰了一批又一批。而 Web 前端技术，在浏览器和网络技术的依托之下还在不断发展，在这期间浏览器对编译器孜孜不倦的优化，终于将 JavaScript 语言提升到了一个新的高度，使 JavaScript 语言进入了传统客户端领域，但是作为开发者必须意识到，即使是在 TypeScript 的加持下，JavaScript 也并没有变成一门真正的静态类型语言，**因此你在使用 TypeScript 的时候依旧需要谨慎行事并遵守社区的最佳实践**。

我们教程学习的对象 VS Code，便是建立在浏览器开源项目 Chromium 演化而来——名为 Electron 的客户端技术之上，它使用了性能极高的 JS 编译器和浏览器界面技术，**将前端的三大编程基础 JavaScript，HTML，CSS 无缝地衔接进来，并融合了系统层级的编程接口**。

而 VS Code 在此之上进一步封装和优化，将编辑器进程和插件进程独立开来，同时高度封装 DOM（文档对象模型）接口，禁止用户直接修改界面，我们只能通过 VS Code 提供的模式去开发符合规范的插件，虽然这些规定限制了开发者的手脚，但是更带来了安全、稳健、性能上的优势。

#### TypeScript 和 VS Code

TypeScript 起初是微软开发的以 JavaScript 为基础的编程语言，他兼容 JavaScript 的所有特性，并扩展了 JS 的类型系统，使得用户在大型系统开发中更加游刃有余。

VS Code 天然支持 TypeScript，帮助开发者写出更加稳定、安全的代码。因此所有文档的示例，包括插件本身，绝大部分都是使用 TypeScript 开发的，俗话说“不积跬步无以至千里”，当你足够了插件的基础之后，阅读文档才会更加顺利。

由于 VS Code 已经禁用了 CSS 和 HTML，因此本章不会介绍这些内容，有兴趣的读者可参阅 [MDN 相关文档](https://developer.mozilla.org/zh-CN/docs/Web)。

### 认识 TypeScript 的变量和类型

TypeScript 变量以及它的类型系统，它本质上和 JavaScript 是一样的，不过东西会更多一点，对于非 js 开发者来说，你可能会遇到熟悉的“枚举”、“元组”类型，了解了这点，或许能让你安心并更快地掌握 TS，但是这并不意味着你就可以高枕无忧了，虽然 TS 扩展了 JS 的类型能力，但它本质上依旧是一门弱类型语言，请在书写代码时遵循社区的最佳实践并保持谨慎。

相关内容学习可见：[TypeScript 汉化版文档](https://www.tslang.cn/docs/home.html)。
