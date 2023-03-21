---
id: quick-start
title: 快速开始
slug: quick-start
order: 1
---

OpenSumi 支持 `Web/Electron` 两种方式集成，插件系统及其能力在两个平台下具有一致的表现。

开发插件时，你可以使用 [@opensumi/cli](https://www.npmjs.com/package/@opensumi/cli) 快速在本地启动插件开发环境。

```bash
$ npm install @opensumi/cli -g
```

## 初始化插件模板

运行 `sumi init` 根据提示输入插件 `name` 、 `publisher` ，以及 `displayName` 和 `description`。

![sumi-init](https://img.alicdn.com/imgextra/i3/O1CN01A9Ic8J1nGRi2E8aOr_!!6000000005062-2-tps-838-438.png)

## 运行插件

首先需要安装依赖。

```bash
$ npm install
```

基于 `@opensumi/cli` 初始化的插件，在 `package.json` 中包含了基础的运行及构建脚本，建议开发阶段后台运行 `npm run watch` 实时编译插件代码。

在插件目录下运行 `npm run dev` 即可启动一个 Web 版本的 OpenSumi IDE，并将当前插件加载进来。

```json
{
  "scripts": {
    "compile": "sumi compile",
    "watch": "sumi watch",
    "dev": "sumi dev -e=$(pwd)"
  }
}
```

或者直接在插件目录下运行 `@opensumi/cli` 的开发命令， `sumi dev`

```bash
$ sumi watch     # 监听并自动编译代码
$ sumi dev       # 启动 OpenSumi Web 版本开发环境
```

![sumi-dev](https://img.alicdn.com/imgextra/i2/O1CN01M4UZxy1q1jpwR9PtM_!!6000000005436-2-tps-986-334.png)

浏览器打开 [http://127.0.0.1:50999](http://127.0.0.1:50999) 即可打开一个 Web 版的 OpenSumi IDE。

## 命令使用

### Engine 版本控制

在 OpenSumi 中，存在许多的发行版本，在开发插件前，你需要确保你所使用的的插件 API 在对应的 `OpenSumi Engine` 版本中支持，可以通过下面的命令查看当前使用的版本信息：

```bash
$ sumi engine ls
```

![sumi-engine-ls](https://img.alicdn.com/imgextra/i4/O1CN01egTvGF1nQWQB3JQtO_!!6000000005084-2-tps-532-196.png)

通过下面的命令你可以看到所有的 `OpenSumi Engine` 版本信息：

```bash
$ sumi engine ls-remote
```

在切换版本时，只需要通过下面的命令进行切换：

```bash
$ sumi engine use {版本}
```

在遇到插件功能表现异常时，及时更新 `OpenSumi Engine` 到最新版本进行测试是比较有效的验证手段。

### 设置编译成功回调

在运行 `sumi watch` 命令时，OpenSumi CLI 支持在每一次编译成功后执行回调，例如:

```bash
$ sumi watch --onSuccess 'echo hello world'
```

### 指定工作目录

在运行 `sumi dev` 命令时，支持指定工作目录

```bash
$ sumi dev -w=/path/to/vscode
```

这会将传入的路径作为 `workspaceDir` 参数，并将当前目录作为插件启动 OpenSumi IDE，如下图所示：

![set-workspace](https://img.alicdn.com/imgextra/i4/O1CN010Yu9Be1jgm0jSYwUt_!!6000000004578-2-tps-1200-802.png)

### 指定基础插件

OpenSumi CLI 不会内置任何插件，当你的插件依赖其他插件的一些能力时，可以将这些插件软链接或者直接复制到 OpenSumi CLI 的插件目录，默认插件目录为用户 Home 目录下的 `.sumi-dev/extensions`。

### 指定 IDE Server 端口

OpenSumi CLI 支持通过 `-p` 指定 IDE Server 监听的端口，默认为 `50999`。

```bash
$ sumi dev -p=8989 # ...
```

## 调试

```bash
# 在插件目录下运行
$ sumi dev --debug  # 启动 OpenSumi IDE 调试模式

# 或指定插件目录
$ sumi dev --debug -e=/path/to/ext1,/path/to/ext2
```

### 使用 VS Code / OpenSumi IDE 进行断点调试

插件进程本质为一个 Node.js 进程，在 VS Code 中配置 `launch.json` 即可调试插件代码。

```json
// A launch configuration that compiles the extension and then opens it inside a new window
// Use IntelliSense to learn about possible attributes.
// Hover to view descriptions of existing attributes.
// For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",									       // Attach 模式
      "name": "Attach to Extension Host",
      "port": 9889,													       // 插件进程端口，不可修改
      "skipFiles": ["<node_internals>/**"],
      "sourceMaps": true,										        // 开启 SourceMap，便于源码映射
      "outFiles": ["${workspaceFolder}/out/*/.js"]	// 指定插件代码输出目录
    }
}

```

在 VS Code 调试面板中选择 Attach to Extension Host，即可使用 VS Code 进行断点调试

![debug](https://img.alicdn.com/imgextra/i3/O1CN0118sSJb1KYCCXcZrIS_!!6000000001175-2-tps-1200-683.png)

在基于 OpenSumi 开发的本地客户端上调试原理也是一致的，将配置文件放置在 `.sumi/launch.json` 下即可。

**如需在 typescript 源码中进行断点调试，需要编译时开启 Sourcemap**

### 指定运行环境

目前支持基于 OpenSumi 框架的桌面(Electron) 版 IDE 作为插件运行环境。

在终端运行

```bash
$ sumi dev -e=/path/to/ext1,/path/to/ext2 --execute=/path/to/IDE
```

`--execute` 参数表示桌面 IDE 可执行文件路径，例如:

```bash
# Windows
$ sumi dev -e=/path/to/ext --execute=/C:\Program Files\OpenSumi\OpenSumi.exe --debug

# MacOS
$ sumi dev -e=/path/to/ext --execute=/Applications/OpenSumi.app/Contents/MacOS/OpenSumi --debug
```

> 使用桌面版 IDE 时，由于桌面版 IDE 可能包含创建、选择项目等前置流程，故无法通过参数指定 `workspaceDir`。

## 打包插件

使用 `sumi package` 命令将你的插件打包。

![sumi-package](https://img.alicdn.com/imgextra/i1/O1CN012hnLYD1p6wiwKXrHk_!!6000000005312-2-tps-886-618.png)

```bash
$ sumi package
```

请确保插件 `package.json` 中包含名为 `prepublish` 的 `scripts` 脚本。

```json
{
  "scripts": {
    "prepublishOnly": "/* your compile script */"
  }
}
```

这会先运行 `npm list` 分析依赖，如果你需要将插件项目的 node_modules 一并打包进去，建议使用 `npm install --production` 安装依赖，这样会仅安装运行时必要的模块。

### 排除目录

运行 `sumi package` 命令时，支持指定排除的文件或目录，在插件项目下新建名为 `.vscodeignore` 的文件，格式类似 `.gitignore` ，支持 glob 模式匹配目录，在打包时将会排除掉这些文件：

```bash
# .vscodeignore
node_modules/
src/
yarn-error.log
# ...
```

或传入 `--ignoreFile` 参数指定 ignore 文件

```bash
$ sumi package --ignoreFile=/path/to/.ignore
```
