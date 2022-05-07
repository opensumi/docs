---
id: quick-start
title: 快速开始（Web）
slug: quick-start
order: 1
---

OpenSumi 基于 Node.js `12.x +` 版本开发，需要确保你本地已经安装上正确的 Node.js 版本。同时 OpenSumi 依赖一些 Node.js Addon，为了确保这些 Addon 能够被正常编译运行，建议参考 [node-gyp](https://github.com/nodejs/node-gyp#installation) 中的安装指南来搭建本地环境。

![preview](https://img.alicdn.com/imgextra/i3/O1CN01uIRRRl1wmLkN9geV3_!!6000000006350-2-tps-2844-1830.png)

## 本地启动

> **注意：由于编译过程中需要下载大量的包，并且部分包需要访问 GitHub 下载源码，请保持 GitHub 的访问畅通。很多 404 Not Found 的问题都是网络访问失败引起的。**

依次运行下面的命令：

```bash
$ git clone git@github.com:opensumi/ide-startup.git
$ cd ide-startup
$ yarn					   # 安装依赖
$ yarn start		       # 并行启动前端和后端
```

浏览器打开 `http://127.0.0.1:8080` 进行预览或开发。

## 使用 Docker 镜像

```bash
# 拉取镜像
docker pull ghcr.io/opensumi/opensumi-web:latest

# 运行
docker run --rm -d  -p 8080:8000/tcp ghcr.io/opensumi/opensumi-web:latest
```

浏览器打开 `http://127.0.0.1:8080` 进行预览或开发。

## 启动参数

Startup 中集成代码比较简单，大体上是分别实例化了 `ClientApp`  和 `ServerApp` ，传入相应的参数并启动。下面简单列举一部分核心启动参数。

详细启动参数可查看 [自定义配置](../universal-integrate-case/custom-config) 文档。

## 定制 IDE

OpenSumi 支持通过模块的方式对界面主题、内置命令、菜单等基础能力进行定制，更多详细的定制内容可以查看：

- [自定义命令](../universal-integrate-case/custom-command)
- [自定义配置](../universal-integrate-case/custom-config)
- [自定义视图](../universal-integrate-case/custom-view)
