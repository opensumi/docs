---
id: electron-quick-start
title: Quick Start（Electron）
order: 2
---

OpenSumi integrates internally a simple Electron framework, and designed to provide a desktop environment to quick test OpenSumi. You can build your own client by using [idee-electron](https://github.com/opensumi/ide-electron) as a template.

You can also get the relevant installation package in the [Release](https://github.com/opensumi/ide-electron/releases) list for a quick experience.

![preview](https://img.alicdn.com/imgextra/i4/O1CN013APO901bevPEe8Ydx_!!6000000003491-2-tps-2478-1624.png)

## Compatible Environments 

- Electron 11.4.3+
- macOS & Windows 7+
- Node.js 12+

## Local Launch

> **Note: Because a large number of packages need to be downloaded during the compilation process, and some packages need to access GitHub to download the source code, please keep GitHub accessible. Many 404 Not Found problems are caused by network access failures.**   
> China mainland users who cannot install dependencies properly due to network problems can switch to the `main-cn` branch first: `git checkout main-cn`, or refer to the appendix at the end of the article to configure the npm image.

Run the following commands in sequence:

```bash
$ git clone git@github.com:opensumi/ide-electron.git
$ cd ide-electron
$ yarn
$ yarn build
$ yarn rebuild-native -- --force-rebuild=true
$ yarn download-extension # install built-in extensions (optional)  
$ yarn start
```

## Development 

Run in the project root directory

```bash
$ yarn watch
```

Start

```bash
$ yarn start
```

## Package

Run `yarn pack` to package the project. The installation package will be exported in the `out` directory.   
