---
id: how-to-contribute
title: How To Contribute
slug: how-to-contribute
order: 1
---

Generally speaking, you have many ways to help develop `OpenSumi` code, for example, find a bug, write it down and submit a PR (Pull Requests), or simply give a piece of advice on a feature.

For [issue](https://github.com/opensumi/core/issues) marked with `PR Welcome`, it is best to submit your first PR when you have any questions in the process. You can always consult any project member in the comment area by using "@" any project member.

## Prepare Development Environment

> The system tool installation method here refers to the [How-to-Contribute](https://github.com/microsoft/vscode/wiki/How-to-Contribute) document of VS Code for translation, and you can directly view the document.

Before developing the code, you need to install some necessary development tools, clone our project code [opensumi/core](https://github.com/opensumi/core), and install dependencies through `npm`.

Due to the Great Firewall, using the official npm source will lead to slow download and installation. we recommend to switch your NPM image to  [npmmirror China image station](https://npmmirror.com/) before starting (or install an NPM image switching tool for quick switchover, such as [nrm](https://www.npmjs.com/package/nrm).

The following is the manual setting mode:

```bash
npm config set registry https://registry.npmmirror.com
```

You may need the following development tools:

- [Git](https://git-scm.com)
- [Node.JS](https://nodejs.org/en/), version number `>= 12.x`, `<= 14.x`
- [Python](https://www.python.org/downloads/) \(pre-dependency of node-gyp library; view [node-gyp readme](https://github.com/nodejs/node-gyp#installation) and find a suitable version currently supported\)
  - **Note:** Windows users install Python automatically when installing the npm module of `windows-build-tools`. It can be quickly installed in this way as follows:
- A C/C++ compilation tool suitable for your system:
  - **macOS**
    - To install [Xcode](https://developer.apple.com/xcode/downloads/) and its command line tools will automatically install `gcc`, the installation process relies on the `make` tool chain
      - Run `xcode-select --install` to install command line tools
  - **Windows 10/11**
    - Install Windows Build Tools:
      - If you install it by the Node installer provided by [Node.JS](https://nodejs.org/en/download/) and make sure you install the native module tools, the environment will be able to be used normally.
      - If you manage scripts by Node version, for example, [nvm](https://github.com/coreybutler/nvm-windows) or [nvs](https://github.com/jasongin/nvs)
        - Install the Python version corresponding to the current version [Microsoft Store Package](https://docs.python.org/3/using/windows.html#the-microsoft-store-package)
        - Install `Visual C++ Build Environment`: Visit and install [Visual Studio Build Tools](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools) or [Visual Studio Community Edition](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=Community). The minimal installation mode is to install `Desktop Development with C++` only
        - Open the command line and execute `npm config set msvs_version 2019`
    - Note: Make sure that your local PATH only contains ASCII characters, otherwise it may cause [node-gyp usage problems (nodejs/node-gyp/ issues#297)](https://github.com/nodejs/node-gyp/issues/297), and currently it does not support the project construction and debugging in earlier Windows version.

## Build and Run

If you want to learn how to run OpenSumi or debug an issue, you need to get the code locally, build it and run it.

### Obtain the code

In the first step, you need to fork a copy of the `OpenSumi` repository, and then clone it locally:

```bash
git clone https://github.com/<<<your-github-account>>>/core.git
```

Usually you need to synchronize the latest branch code in advance before modifying or submitting the code.

```bash
cd core
git checkout main
git pull https://github.com/opensumi/core.git main
```

After handling the code conflicts, you can submit the code to your repository, and go to [opensumi/core](https://github.com/opensumi/core/pulls) to submit your PR at any time.

Note: The default `opensumi/core` also contains a lot of GitHub Actions. If you don't want to execute these Actions, you can go to `https://github.com/<<Your Username>>/core/settings/actions` to close the corresponding Actions.

### Build

```bash
cd core
npm run init
```

### Run

After the initialization is complete, you can run the Web version directly by using the following command, and enable `Hot Reload` at the same time. All modifications except the extension process can be seen in the Web in real time.

```bash
npm start
```

By default, the framework will display the `tools/workspace` directory under the project as the workspace directory. You can also open OpenSumi by specifying the path with `MY_WORKSPACE=`, as shown below:

```bash
MY_WORKSPACE={workspace_path} npm start
```

![perview](https://img.alicdn.com/imgextra/i2/O1CN01RkgC7P1zhGC1IgghU_!!6000000006745-2-tps-2930-1802.png)

## Debug

There are multiple processes when OpenSumi is running. You need to determine the specific process you want to debug before you can debug them accordingly.

### Browser process

As for the `Browser process`, you can debug directly through `Chrome Developer Tools` (recommended), or install [Debugger for Chrome](https: //marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) to debug the breakpoint of the `Browser process`. as the picture shows:

![Browser process](https://img.alicdn.com/imgextra/i2/O1CN01RytoAv1zgLMg9FCna_!!6000000006743-2-tps-2602-1732.png#id=YcHEw&originHeight=1732&originWidth=2602&originalType=binary&ratio=1&status=done&style=none)

### Node process

As for the `Node process`, after you run the framework through `npm start`, you can make a breakpoint debugging of the `Node process` by using `VSCode` or `Attach to BackEnd` in the IDE debug panel based on OpenSumi.

![Node process](https://img.alicdn.com/imgextra/i3/O1CN014Or5e01CFOtP5rM44_!!6000000000051-2-tps-2828-1760.png#id=fYIYf&originHeight=1760&originWidth=2828&originalType=binary&ratio=1&status=done&style=none)

In addition, you can also use the `Launch Backend` and `Launch Frontend` in the debug panel to start the `Node process` and `Browser process` respectively for debugging.

### Extension Process

As for the `extension process`, you can use `VSCode` or the `Attach to Extension Host` method in the debugging panel built on OpenSumi to debug the `extension process`. When it doesn't work sometimes, you can directly open `chrome://inspect` panel to debug the code(easy to use). You can start to debug it after the framework is running by filling in `localhost:9999` in the discovery port, as shown in the following figure: 

![Extension process](https://img.alicdn.com/imgextra/i4/O1CN01qr67Fb1LCxJsM9S8p_!!6000000001264-2-tps-2500-1412.png#id=MrtyW&originHeight=1412&originWidth=2500&originalType=binary&ratio=1&status=done&style)

## Unit Test

We use `Jest` for unit testing, combined with the mock capability implemented in `@opensumi/di` to simulate and test the execution environment.

You can test the code of a module (the following code test module is debug, that is, the debug directory in the packages directory) by using the following command.

```bash
npm run test:module -- --module=debug
```

You can also debug breakpoints on test files currently activated by the editor, using the `Jest Current File` command in the debug panel.

## Code Specification

When running `npm run lint`, you can directly retrieve the overall code specification. Meanwhile when the code is committed, corresponding code formatting checks will be triggered.

## PR Rules

Each commit should be as small as possible, and you need to fill in your commit information in accordance with [ng4's submission specifications](https://www.npmjs.com/package/@commitlint/config-conventional#type-enum).

For example, you fixed the variable acquisition problem of the debug module, and the submission information can be as follows:

```txt
fix: fix variable acquisition under the debug panel
```

For PR content, just follow the PR and fill in the template.

## Extension Process Debugging

If you want to debug the extension process under the OpenSumi framework, you can link your local extension process to the `{root path}/tools/extensions` directory in the form of soft link, for example:

```bash
ln -s {local_path}/{extension_name} {root path}/tools/extensions/{extension_name}
```

You can quickly preview the effect by refreshing the page.

## Spelling

For common spelling issues, We recommend that you install [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) plug-in under `VSCode ` or an IDE built on OpenSumi, to avoid some  English spelling problems.

## Feedback

We appreciate receiving suggestions and feature requirements for the OpenSumi framework. Welcome to submit and elaborate on [Issues](https://github.com/opensumi/core/issues).
