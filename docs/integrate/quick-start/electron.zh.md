---
id: electron-quick-start
title: 快速开始（Electron）
order: 2
---

OpenSumi 内部集成了一个简易的 Electron 框架，旨在提供一个快速测试 OpenSumi 的桌面端环境。可以使用 [ide-electron](https://github.com/opensumi/ide-electron) 作为模板搭建自己的客户端。

你也可以在 [Release](https://github.com/opensumi/ide-electron/releases) 列表中获取相关安装包进行快速体验。

![preview](https://img.alicdn.com/imgextra/i4/O1CN013APO901bevPEe8Ydx_!!6000000003491-2-tps-2478-1624.png)

## 兼容环境

- Electron 11.4.3+
- macOS & Windows 10+
- Node.js 14+

## 本地启动

> **注意：由于编译过程中需要下载大量的包，并且部分包需要访问 GitHub 下载源码，请保持 GitHub 的访问畅通。很多 404 Not Found 的问题都是网络访问失败引起的。**
> 大陆用户如果是因为网络问题，导致不能正常安装依赖，可以先切换到 `main-cn` 分支： `git checkout main-cn`，或者参考文章最后的附录配置 npm 镜像。

依次运行下面的命令：

```bash
$ git clone git@github.com:opensumi/ide-electron.git
$ cd ide-electron
$ pnpm i
$ pnpm build
$ pnpm rebuild-native -- --force-rebuild=true
$ pnpm download-extension # 安装内置插件（可选）
$ pnpm start
```

## 开发

在项目根目录运行：

```bash
$ pnpm watch
```

启动：

```bash
$ pnpm start
```

## 打包

运行 `pnpm pack` 即可将项目打包，打包后的安装包将输出在 `out` 目录。

## npm 镜像配置

打开 `ide-electron/.npmrc`，添加下面的 npm 镜像配置，可以解决安装依赖失败的问题：

```config
registry=https://registry.npmmirror.com/
disturl=https://npmmirror.com/mirrors/node
chromedriver-cdnurl=https://npmmirror.com/mirrors/chromedriver
couchbase-binary-host-mirror=https://npmmirror.com/mirrors/couchbase/v{version}
debug-binary-host-mirror=https://npmmirror.com/mirrors/node-inspector
flow-bin-binary-host-mirror=https://npmmirror.com/mirrors/flow/v{version}
fse-binary-host-mirror=https://npmmirror.com/mirrors/fsevents
fuse-bindings-binary-host-mirror=https://npmmirror.com/mirrors/fuse-bindings/v{version}
git4win-mirror=https://npmmirror.com/mirrors/git-for-windows
gl-binary-host-mirror=https://npmmirror.com/mirrors/gl/v{version}
grpc-node-binary-host-mirror=https://npmmirror.com/mirrors
hackrf-binary-host-mirror=https://npmmirror.com/mirrors/hackrf/v{version}
leveldown-binary-host-mirror=https://npmmirror.com/mirrors/leveldown/v{version}
leveldown-hyper-binary-host-mirror=https://npmmirror.com/mirrors/leveldown-hyper/v{version}
mknod-binary-host-mirror=https://npmmirror.com/mirrors/mknod/v{version}
node-sqlite3-binary-host-mirror=https://npmmirror.com/mirrors
node-tk5-binary-host-mirror=https://npmmirror.com/mirrors/node-tk5/v{version}
nodegit-binary-host-mirror=https://npmmirror.com/mirrors/nodegit/v{version}/
operadriver-cdnurl=https://npmmirror.com/mirrors/operadriver
phantomjs-cdnurl=https://npmmirror.com/mirrors/phantomjs
profiler-binary-host-mirror=https://npmmirror.com/mirrors/node-inspector/
python-mirror=https://npmmirror.com/mirrors/python
rabin-binary-host-mirror=https://npmmirror.com/mirrors/rabin/v{version}
sass-binary-site=https://npmmirror.com/mirrors/node-sass
sodium-prebuilt-binary-host-mirror=https://npmmirror.com/mirrors/sodium-prebuilt/v{version}
sqlite3-binary-site=https://npmmirror.com/mirrors/sqlite3
utf-8-validate-binary-host-mirror=https://npmmirror.com/mirrors/utf-8-validate/v{version}
utp-native-binary-host-mirror=https://npmmirror.com/mirrors/utp-native/v{version}
zmq-prebuilt-binary-host-mirror=https://npmmirror.com/mirrors/zmq-prebuilt/v{version}
bin-mirrors-prefix=https://npmmirror.com/mirrors
canvas_binary_host_mirror=https://npmmirror.com/mirrors/canvas
electron-mirror=https://npmmirror.com/mirrors/electron/
electron_custom_dir={{ version }}
electron_builder_binaries_mirror=https://registry.npmmirror.com/-/binary/electron-builder-binaries/
```
