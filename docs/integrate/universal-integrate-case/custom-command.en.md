---
id: custom-command
title: Custom Command
slug: custom-command
order: 4
---

## Overview

The two main scenarios in which the command is used are as follows.

### plugin 

The commands in OpenSumi can be used in the plugin by the following example:

```ts
import { commands, Uri } from 'sumi';

// OpenSumi deals with the command call of plug-in process specifically, which converts `Uri` to `URI` in real execution
let uri = Uri.file('/some/path/to/folder');
let success = await commands.executeCommand('vscode.openFolder', uri);
```

### Module

The commands in OpenSumi can be used in the module by the following example:  

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

## Built-in Command

In the OpenSumi framework, many basic commands are built-in. When you need to implement them, you can go to the corresponding module to find the corresponding implementation first to avoid repeated work. Some of the commonly used built-in commands are as follows.

| Command                        | Fuctionality             | parameter                             |
| --------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| revealInExplorer                                          | Locate the file on the Explorer page | `uri`: URI                       |
| setContext                                                | Set the Context variable value                 | `key`：键, `value`：值           |
| workbench.action.closeActiveEditor                        | Close this active editor                 |                                  |
| workbench.action.revertAndCloseActiveEditor               | Restore this file contents while closing the active editor|                                  |
| workbench.action.splitEditorRight                         | Split this editor right                  |                                  |
| workbench.action.splitEditorDown                          | Split this editor down                 |                                  |
| workbench.action.files.newUntitledFile                    | Creat temporary editor file                |                                  |
| workbench.action.closeAllEditors                          | Close all editors                      |                                  |
| workbench.action.closeOtherEditors                        | Close Other editors                      |                                  |
| workbench.action.files.save                               | Save current file                        |                                  |
| workbench.action.splitEditor                              | Open the file and split to the right                   | `resource` ： ResourceArgs       | URI, `editorGroup?`：EditorGroup |
| workbench.action.splitEditorOrthogonal                    | Open the file and split  down                 | `resource` ： ResourceArgs       | URI, `editorGroup？`: EditorGroup |
| workbench.action.navigateLeft                             | Switch to the left editor                    |                                  |
| workbench.action.navigateUp                               | Switch to the top editor                   |                                  |
| workbench.action.navigateRight                            | Switch to the right editor                    |                                  |
| workbench.action.navigateDown                             | Switch to the bottom editor                     |                                  |
| workbench.action.navigateEditorGroups                     | Switch editor groups                        |                                  |
| workbench.action.nextEditor                               | Switch to the next file         |                                  |
| workbench.action.previousEditor                           | Switch to the previous file             |                                  |
| workbench.action.openEditorAtIndex                        | Open the editor by subscript position         |                                  |
| workbench.action.files.revert                             | Restores the contents of the current active file           |                                  |
| workbench.action.terminal.clear                           | Clear the contents of the currently active terminal window       |                                  |
| workbench.action.terminal.toggleTerminal                  | Open/close the terminal window         |                                  |
| workbench.files.action.focusFilesExplorer                 | Open the active editor group                 |                                  |
| vscode.open                                               | Open file（only in Electron）     | `uri`: URI, `newWindow`: boolean |
| vscode.openFolder                                         | Open file（only in Electron）   | `uri`: URI, `newWindow`: boolean |
| workbench.action.reloadWindow (reload_window)             | Reload the Window                             |                                  |
| copyFilePath                                              | Copy files's absolute path to                   | `uri`: URI                       |
| copyRelativeFilePath                                      | Copy file relative path                      | `uri`: URI                       |
| workbench.action.openSettings                             | Open the Settings panel                     |                                  |
| workbench.action.navigateBack                             | Navigate back to the previous editor                   |                                  |
| workbench.action.navigateForward                          | Navigate back to the forward editor                   |                                  |
| workbench.action.files.saveAll                            | Save all files                       |                                  |
| workbench.action.debug.stepInto                           | Debug to step into                        |                                  |
| workbench.action.debug.stepOut                            | debug to step out                       |                                  |
| workbench.action.debug.stepOver                           | debug to step over                   |                                  |
| workbench.action.debug.continue                           | debug to continue            |                                  |
| workbench.action.debug.run (workbench.action.debug.start) | debug to run                             |                                  |
| workbench.action.debug.pause                              | debug to pause                           |                                  |
| workbench.action.debug.restart                            | debug to restart                           |                                  |
| workbench.action.debug.stop                               | Debug to stop                            |                                  |
| workbench.action.showAllSymbols                           | show all symbols                          |                                  |

## 注册自定义命令 Registers a Custom Command

There are also two ways to register a custom command:

### By extension

插件注册主Plugin registration mainly relies on `commands`  contribution points, which are detailed in：[contributes.commands](https://code.visualstudio.com/api/references/contribution-points#contributes.commands)。

A simple example of declaring a custom command in the plugin's `package.json` is as follows.

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

The advantage of the declaration is that the command is "explicitly" present in the frame, i.e. it can be found in the Quick Navigation panel opened by  `⇧⌘P`  or in the menu, and commands registered directly without the declaration will not appear in the above panel.

```ts
// sumi's own API
import * as sumi from 'sumi';

export async function activate(context: sumi.ExtensionContext) {
  context.subscriptions.push(
    sumi.commands.registerCommand('extension.sayHello', async () => {
      sumi.window.showInformationMessage('Hello World');
    })
  );
}
```

### By module

In module, we usually register with `CommandContribution`, which is detailed in the documentation:[Command Register](../../develop/basic-design/contribution-point#命令注册)。
