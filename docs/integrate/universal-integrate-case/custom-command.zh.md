---
id: custom-command
title: 自定义命令
slug: custom-command
order: 4
---

# 使用

使用命令的场景主要有下面两种：

## 插件

插件中可以通过下面例子的用法使用 OpenSumi 中的命令：

```ts
import { commands, Uri } from 'sumi';

// OpenSumi 针对插件进程的命令调用进行了特殊处理，真实执行时会将 `Uri` 转化为 `URI`
let uri = Uri.file('/some/path/to/folder');
let success = await commands.executeCommand('vscode.openFolder', uri);
```

## 模块

模块中可以通过下面例子的用法使用 OpenSumi 中的命令：

```ts
import { Injectable, Autowired } from '@opensumi/common-di';
import { CommandService, URI } from '@opensumi/ide-core-browser';

@Injectable()
class DemoModule {
  ...
  @Autowired(CommandService)
  private readonly commandService: CommandService;

  run () {
    let uri = new URI('/some/path/to/folder');
    await this.commandService.executeCommand('vscode.openFolder', uri);
  }

  ...
}
```

# 内置命令

在 OpenSumi 框架中，内置了许多基础命令，在需要实现时，你可以先到对应模块查找一下对应实现，避免重复劳动。常用的一些内置命令如下：

| 命令                                                      | 功能                                 | 参数                             |
| --------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| revealInExplorer                                          | 在资源管理器界面定位文件             | `uri`: URI                       |
| setContext                                                | 设置 Context 变量值                  | `key`：键, `value`：值           |
| workbench.action.closeActiveEditor                        | 关闭当前激活的编辑器                 |                                  |
| workbench.action.revertAndCloseActiveEditor               | 恢复当前文件内容同时关闭激活的编辑器 |                                  |
| workbench.action.splitEditorRight                         | 向右拆分当前编辑器                   |                                  |
| workbench.action.splitEditorDown                          | 向下拆分当前编辑器                   |                                  |
| workbench.action.files.newUntitledFile                    | 新建临时的编辑器文件                 |                                  |
| workbench.action.closeAllEditors                          | 关闭所有编辑器                       |                                  |
| workbench.action.closeOtherEditors                        | 关闭其他编辑器                       |                                  |
| workbench.action.files.save                               | 保存当前文件                         |                                  |
| workbench.action.splitEditor                              | 打开文件并向右拆分                   | `resource` ： ResourceArgs       | URI, `editorGroup?`：EditorGroup |
| workbench.action.splitEditorOrthogonal                    | 打开文件并向下拆分                   | `resource` ： ResourceArgs       | URI, `editorGroup？`: EditorGroup |
| workbench.action.navigateLeft                             | 切换到左侧编辑器                     |                                  |
| workbench.action.navigateUp                               | 切换到顶部编辑器                     |                                  |
| workbench.action.navigateRight                            | 切换到右侧编辑器                     |                                  |
| workbench.action.navigateDown                             | 切换到底部编辑器                     |                                  |
| workbench.action.navigateEditorGroups                     | 切换编辑器组                         |                                  |
| workbench.action.nextEditor                               | 切换至下个文件                       |                                  |
| workbench.action.previousEditor                           | 切换至上个文件                       |                                  |
| workbench.action.openEditorAtIndex                        | 通过下标位置打开编辑器               |                                  |
| workbench.action.files.revert                             | 恢复当前激活的文件内容               |                                  |
| workbench.action.terminal.clear                           | 清理当前激活的终端窗口内容           |                                  |
| workbench.action.terminal.toggleTerminal                  | 打开/关闭 终端窗口                   |                                  |
| workbench.files.action.focusFilesExplorer                 | 打开激活的编辑器组                   |                                  |
| vscode.open                                               | 打开文件（仅在 Electron 下可用）     | `uri`: URI, `newWindow`: boolean |
| vscode.openFolder                                         | 打开文件夹（仅在 Electron 下可用）   | `uri`: URI, `newWindow`: boolean |
| workbench.action.reloadWindow (reload_window)             | 重载窗口                             |                                  |
| copyFilePath                                              | 复制文件绝对路径                     | `uri`: URI                       |
| copyRelativeFilePath                                      | 复制文件相对路径                     | `uri`: URI                       |
| workbench.action.openSettings                             | 打开设置面板                         |                                  |
| workbench.action.navigateBack                             | 前往上一个编辑器                     |                                  |
| workbench.action.navigateForward                          | 前往下一个编辑器                     |                                  |
| workbench.action.files.saveAll                            | 保存全部文件                         |                                  |
| workbench.action.debug.stepInto                           | 调试步入                             |                                  |
| workbench.action.debug.stepOut                            | 调试步出                             |                                  |
| workbench.action.debug.stepOver                           | 调试步进                             |                                  |
| workbench.action.debug.continue                           | 调试继续                             |                                  |
| workbench.action.debug.run (workbench.action.debug.start) | 调试运行                             |                                  |
| workbench.action.debug.pause                              | 调试暂停                             |                                  |
| workbench.action.debug.restart                            | 调试重启                             |                                  |
| workbench.action.debug.stop                               | 调试终止                             |                                  |
| workbench.action.showAllSymbols                           | 展示所有符号                         |                                  |

# 注册自定义命令

注册自定义命令的方式同样也存在两种方式：

## 通过插件注册

插件注册主要依赖 `commands` 贡献点，详细文档可见：[contributes.commands](https://code.visualstudio.com/api/references/contribution-points#contributes.commands)。

在插件的 `package.json` 声明自定义命令的简单例子如下：

```json
{
  "contributes": {
    "commands": [
      {
        "command": "extension.sayHello",
        "title": "Hello World",
        "category": "Hello",
        "icon": {
          "light": "path/to/light/icon.svg",
          "dark": "path/to/dark/icon.svg"
        }
      }
    ]
  }
}
```

声明的好处是能够让该命令“显式”的存在于框架中，即通过 `⇧⌘P` 打开快速导航面板，或是在菜单中都能找到其位置，没有声明直接进行注册的命令将不会出现在上述面板中。

```ts
// sumi 自有插件 API
import * as sumi from 'sumi';

export async function activate(context: sumi.ExtensionContext) {
  context.subscriptions.push(
    sumi.commands.registerCommand('extension.sayHello', async () => {
      sumi.window.showInformationMessage('Hello World');
    })
  );
}
```

## 通过模块注册

在模块中，我们通常采用 `CommandContribution` 进行注册，详细可见文档：[命令注册](../..//develop/modules/contribution-point.md#命令注册)。
