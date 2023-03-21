---
id: built-in-command
title: Built-in Command
slug: built-in-command
order: 2
---

OpenSumi provides a set of built-in commands, which partially implement the built-in commands of VS Code. These commands may be used in some plug-ins. If you encounter built-in commands that are not implemented, you can go to [OpenSumi Issues](https://github .com/opensumi/core/issues) for adaptation requirements.

## Built-in command set

| command                                                   | function                                                      | parameter                        |
| --------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------- |
| revealInExplorer                                          | Locate file in explorer interface                             | `uri`: URI                       |
| setContext                                                | Set Context variable value                                    | `key`: key, `value`: value       |
| workbench.action.closeActiveEditor                        | Close the currently active editor                             |                                  |
| workbench.action.revertAndCloseActiveEditor               | Reverts the current file content and closes the active editor |                                  |
| workbench.action.splitEditorRight                         | Split the current editor to the right                         |                                  |
| workbench.action.splitEditorDown                          | Split the current editor down                                 |                                  |
| workbench.action.files.newUntitledFile                    | Create a new temporary editor file                            |                                  |
| workbench.action.closeAllEditors                          | close all editors                                             |                                  |
| workbench.action.closeOtherEditors                        | close other editors                                           |                                  |
| workbench.action.files.save                               | Save current file                                             |                                  |
| workbench.action.splitEditor                              | Open file and split right                                     | `resource`: ResourceArgs         | URI, `editorGroup?`: EditorGroup |
| workbench.action.splitEditorOrthogonal                    | Open file and split down                                      | `resource`: ResourceArgs         | URI, `editorGroup?`: EditorGroup |
| workbench.action.navigateLeft                             | Switch to left editor                                         |                                  |
| workbench.action.navigateUp                               | switch to top editor                                          |                                  |
| workbench.action.navigateRight                            | Switch to right editor                                        |                                  |
| workbench.action.navigateDown                             | switch to bottom editor                                       |                                  |
| workbench.action.navigateEditorGroups                     | Navigate Editor Groups                                        |                                  |
| workbench.action.nextEditor                               | Switch to next file                                           |                                  |
| workbench.action.previousEditor                           | Switch to previous file                                       |                                  |
| workbench.action.openEditorAtIndex                        | Open editor by subscript position                             |                                  |
| workbench.action.files.revert                             | Reverts the currently active file content                     |                                  |
| workbench.action.terminal.clear                           | Clear the contents of the currently active terminal window    |                                  |
| workbench.action.terminal.toggleTerminal                  | Toggle Terminal Window                                        |                                  |
| workbench.files.action.focusFilesExplorer                 | Open the active editor group                                  |                                  |
| vscode.open                                               | Open file (only available under Electron)                     | `uri`: URI, `newWindow`: boolean |
| vscode.openFolder                                         | open folder (only available under Electron)                   | `uri`: URI, `newWindow`: boolean |
| workbench.action.reloadWindow (reload_window)             | reload window                                                 |                                  |
| copyFilePath                                              | Copy file absolute path                                       | `uri`: URI                       |
| copyRelativeFilePath                                      | Relative file path to copy                                    | `uri`: URI                       |
| workbench.action.openSettings                             | Open Settings panel                                           |                                  |
| workbench.action.navigateBack                             | Go to previous editor                                         |                                  |
| workbench.action.navigateForward                          | Navigate to the next editor                                   |                                  |
| workbench.action.files.saveAll                            | save all files                                                |                                  |
| workbench.action.debug.stepInto                           | Debug StepInto                                                |                                  |
| workbench.action.debug.stepOut                            | Debug step out                                                |                                  |
| workbench.action.debug.stepOver                           | Debug stepping                                                |                                  |
| workbench.action.debug.continue                           | debug continue                                                |                                  |
| workbench.action.debug.run (workbench.action.debug.start) | debug run                                                     |                                  |
| workbench.action.debug.pause                              | debug pause                                                   |                                  |
| workbench.action.debug.restart                            | debug restart                                                 |                                  |
| workbench.action.debug.stop                               | debug stop                                                    |                                  |
| workbench.action.showAllSymbols                           | Show all symbols                                              |                                  |

## Usage

> For example, use `vscode.open` to open a file with a protocol

```typescript
import * as sumi from 'sumi';

// Parameter Description
type VSCodeOpen = (
  resource: vscode.Uri,
  columnOrOptions?: vscode.ViewColumn | vscode.TextDocumentShowOptions,
  label?: string
) => void;

sumi.commands.executeCommand(
  'vscode. open',
  {
    preserveFocus: true,
    preview: false
  } as vscode.TextDocumentShowOptions,
  'test-title'
);
```
