---
id: built-in-component
title: 内置组件
slug: built-in-component
order: 3
---

OpenSumi 内置了一些基础的组件，在 Browser 端插件运行时可以通过 `sumi-browser` 模块引入这些组件来使用。

目前的内置组件包含：

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

部分使用示例见：[Use Built-in Components](https://github.com/opensumi/opensumi-module-samples/tree/main/modules/components)。

## 其他组件库

你也可以在 OpenSumi 中继续使用社区中流行的 `AntD` 组件库，使用时只需要引入我们提供的主题包即可正常使用。

- [opensumi/antd-theme](https://github.com/opensumi/antd-theme) —— AntD 基于 OpenSumi 的主题包

用法如下：

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

对于不满足以上方案的同学，或者期望自行编写 CSS 样式来适配主题，可以参考下面的 Token 表使用对应的 CSS Token，如 Token 为 `kt.disableForeground`, 在使用时就可以通过 `var(--kt-disableForeground)` 引用。

| 区块         | 文档                                                                                                                                 |
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

大部分自定义 Token 通常会向下兼容到 VS Code 的 [Theme Color](https://code.visualstudio.com/api/references/theme-color)，你也可以直接使用这些 Token。

如果你觉得这部分色值表的定义不能满足你的需求，一方面，你可以考虑为 OpenSumi 提供一个 PR 拓展一下，另一方面，你也可以绕开这部分限制，通过在集成侧处理的方式解决，下面介绍两种常用手段：

### 通过 ClassName 进行样式自定义

通过 ClassName 的作用域进行自定义，如：

```css
.vs-dark {
  .a {
    color: #fff; // 暗色主题下 `.a` 的字体颜色为白色
  }
}

.vs {
  .a {
    color: #000; // 亮色主题下 `.a` 的字体颜色为黑色
  }
}
```

### 使用 `registerColor` 方法注册自定义 Token

这里需要注意的是需要保证 `registerColor` 方法的调用在应用启动前，建议放在 `renderApp` 阶段引入。

```ts
// 入口文件
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

## 使用浮动组件

在编写插件中我们难免会使用浮窗让用户进行二次交互，在 OpenSumi Browser 端中编写这类代码，由于整体方案采用了一种沙箱的隔离机制，插件内的 Browser 层是获取不到顶部的 `Document` 的，故在使用一部分库的 `Modal` 、 `Dialog` 、 `Select` 等带浮动属性的组件时，你需要重新为这类组件绑定一个渲染容器。

以 AntD 中的 `Modal` 组件为例，你在使用时需要传入一下当前组件的渲染容器，否则对应的组件将不能正常工作。

```tsx
// ...
<Modal title="Basic Modal" getContainer={ref.current}>
  <p>Some contents...</p>
  <p>Some contents...</p>
  <p>Some contents...</p>
</Modal>
```
