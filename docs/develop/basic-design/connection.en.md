---
id: connection
title: Front and Back Communication
slug: connection
order: 7
---

OpenSumi is meant to seperate the frontend and backend. Whether in the Web or Electron environment, the interface displayed in the browser/window is called OpenSumi frontend, while functions including file reading and writing, terminal connection and extension process are operated in the OpenSumi backend. Unlike conventional B/S or C/S architecture, the communication between the frontend and backend of OpenSumi is made by a single long link.  

In the Web environment, the frontend and the backend will build a `WebSocket` connection.  

![Web Connection](https://img.alicdn.com/imgextra/i3/O1CN01QiEuJD1QeVE2NkPMY_!!6000000002001-55-tps-182-243.svg)

In the Electron environment, a `Socket `connection is built for interprocess communication(IPC)  

![Electron Connection](https://img.alicdn.com/imgextra/i3/O1CN01zDX6Wg1tjeXHaqyjQ_!!6000000005938-55-tps-232-242.svg)

## Basic Principle

Our core functional code can be reused in the Web/Electron environment, and any frontend/backend interactions are consistent in interface and usage, since the `connection` module of OpenSumi shields most of the differences between platforms and underlying communications protocols. Based on [JSON-RPC 2.0](https://www.jsonrpc.org/specification), the connection module implements a RPC framework. The framework encapsulates the communication process between the Web and the Electron side by the RPC protocol. In this way, the difference is very small for integration users.

A RPC call inside OpenSumi will interpret the basics of frontend and backend communication:

```typescript
// frontend
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

This is a common example in OpenSumi. Generally, the backend is responsible to implement specific functions, while the frontend fetchs data or performs some operations (usually involving IO or process operations) through RPC calls. In this case, the frontend uses DI to inject `BackServicePath`. In fact, `BackServicePath` is a string. It is injected into the frontend as a Token through DI, but implemented as a `Proxy`.  

A front-end call to the `$getSomelocalData` method is wrapped as a `Promise<Request>` during communication. The backend will process and return it directly , while the underlying implementation wraps the return value as the request result and sends it to the frontend by using a unique ID, so the RPC call is finished. In addition to `Request`,  `Notification` is also employed in individual notifications, the difference being that the `Notification` has no return value.

```typescript
// when calling $getSomeLocalData
await this.myBackService.$getSomeLocalData();

// pseudocode implementation
myBackService = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (prop === '$getSomeLocalData') {
        return (...args) => {
          new Promise((resolve, reject) => {
            // "Connection" means the connection between the front and back ends
            connection.sendRequest(prop, ...args, response => {
              // "Promise resolve" will return the result after the request returned
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

For multiple windows scenarios, each window establishes a long connection to the Server side. To distinguish these windows, each connection communicates by a seperate `Channel`, and The communication content between Windows is completely isolated.

![Connection](https://img.alicdn.com/imgextra/i2/O1CN01aN1VYn1dkzqWPK2ev_!!6000000003775-55-tps-825-362.svg)

## User Guide

In addition to the common `frontend-> backend-` mode, OpenSumi also supports `backend-> frontend-` call. For specific examples of backend communication, see [Examples of frontend and backend communication](../sample/connection-between-browser-and-node)

