---
id: custom-marketplace-entrypoint
title: 自定义插件市场镜像源
slug: custom-marketplace-entrypoint
order: 8
---

## 概览

OpenSumi 同时支持 [蚂蚁 Cloud IDE 插件市场](https://marketplace.opentrs.com/square) 及 [Eclipse Open VSX](https://www.eclipse.org/community/eclipse_newsletter/2020/march/1.php) ，两个插件市场可以通过配置相互切换，目前默认使用的是蚂蚁 Cloud IDE 插件市场


## 配置方式

一般框架的初始项目会在两个地方使用插件市场相关的配置，一个为安装默认插件的下载脚本，另一个则是框架启动时的插件市场配置。

### 如何修改下载脚本

下载脚本（`scripts/download.js`）默认使用的是蚂蚁 Cloud IDE 插件市场，如需切换，可以在 `package.json` 文件的 `download-extension` 命令中指定插件市场类型：

```json
{
  "scripts": {
    -"download-extension": "cross-env DEBUG=InstallExtension node scripts/download.js"
    +"download-extension": "cross-env DEBUG=InstallExtension MARKETPLACE=openvsx node scripts/download.js"
  }
}
```

### 如何修改插件市场源

可以参考这里的代码：[node/start-server.ts#L18](https://github.com/opensumi/opensumi-module-samples/blob/main/example/src/node/start-server.ts#L18)，在 Node 进程启动的配置参数中添加相关参数信息，具体配置如下：

#### 蚂蚁 Cloud IDE 插件市场

```typescript
let opts: IServerAppOpts = {
  ...
  marketplace: {
    endpoint: 'https://marketplace.opentrs.com',
    accountId: 'clcJKq_Gea47whxAJGrgoYqf',
    masterKey: '_V_LPJ6Ar-1nrSVa05xDGBYp',
  },
  ...
};
```

#### Eclipse Open VSX

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

如遇到插件市场无法正常访问问题，请及时切换相应的插件插件源解决该问题。

## 插件同步机制

目前 OpenSumi 对 VSCode 插件 API 的兼容有一定的滞后性（约三个月），因此托管在插件市场中的 VSCode 插件在同步前必须先进行代码扫描，如果用户在使用蚂蚁 Cloud IDE 插件市场时发现缺少想要的插件，可以在 [OpenSumi 项目主仓库](https://github.com/opensumi/core/issues) issues 列表中提出插件同步需求，项目组成员会对插件扫描后同步可用的版本。