---
id: overview
title: How To Start
slug: overview
order: 0
---

> Most standard APIs below VS Code v1.74.0 are currently supported.

OpenSumi plugins are a superset of VS Code plugins, which means that an OpenSumi plugin can include the VS Code plugin system while also supporting OpenSumi's own plugin system, both of which are optional.

You can learn about the related development skills of VS Code plugins through the following documents.

## Useful Documents

- [VS Code Plugin Development Documentation](https://code.visualstudio.com/api)
- [VS Code Plugin Samples](https://github.com/microsoft/vscode-extension-samples)

## Prerequisites

### The First Step for Non-JS Developers

As a reader, you may be proficient in other mainstream languages such as C++, Python, and Java, but you may not be familiar with the language and mode of VS Code and its plugin development based on modern front-end technology.

This chapter refers to the official document mode and gradually introduces you to some programming basics of making plugins, so that you will not be confused when reading the document.

After this chapter, you should be able to read all TypeScript code that appears in the document smoothly and learn the basics of VS Code plugins without obstacles.

However, if you want to achieve a certain level of TypeScript programming proficiency, please refer to the [TypeScript](https://www.typescriptlang.org/).

Of course, this chapter is not necessary for all readers to read.

You can query the corresponding sections according to your preferences or needs. If you have enough experience, you can also skip this chapter.

#### Front-end and Client-side Technology

As we all know, client-side interface technology is a very "antique" technology. Since the birth of the graphics system, various client-side development technologies and modes have emerged one after another, eliminating one batch after another.

On the other hand, web front-end technology is still developing under the support of browsers and network technology. During this period, the browser has been tirelessly optimizing the compiler, and finally raised the JavaScript language to a new height, making the JavaScript language enter the traditional client-side field.

However, as a developer, you must be aware that even with the support of TypeScript, JavaScript is still not a truly static type language.

**Therefore, when using TypeScript, you still need to be cautious and follow the best practices of the community.**

The object we are learning in this tutorial, VS Code, is built on the client-side technology named Electron, which evolved from the open-source project Chromium.

It uses a highly efficient JS compiler and browser interface technology to seamlessly integrate the three programming basics of front-end JavaScript, HTML, and CSS, and integrates system-level programming interfaces.

VS Code further encapsulates and optimizes on this basis, separating the editor process and the plugin process, and highly encapsulating the DOM (Document Object Model) interface, prohibiting users from directly modifying the interface.

We can only develop plugins that comply with the specifications through the mode provided by VS Code. Although these regulations restrict the hands and feet of developers, they bring advantages in security, robustness, and performance.

#### TypeScript and VS Code

TypeScript was initially developed by Microsoft as a programming language based on JavaScript.

It is compatible with all features of JavaScript and extends the type system of JS, making users more comfortable in developing large-scale systems. VS Code naturally supports TypeScript, helping developers write more stable and secure code.

Therefore, all examples in the documentation, including the plugins themselves, are mostly developed using TypeScript.

As the saying goes, "A journey of a thousand miles begins with a single step." When you have enough foundation of plugins, reading the documentation will be smoother.

Since VS Code has disabled CSS and HTML, this chapter will not introduce these contents. Interested readers can refer to the [MDN Document](https://developer.mozilla.org/en-US/docs/Web).

### Understanding TypeScript Variables and Types

TypeScript variables and its type system are essentially the same as JavaScript, but there are a few more things.

For non-JS developers, you may encounter familiar "enumeration" and "tuple" types. Understanding this may make you feel more at ease and learn TS faster, but this does not mean that you can rest assured.

Although TS extends the type ability of JS, it is still a weakly typed language in essence. Please follow the best practices of the community and be cautious when writing code.

For related content learning, please refer to the [TypeScript](https://www.typescriptlang.org/docs/).
