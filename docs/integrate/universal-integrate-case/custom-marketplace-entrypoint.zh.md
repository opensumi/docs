---
id: custom-marketplace-entrypoint
title: 自定义插件市场镜像源
slug: custom-marketplace-entrypoint
order: 8
---

在 OpenSumi 的默认插件市场模块中，我们兼容了由 Eclipse 推出的 [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php)，通过使用默认的 `https://open-vsx.org` 外，你也可以通过学习 OpenVSX 的部署文档去实现你自己的插件市场。

目前框架共支持两个镜像站点：

1. 国内镜像站：[https://marketplace.smartide.cn](https://marketplace.smartide.cn)
2. 官方镜像站：[https://open-vsx.org](https://open-vsx.org) （访问速度较慢）

## 配置方式

一般框架的初始项目会在两个地方使用到该镜像站点的配置，一个为安装默认插件的下载脚本，另一个则是框架启动时的插件市场配置。

### 如何修改下载脚本

你只需要找到如 `scripts/download.js` 文件，修改里面使用的站点信息即可

```typescript
- const api = 'https://open-vsx.org/api/';
+ const api = 'https://marketplace.smartide.cn/api/'; // China Mirror
```

### 如何修改插件市场源

可以参考这里的代码：[node/start-server.ts#L18](https://github.com/opensumi/opensumi-module-samples/blob/main/example/src/node/start-server.ts#L18)。

仅需要在 Node 进程启动的配置参数中添加如下参数信息：

```typescript
let opts: IServerAppOpts = {
  ...
  marketplace: {
    endpoint: 'https://open-vsx.org/api', // Official Registry
    // endpoint: 'https://marketplace.smartide.cn/api', // China Mirror
  },
  ...
};
```

如遇到插件市场无法正常访问问题，请及时切换响应的插件插件源解决该问题。
