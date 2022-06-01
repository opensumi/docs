---
id: connection
title: 前后端通信
slug: connection
order: 7
---

OpenSumi 是前后端分离的设计，不论是在 Web 还是 Electron 环境下，浏览器/窗口中展示的界面部分我们称之为 OpenSumi 的前端，而对于文件读写、终端连接、插件进程等功能则运行在 OpenSumi 的后端。与传统的 B/S、C/S 架构不同的是，OpenSumi 前后端之间的通信仅由一个长链接连接实现。

在 Web 环境下，前后端会建立一条 `WebSocket` 连接：

![Web Connection](https://img.alicdn.com/imgextra/i3/O1CN01QiEuJD1QeVE2NkPMY_!!6000000002001-55-tps-182-243.svg)

在 Electron 环境下，则会建立一条 `Socket` 连接进行进程间通信(IPC)：

![Electron Connection](https://img.alicdn.com/imgextra/i3/O1CN01zDX6Wg1tjeXHaqyjQ_!!6000000005938-55-tps-232-242.svg)

## 基本原理

OpenSumi 核心功能的代码都是可以在 Web/Electron 端复用的，任何前/后端的交互都保持了接口、用法的一致性，这是因为 OpenSumi 内的 `connection` 模块屏蔽了大部分平台、底层通信协之间的差异。connection 模块基于 [JSON-RPC 2.0](https://www.jsonrpc.org/specification) 实现了一个 RPC 框架，将 Web 与 Electron 端通信过程通过 RPC 协议来封装起来，这样对于集成用户来说，体现在代码层面，两端的区别非常小。

我们通过一个 OpenSumi 内简单的 RPC 调用来介绍前后端通信的基本原理：

```typescript
// Front End
class MyService implements IMyService {
  @Autowired(BackServicePath)
  private readonly myBackService: IBackService;

  private doSomeThing() {
    const res = await this.myBackService.$getSomeLocalData();
    //
  }
}

// Back End
class BackService implements IBackService {
  public $getSomeLocalData(): Promise<ILocalData> {
    const data = await getData();
    return data;
  }
}
```

这是一个在 OpenSumi 中非常常见的例子，一般来讲，后端部分负责实现具体功能，而前端通过 RPC 调用来获取数据或执行某些操作（通常涉及 IO 或进程操作）。在这个例子中，前端通过 DI 来注入了 `BackServicePath`，实际上 `BackServicePath`是一个字符串，它通过 DI 被作为 Token 注入给前端使用，而其实现则是一个 `Proxy`。

前端对 `$getSomelocalData` 方法的调用，在通信过程中会被包装为一个 `Promise<Request>`，后端经过处理后直接返回，在底层的实现则会将这个返回值包装为请求结果，通过一个唯一 id 来发送到前端，这样就完成了一次 RPC 调用。除了 `Request` 之外，还有用于单项通知的 `Notification`，区别在于 `Notification` 是没有返回值的。

```typescript
// 调用 $getSomeLocalData 时
await this.myBackService.$getSomeLocalData();

// 伪代码实现
myBackService = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (prop === '$getSomeLocalData') {
        return (...args) => {
          new Promise((resolve, reject) => {
            // connection 表示前后端连接
            connection.sendRequest(prop, ...args, response => {
              // 请求返回后通过 Promise resolve 将结果返回
              resolve(response);
            });
          });
        };
      }
    }
  }
);
```

### 频道

对于多窗口的场景下，每一个窗口都会同 Server 端建立长连接，为了区分这些窗口，每个连接都由单独的 `Channel`来实现通信，窗口之间通信内容是完全隔离的。

![Connection](https://img.alicdn.com/imgextra/i2/O1CN01aN1VYn1dkzqWPK2ev_!!6000000003775-55-tps-825-362.svg)

## 用法

除了常见的 `前端 -> 后端` 这种模式，OpenSumi 也支持 `后端 -> 前端` 调用。关于前后端通信的具体实例，可以参考 [前后端通信示例](../sample/connection-between-browser-and-node)。
