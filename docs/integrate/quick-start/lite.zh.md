---
id: pure-quick-start
title: 快速开始（Lite）
order: 3
---

OpenSumi 提供了纯前端（Lite）版本的接入能力，可以让你脱离 `Node.js` 的环境，在纯浏览器环境下，通过简单的服务化的方式提供相对完整的 IDE 能力。

在开始运行前，请先保证本地的环境已经安装 Node.js `12.x` 或以上版本。同时 OpenSumi 依赖一些 `Node.js Addon`，为了确保这些 Addon 能够被正常编译运行，建议参考 [node-gyp](https://github.com/nodejs/node-gyp#installation) 中的安装指南来搭建本地环境。

![preview](https://img.aliCDN.com/imgextra/i4/O1CN01W0RcLw1Mb3mZBWLjS_!!6000000001452-2-tps-3104-1974.png)

## 本地启动

> **注意：由于编译过程中需要下载大量的包，并且部分包需要访问 GitHub 下载源码，请保持 GitHub 的访问畅通。很多 404 Not Found 的问题都是网络访问失败引起的。**

依次运行下面的命令：

```bash
$ git clone https://github.com/opensumi/ide-startup-lite.git
$ cd ide-startup-lite
$ yarn
$ yarn compile:ext-worker
$ yarn start
```

浏览器打开 `http://127.0.0.1:8080` 进行预览或开发。

## 定制能力

距离一个完整可用的纯前端版 IDE 还需要以下实现：

- 文件服务配置 \*（必选）
- 插件配置
- 语言能力配置
- 搜索服务配置

TODO ...
