---
id: lifecycle
title: Application Lifecycle
slug: lifecycle
order: 2
---

在 [快速开始](../../integrate/quick-start/web) 中，我们实例化了一个 `ClientAPP` ，调用其 `start` 方法即可启动 OpenSumi。

```typescript
const app = new ClientAPP(/*..options*/);
app.start();
```

start 方法的流程比较简单直观，它主要负责一下工作

- 创建前后端连接，对于 Web ，将使用 Websocket，对于 Electron 端，则使用 IPC 通信
- 初始化 ApplicationService, 用于缓存一些系统级的状态，如当前 OpenSumi 后端运行的 OS 等
- 执行所有的 [贡献点](./contribution-point)
  - initialize
  - onStart
  - onDidStart
- 渲染主界面

这里的 `Contributions` 实际上就是一系列的生命周期方法，它们通过 `Contributions` 机制中的 `ClientAppContribution` 串联起来，会在 OpenSumi 运行过程中不同阶段调用。除了上述 start 中的生命周期方法之外，还有关闭窗口、连接变化等相关的方法，本文会详细介绍这些生命周期以及其使用方式。

![lifecycle](https://img.alicdn.com/imgextra/i2/O1CN01qpr3WB1iOcZNLbrcu_!!6000000004403-55-tps-3006-1224.svg)

## initialize

initialize 是初始化整个应用的阶段，一般来说比较核心的功能会在这个阶段做一些初始化操作，例如读取一些本地的缓存以便主界面渲染后快速实例化一些服务。此外为了加快可交互时间，initialize 阶段会启动插件进程，并执行一系列插件贡献点的注册操作。

## render

<!-- 未发布的版本中 renderApp 会被调整到 initialize 之前，在此之前文档先保持原状 -->

renderApp 这部分负责渲染整个应用的主框架，核心是调用 ReactDOM 的 render 方法来渲染主界面，与一般应用不同的是，OpenSumi 的视图部分可以拖拽改变顺序、尺寸，同时也支持通过集成、插件等方式贡献新的视图界面。

> renderApp 将会在下个版本调整顺序到 initialize 之前

## onStart

onStart 在主界面渲染后执行，此时可以访问到 DOM ，一般来说可以在 onStart 阶段进行一些事件监听等操作，另外一些非首屏可见的功能也可以放在 onStart 里，起到延迟执行的作用。

## onDidStart

整个应用加载完成，核心功能已经可用(除插件外)，此时 IDE 的基础功能应该是完备的。

## onWillStop

onWillStop 主要作用于 Electron 端，在窗口触发关闭前执行一些回收以及确认操作，例如当存在未保存文件时，弹窗询问用户是否保存后再关闭。

## onStop

onStop 同样主要作用于 Electron 端，在 onWillStop 之后，用户确认可以关闭窗口时执行

## onDisposeSideEffects

与 onStop 触发时机类似，但 `onDisposeSideEffects` 是比较特殊的一类生命周期，当 IDE 被作为一个组件时，可能存在不刷新页面，单纯卸载整个 IDE 的情况，此时需要将所有 IDE 中的副作用清楚，通过主动调用 `clientApp.dispose` 方法即可触发。

## onReconnect

当前连接断开，同时重连成功后自动触发，再次连接后部分模块需要重新初始化(可能存在断开时文件、缓存被破坏，需要重新初始化)的情况。
