---
id: connection
title: Front and Back Communication
slug: connection
order: 7
---

OpenSumi is meant to seperate front end and back end. Whether in the Web or Electron environment, the interface displayed in the browser/window is called the front end of OpenSumi, while functions like file reading and writing, endpoint connection and plug-in process are operated in the back end of OpenSumi. Unlike the conventional B/S and C/S architectures, the communication between the front and back ends of OpenSumi is made by a single long link.  

In the Web environment, the front end and the back will build a `WebSocket`connection.  

![Web Connection](https://img.alicdn.com/imgextra/i3/O1CN01QiEuJD1QeVE2NkPMY_!!6000000002001-55-tps-182-243.svg)

In the Electron environment, a 'Socket' connection is built for interprocess communication(IPC)  

![Electron Connection](https://img.alicdn.com/imgextra/i3/O1CN01zDX6Wg1tjeXHaqyjQ_!!6000000005938-55-tps-232-242.svg)

## Fundamentals

The code of OpenSumi core functionality can be reused on the Web/Electron environment, and any front/back-end interaction maintains the consistency of interface and usage, as the `connection` module inside OpenSumi shields most of the differences between platforms and underlying communication protocols. Based on [JSON-RPC 2.0](https://www.jsonrpc.org/specification), the connection module implements a RPC framework that encapsulates the communication process between the Web and the Electron side via the RPC protocol. In this way, the difference is very small for integration users at the code level.

Let's interpret the basics of front-end and back-end communication through a simple RPC call inside OpenSumi

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

This is a common example in OpenSumi. Generally, the back end is responsible for implementing specific functions, while the front fetchs data or performs some operations (usually involving IO or process operations) through RPC calls. In this case, the front end uses DI to inject `BackServicePath`. In fact, `BackServicePath` is a string which is injected into the front end as a Token through DI, but implemented as a `Proxy`.  

A front-end call to the `$getSomelocalData` method is wrapped as a `Promise<Request>` during communication, which is processed and returned directly by the back end, while the underlying implementation wraps the return value as the result of the request, and sends it to the front end with a unique ID, thus completing an RPC call. In addition to `Request`, there is also `Notification` for individual notifications, the difference being that `Notification` has no return value.

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

### Channel

For multi-window scenarios, each window establishes a long connection to the Server side. To distinguish these windows, each connection is communicated by a seperate `Channel`, and the content of the communication between the windows is completely isolated.

![Connection](https://img.alicdn.com/imgextra/i2/O1CN01aN1VYn1dkzqWPK2ev_!!6000000003775-55-tps-825-362.svg)

## User Guide

In addition to the common `front end-> back end- ` mode, OpenSumi also supports `back end-> front end-` calls. For the specific example of back-end communication, please refer to[Examples of front-end and back-end communication](../sample/connection-between-browser-and-node)
