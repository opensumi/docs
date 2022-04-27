---
id: electron-quick-start
title: Quick Start（Electron）
order: 2
---

OpenSumi integrates internally a simple Electron framework,and designed to provide a desktop environment for quick testing OpenSumi. You can build your own client using [idee-electron](https://github.com/opensumi/ide-electron) as a template.

You can also get the relevant installation package in the [Release](https://github.com/opensumi/ide-electron/releases) list for a quick experience.

![preview](https://img.alicdn.com/imgextra/i4/O1CN013APO901bevPEe8Ydx_!!6000000003491-2-tps-2478-1624.png)

## Compatible Environment 

- Electron 11.4.3+
- macOS & Windows 7+
- Node.js 12+

## Local Start

> **注意：由于编译过程中需要下载大量的包，并且部分包需要访问 GitHub 下载源码，请保持 GitHub 的访问畅通。很多 404 Not Found 的问题都是网络访问失败引起的。** Note: As a large number of packages need to be downloaded during the compilation process, and some packages need to access GitHub to download the source code, please keep GitHub accessible.  Many 404 Not Found problems are caused by network access failures.  
> China mainland Users who cannot install dependencies properly because of network problems can switch to the `main-cn` branch first: `git checkout main-cn`, or refer to the appendix at the end of the article to configure the npm image.

Run the following commands in sequence:

```bash
$ git clone git@github.com:opensumi/ide-electron.git
$ cd ide-electron
$ npm install
$ npm run build
$ npm run rebuild-native -- --force-rebuild=true
$ npm run download-extension # 安装内置插件（可选）
$ npm run start
```

## 开发

在项目根目录运行

```bash
$ npm run watch
```

Start

```bash
$ npm run start
```

## Package

Run `npm run pack` to package the project, the packaged installation package will be exported in the `out` directory.   


## npm image
Open `ide-electron/.npmrc` and add the following NPM image configuration to resolve installation dependency failure:  
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