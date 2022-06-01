---
id: custom-keybinding
title: 自定义快捷键
slug: custom-keybinding
order: 5
---

## 概览

作为一款富交互的 IDE，良好的快捷键设计能很大程度上解放使用者对于界面操作的依赖，提高工作/操作效率，而在 OpenSumi 框架中，除了支持通过插件的形式注册插件外，也支持通过模块的方式进行拓展，本文重点讲解如何在集成阶段为你的应用预设更多的快捷键。

## 注册快捷键

在模块中，我们通常采用 `KeybindingContribution` 的方式进行注册，详细可参见：[快捷键注册](../../develop/basic-design/contribution-point#快捷键注册)。

## 支持的快捷键字符

特定平台下支持的修饰符如下：

| 平台    | 修饰符                             |
| ------- | ---------------------------------- |
| macOS   | `Ctrl+`, `Shift+`, `Alt+`, `Cmd+`  |
| Windows | `Ctrl+`, `Shift+`, `Alt+`, `Win+`  |
| Linux   | `Ctrl+`, `Shift+`, `Alt+`, `Meta+` |

同时，你也可以在快捷键注册时使用 `ctrlcmd` 来作为修饰符使用，该修饰符在 macOS 下会被识别为 `Cmd` 而在 Linux 和 Windows 下会被识别为 `Ctrl`。

其余支持的一些键值如下：

- `f1-f19`, `a-z`, `0-9`
- `,`-`,`=`,`[`, `]`,`\`, `;`, `,`,`,`.`,`/`
- `left`, `up`, `right`, `down`, `pageup`, `pagedown`, `end`, `home`
- `tab`, `enter`, `escape`, `space`, `backspace`, `delete`
- `pausebreak`, `capslock`, `insert`
- `numpad0-numpad9`, `numpad_multiply`, `numpad_add`, `numpad_separator`
- `numpad_subtract`, `numpad_decimal`, `numpad_divide`

## 通过 when 控制生效范围

一般而言，在我们注册一个快捷键的时候，我们都只希望这个快捷键在特定的区域生效，通常我们建议使用 `when` 逻辑进行控制，在 OpenSumi 框架中定义了部分 `when` 表达式，大部分情况下你可以直接使用，见：[contextkey/index.ts](https://github.com/opensumi/core/blob/f3fd01381d6ee854102d491b14957e9e634941a3/packages/core-browser/src/contextkey/index.ts)。

你只需要在注册快捷键的时候加上 `when` 字段，便可以让快捷键的只在 `when` 生效的时候被响应，这能有效避免在你的 IDE 中出现快捷键冲突的情况。如下：

```ts
keybindings.registerKeybinding({
  command: 'type',
  keybinding: 'enter',
  when: 'editorTextFocus'
});
```

你也可以自定义或注册 `when` 表达式，详细可参考简单的 [dialog.contextkey.ts](https://github.com/opensumi/core/blob/f3fd01381d6ee854102d491b14957e9e634941a3/packages/overlay/src/browser/dialog.contextkey.ts) 例子。

自此，你便可以通过集成自定义了快捷键的模块的方式实现对功能快捷键的定制。
