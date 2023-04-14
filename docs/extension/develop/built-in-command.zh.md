---
id: built-in-command
title: 内置命令
slug: built-in-command
order: 2
---

OpenSumi 提供了一套内置命令，部分实现了 VS Code 内置实现的命令，这些命令可能会在某些插件被使用，如果遇到了没有实现的内置命令，可以前往 [OpenSumi Issues](https://github.com/opensumi/core/issues) 提适配需求。

## 内置命令集

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

## 用法

> 例如使用 `vscode.open` 打开一个带协议的文件

```typescript
import * as sumi from 'sumi';

// 参数说明
type VSCodeOpen = (
  resource: vscode.Uri,
  columnOrOptions?: vscode.ViewColumn | vscode.TextDocumentShowOptions,
  label?: string
) => void;

sumi.commands.executeCommand(
  'vscode.open',
  {
    preserveFocus: true,
    preview: false
  } as vscode.TextDocumentShowOptions,
  'test-title'
);
```
