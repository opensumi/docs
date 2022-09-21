---
id: shortcuts-guard
title: Shortcuts Guard
slug: shortcuts-guard
order: 1
---

基于 OpenSumi 开发的 IDE 的快捷键存在和谷歌浏览器快捷键冲突的情况，这些情况让 IDE 对应行为无法生效。例如 `Ctrl/Cmd + W` 快捷键会关闭当前浏览器的标签页，使得 IDE 无法处理这个快捷键事件。Shortcuts Guard 解决常用的快捷键冲突。

![popup 页面](https://gw.alipayobjects.com/zos/antfincdn/Vplt6x5G9/4b3c7a42-f9b6-4b36-a42e-d814397c6137.png)

## 使用说明

- 前往插件仓库的[发布页面](https://github.com/opensumi/shortcuts-guard/releases)或者 [Chrome 应用商店](https://chrome.google.com/webstore/detail/shortcuts-guard/nephehdkdelkjgiihmhdjpedpoinmpjl?hl=zh-CN)获取 Shortcuts Guard。
- 点击插件图标，然后会出现一个 popup 页面。
- 在 popup 页面中输入可为匹配模式的 URL，插件会在你输入的 URL 上守护 IDE 快捷键。
- 点击 popup 页面右上角键盘图标，前往快捷键设置页面，然后输入冲突的快捷键。

## 匹配模式

支持点击 popup 页面新增 URL 输入框内的铅笔按钮，自动获取当前浏览器页面 URL 的匹配模式到输入框中。

### 基本语法

```
<URL 模式> := <协议>://<主机><路径>
<协议> := '*' | 'http' | 'https'
<主机> := '*' | '*.' <除了 '/' 和 '*' 外的任何字符>+
<路径> := '/' <任何字符>
```

### 例子

| 模式                               | 效果                                                                                                                                                                                               | 匹配的 URLs 例子                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `https://*/*`                      | 匹配任何使用 `https` 协议的 URL                                                                                                                                                                    | https://www.google.com/<br/>https://example.org/foo/bar.html          |
| `https://*/foo*`                   | 匹配任何使用 `https` 协议且路径以`/foo`开头的 URL                                                                                                                                                  | https://example.com/foo/bar.html<br/>https://www.google.com/foo       |
| `https://*.google.com/foo*bar`     | 匹配任何使用 `https` 协议、基于 google.com 的主机（例如 [www.google.com、docs.google.com](http://www.google.xn--comdocs-0o3f.google.com/) 或 google.com）且路径以 `/foo` 开头并以 `bar` 结尾的 URL | https://www.google.com/foo/baz/bar<br/>https://docs.google.com/foobar |
| `https://example.org/foo/bar.html` | 匹配指定的 URL                                                                                                                                                                                     | https://example.org/foo/bar.html                                      |
| `http://127.0.0.1/*`               | 匹配任何使用 `http` 协议且主机为 127.0.0.1 的 URL                                                                                                                                                  | http://127.0.0.1/<br/>http://127.0.0.1/foo/bar.html                   |
| `*://mail.google.com/*`            | 匹配任何以 `http://mail.google.com` 或 `https://mail.google.com` 开头的 URL                                                                                                                        | http://mail.google.com/foo/baz/bar<br/>https://mail.google.com/foobar |

> 参考 [Match patterns - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/match_patterns/)

## 守护的快捷键

| **Windows 快捷键** | **Mac 快捷键** | **IDE 行为**           | **Chrome 行为**                            |
| ------------------ | -------------- | ---------------------- | ------------------------------------------ |
| Ctrl + n           | ⌘ + n          | 新的无标题文件         | 打开新窗口                                 |
| Ctrl + w           | ⌘ + w          | 关闭编辑器             | 关闭当前标签页                             |
| Ctrl + t           | ⌘ + t          | 展示工作区符号         | 打开新的标签页，并跳转到该标签页           |
| Ctrl + Shift + t   | ⌘ + Shift + t  | 重新打开已关闭的编辑器 | 按标签页的关闭顺序重新打开先前关闭的标签页 |
| Ctrl + Shift + w   | ⌘ + Shift + w  | 关闭当前标签页         | 关闭当前窗口                               |

> 参考 [Chrome 快捷键 ](https://support.google.com/chrome/answer/157179?co=GENIE.Platform%3DDesktop&hl=zh-Hans#zippy=%2C标签页和窗口快捷键)和 [VS Code 快捷键](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
