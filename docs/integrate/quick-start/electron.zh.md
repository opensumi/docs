---
id: electron-quick-start
title: 快速开始（Electron）
order: 2
---

OpenSumi 内部集成了一个简易的 Electron 框架，旨在提供一个快速测试 OpenSumi 的桌面端环境。下面可以使用 [ide-electron](https://github.com/opensumi/ide-electron) 作为模板搭建自己的客户端。

你也可以在 [Release](https://github.com/opensumi/ide-electron/releases) 列表中获取相关安装包进行快速体验。

![preview](https://img.alicdn.com/imgextra/i4/O1CN01t2BoM81OHwV4e3mKF_!!6000000001681-2-tps-2542-1956.png)

## 兼容环境

- Electron 11.4.3+
- Mac & Windows 7+
- Node.js 12+

## 本地启动

> **注意：由于编译过程中需要下载大量的包，并且部分包需要访问 GitHub 下载源码，请保持 GitHub 的访问畅通。很多 404 Not Found 的问题都是网络访问失败引起的。**

依次运行下面的命令：

```bash
$ git clone git@github.com:opensumi/ide-electron.git
$ cd ide-electron
$ yarn
$ yarn run build
$ yarn run rebuild-native -- --force-rebuild=true
$ yarn run download-extension # 安装内置插件
$ yarn run start
```

## 开发

在项目根目录运行

```bash
$ yarn run watch
```

启动 Electron 有用

```bash
$ yarn start
```

## 打包

运行 `yarn pack` 即可将项目打包，打包后的安装包将输出在 `out` 目录。
