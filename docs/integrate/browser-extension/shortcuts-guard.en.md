---
id: shortcuts-guard
title: Shortcuts Guard
slug: shortcuts-guard
order: 1
---

The shortcuts of IDEs developed based on OpenSumi conflict with those of Chrome, which makes the corresponding actions of IDEs unable to take effect. For example, the `Ctrl/Cmd + W` shortcut will close the current browser tab, making IDEs unable to handle this shortcut event. Shortcuts Guard solve the most common used shortcuts conflict.

![popup page](https://gw.alipayobjects.com/zos/antfincdn/WT9eqVueq/9b0b170a-cd32-40ec-9dbf-ea145f6bc800.png)

## Usage

- Go to [the release page](https://github.com/opensumi/shortcuts-guard/releases) of the extension repository or [the Chrome Web Store](https://chrome.google.com/webstore/detail/shortcuts-guard/nephehdkdelkjgiihmhdjpedpoinmpjl?hl=en-US) to get the extension.
- Click the Chrome Extension icon, and then there is a popup page.
- Add a URL which can be a match pattern on the popup page where the extension will guard the IDE shortcuts.
- Click the keyboard icon on the upper right corner of the popup page to go to the shortcut settings page, and then input the conflicting shortcuts.

## Match patterns

Support clicking the pencil button in the new URL input box on the popup page to automatically obtain the match pattern of the current browser page URL into the input box.

### Basic Syntax

```
<url-pattern> := <scheme>://<host><path>
<scheme> := '*' | 'http' | 'https'
<host> := '*' | '*.' <any char except '/' and '*'>+
<path> := '/' <any chars>
```

### Examples

| Pattern                            | What it does                                                                                                                                                                                                         | Examples of matching URLs                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `https://*/*`                      | Matches any URL that uses the `https` scheme                                                                                                                                                                         | https://www.google.com/ https://example.org/foo/bar.html          |
| `https://*/foo*`                   | Matches any URL that uses the `https` scheme, on any host, as long as the path starts with `/foo`                                                                                                                    | https://example.com/foo/bar.html https://www.google.com/foo       |
| `https://*.google.com/foo*bar`     | Matches any URL that uses the `https` scheme, is on a google.com host (such as [www.google.com](http://www.google.com/), docs.google.com, or google.com), as long as the path starts with `/foo` and ends with `bar` | https://www.google.com/foo/baz/bar https://docs.google.com/foobar |
| `https://example.org/foo/bar.html` | Matches the specified URL                                                                                                                                                                                            | https://example.org/foo/bar.html                                  |
| `http://127.0.0.1/*`               | Matches any URL that uses the `http` scheme and is on the host 127.0.0.1                                                                                                                                             | http://127.0.0.1/ http://127.0.0.1/foo/bar.html                   |
| `*://mail.google.com/*`            | Matches any URL that starts with `http://mail.google.com` or `https://mail.google.com`                                                                                                                               | http://mail.google.com/foo/baz/bar https://mail.google.com/foobar |

> Reference [Match patterns - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/match_patterns/)

## Guarded shortcuts

| **Windows Shortcut** | **Mac Shortcut** | **IDE Action**        | **Chrome Action**                                           |
| -------------------- | ---------------- | --------------------- | ----------------------------------------------------------- |
| Ctrl + n             | ⌘ + n            | New file              | Open a new window                                           |
| Ctrl + w             | ⌘ + w            | Close editor          | Close the current tab                                       |
| Ctrl + t             | ⌘ + t            | Show all Symbols      | Open a new tab, and jump to it                              |
| Ctrl + Shift + t     | ⌘ + Shift + t    | Reopen closed editor  | Reopen previously closed tabs in the order they were closed |
| Ctrl + Shift + w     | ⌘ + Shift + w    | Close the current tab | Close the current window                                    |

> Reference [Chrome keyboard shortcuts](https://support.google.com/chrome/answer/157179?hl=en&co=GENIE.Platform%3DDesktop) and [VS Code keyboard shortcuts](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
