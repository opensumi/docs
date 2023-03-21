---
id: built-in-component
title: Built-in Component
slug: built-in-component
order: 3
---

OpenSumi has built-in some basic components, which can be imported and used through the `sumi-browser` module when the browser-side plug-in is running.

The current built-in components include:

```bash
├── Badge
├── Button
├── Checkbox
├── Dialog
├── Icon
├── Input
├── Message
├── Notification
├── Overlay
├── Popover
├── RecycleList
├── BasicRecycleTree
├── Scrollbars
├── Select
├── Tabs
├── Tooltip

```

For some usage examples, see: [Use Built-in Components](https://github.com/opensumi/opensumi-module-samples/tree/main/modules/components).

## Other component libraries

You can also continue to use the popular `AntD` component library in the community in OpenSumi, and you only need to import the theme package we provide to use it normally.

- [opensumi/antd-theme](https://github.com/opensumi/antd-theme) - AntD theme package based on OpenSumi

The usage is as follows:

```tsx
import '@opensumi/antd-theme/lib/index.css';
import { ConfigProvider } from 'antd';

// ...
return (
  <ConfigProvider prefixCls="sumi_antd">
    <App />
  </ConfigProvider>
);
```

其他主题库适配期待社区的贡献。

## 自定义适配主题的组件

For developers who do not meet the above schemes, or expect to write their own CSS styles to adapt to the theme, you can refer to the Token table below to use the corresponding CSS Token, such as Token is `kt.disableForeground`, you can pass `var( --kt-disableForeground)` reference.

| Blocks       | Doc                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 主题色板     | [主题色板](https://github.com/opensumi/core/wiki/%E4%B8%BB%E9%A2%98%E8%89%B2%E6%9D%BF)                                               |
| 基础颜色     | [基础颜色](https://github.com/opensumi/core/wiki/%E5%9F%BA%E7%A1%80%E9%A2%9C%E8%89%B2)                                               |
| Button       | [Button 按钮](https://github.com/opensumi/core/wiki/Button-%E6%8C%89%E9%92%AE)                                                       |
| Checkbox     | [Checkbox 多选框](https://github.com/opensumi/core/wiki/Checkbox-%E5%A4%9A%E9%80%89%E6%A1%86)                                        |
| Input        | [Input 输入框](https://github.com/opensumi/core/wiki/Input-%E8%BE%93%E5%85%A5%E6%A1%86)                                              |
| Select       | [Select 选择器](https://github.com/opensumi/core/wiki/Select-%E9%80%89%E6%8B%A9%E5%99%A8)                                            |
| Editor       | [Editor 编辑器](https://github.com/opensumi/core/wiki/Editor-%E7%BC%96%E8%BE%91%E5%99%A8)                                            |
| ActionBar    | [ActionBar 操作组](https://github.com/opensumi/core/wiki/ActionBar-%E6%93%8D%E4%BD%9C%E7%BB%84)                                      |
| ActivityBar  | [ActivityBar 左右侧活动栏](https://github.com/opensumi/core/wiki/ActivityBar-%E5%B7%A6%E5%8F%B3%E4%BE%A7%E6%B4%BB%E5%8A%A8%E6%A0%8F) |
| Bottom Panel | [Bottom Panel 底部面板](https://github.com/opensumi/core/wiki/Bottom-Panel-%E5%BA%95%E9%83%A8%E9%9D%A2%E6%9D%BF)                     |
| Explorer     | [Explorer 资源管理器](https://github.com/opensumi/core/wiki/Explorer-%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86%E5%99%A8)                  |
| Keybinding   | [Keybinding 快捷键页](https://github.com/opensumi/core/wiki/Keybinding-%E5%BF%AB%E6%8D%B7%E9%94%AE%E9%A1%B5)                         |
| MenuBar      | [MenuBar 菜单栏](https://github.com/opensumi/core/wiki/MenuBar-%E8%8F%9C%E5%8D%95%E6%A0%8F)                                          |
| Message      | [Message 全局提示](https://github.com/opensumi/core/wiki/Message-%E5%85%A8%E5%B1%80%E6%8F%90%E7%A4%BA)                               |
| Modal        | [Modal 对话框](https://github.com/opensumi/core/wiki/Modal-%E5%AF%B9%E8%AF%9D%E6%A1%86)                                              |
| Notification | [Notification 通知提醒框](https://github.com/opensumi/core/wiki/Notification-%E9%80%9A%E7%9F%A5%E6%8F%90%E9%86%92%E6%A1%86)          |
| Popover      | [Popover 气泡卡片](https://github.com/opensumi/core/wiki/Popover-%E6%B0%94%E6%B3%A1%E5%8D%A1%E7%89%87)                               |
| SCM          | [SCM 源代码管理](https://github.com/opensumi/core/wiki/SCM-%E6%BA%90%E4%BB%A3%E7%A0%81%E7%AE%A1%E7%90%86)                            |
| Search       | [Search 搜索](https://github.com/opensumi/core/wiki/Search-%E6%90%9C%E7%B4%A2)                                                       |
| Setting      | [Setting 设置页](https://github.com/opensumi/core/wiki/Setting-%E8%AE%BE%E7%BD%AE%E9%A1%B5)                                          |
| Sidebar      | [Sidebar 侧边栏面板](https://github.com/opensumi/core/wiki/Sidebar-%E4%BE%A7%E8%BE%B9%E6%A0%8F%E9%9D%A2%E6%9D%BF)                    |
| StatusBar    | [StatusBar 底部状态栏](https://github.com/opensumi/core/wiki/StatusBar-%E5%BA%95%E9%83%A8%E7%8A%B6%E6%80%81%E6%A0%8F)                |
| Tab          | [Tab 标签页](https://github.com/opensumi/core/wiki/Tab-%E6%A0%87%E7%AD%BE%E9%A1%B5)                                                  |
| ToolBar      | [ToolBar 工具栏](https://github.com/opensumi/core/wiki/ToolBar-%E5%B7%A5%E5%85%B7%E6%A0%8F)                                          |
| Tooltip      | [Tooltip 文字提示](https://github.com/opensumi/core/wiki/Tooltip-%E6%96%87%E5%AD%97%E6%8F%90%E7%A4%BA)                               |

Most custom tokens are usually backward compatible with [Theme Color](https://code.visualstudio.com/api/references/theme-color) of VS Code, and you can also use these tokens directly.

If you feel that the definition of this part of the color value table cannot meet your needs, on the one hand, you can consider providing a PR for OpenSumi to expand it, on the other hand, you can also bypass this part of the limitation by processing it on the integration side To solve, two common methods are introduced below:

### Style customization by ClassName

Customize through the scope of ClassName, such as:

```css
.vs-dark {
  .a {
    color: #fff; // Dark Theme Model, the text will be white
  }
}

.vs {
  .a {
    color: #000; // Light Theme Model, the text will be black
  }
}
```

### Use the `registerColor` method to register a custom token

It should be noted here that it is necessary to ensure that the `registerColor` method is called before the application starts, and it is recommended to introduce it in the `renderApp` phase.

```ts
// The entry file
import './custom-token';
// ...

renderApp({...});
```

```ts
// custom-token.ts
import {
  registerColor,
  ktPrimaryButtonForeground,
  ktPrimaryButtonBackground,
  ktPrimaryButtonClickBackground
} from '@opensumi/ide-theme';
import { localize } from '@opensumi/ide-core-browser';

export const ktToolbarButtonSelectionForeground = registerColor(
  'kt.toolbarButton.selectionForeground',
  {
    dark: ktPrimaryButtonForeground,
    light: ktPrimaryButtonForeground,
    hcDark: null,
    hcLight: null
  },
  localize('Active toolbar button foreground.')
);
export const ktToolbarButtonSelectionBackground = registerColor(
  'kt.toolbarButton.selectionBackground',
  {
    dark: ktPrimaryButtonBackground,
    light: ktPrimaryButtonBackground,
    hcDark: null,
    hcLight: null
  },
  localize('Active toolbar button background.')
);
export const ktToolbarButtonForeground = registerColor(
  'kt.toolbarButton.foreground',
  {
    dark: ktPrimaryButtonForeground,
    light: ktPrimaryButtonForeground,
    hcDark: null,
    hcLight: null
  },
  localize('Default toolbar button foreground.')
);
export const ktToolbarButtonBackground = registerColor(
  'kt.toolbarButton.background',
  {
    dark: ktPrimaryButtonClickBackground,
    light: ktPrimaryButtonClickBackground,
    hcDark: null,
    hcLight: null
  },
  localize('Default toolbar button background.')
);
```

## Use floating components

When writing extensions, we will inevitably use floating windows to allow users to perform secondary interactions. When writing such codes on the OpenSumi Browser side, since the overall solution adopts a sandbox isolation mechanism, the Browser layer in the extension cannot get the top `Document`, so when using components with floating properties such as `Modal`, `Dialog`, `Select` in some libraries, you need to re-bind a rendering container for such components.

Take the `Modal` component in AntD as an example, you need to pass in the rendering container of the current component when using it, otherwise the corresponding component will not work properly.

```tsx
// ...
<Modal title="Basic Modal" getContainer={ref.current}>
  <p>Some contents...</p>
  <p>Some contents...</p>
  <p>Some contents...</p>
</Modal>
```
