---
id: custom-editor-component
title: 自定义编辑器组件
slug: custom-editor-component
order: 9
---

在 OpenSumi 的 Browser 插件中，支持通过指定 `scheme` 的方式自定义编辑器区域的组件，这个功能类似 VS Code 的 Webview API，不同之处在于，这里的编辑器组件可以是一个 React 组件的形式。

## 注册

注册一个编辑器组件，需要提供自定义的 `scheme` , 打开这个组件可以使用 `vscode.commands.executeCommand` 执行 `vscode.open`，注意这里执行需要在插件 Node 层逻辑。

```ts
// browser/index.ts

export const CustomEditor = props => 'custom editor';

export default {
  editor: {
    type: 'add',
    component: [
      {
        id: 'my-custom-editor-component',
        scheme: 'my-custom-editor-component', // 建议保持唯一
        panel: CustomEditor,
        tabIconPath: 'path/to/icon.svg'
      }
    ]
  }
};

// node/index.ts

function activate(context) {
  vscode.commands.executeCommand(
    'vscode.open',
    vscode.Uri.parse('my-custom-editor-component://?${args}')
  );
}
```

在调用 `vscode.commands.executeCommand` 执行命令打开编辑器时可以通过 `uri` 的 `queryString` 传入参数，这些参数会作为编辑器组件的 props 在 Browser 侧传入。

## 特殊用法

### 获取信息及状态控制

在注册完页面后，也可通过 `vscode.window.showTextDocument` 接口进行打开操作，已支持更多的参数配置，同时可获取到详细的编辑器信息，详细文档见 [VSCode API - showTextDocument](https://code.visualstudio.com/api/references/vscode-api) , 基础使用如下：

```ts
async function activate(context) {
  const textEditor = await vscode.window.showTextDocument(
    vscode.Uri.parse('my-custom-editor-component://?${args}'),
    {
      preview: false
    }
  );
}
```

### 关闭页面

关闭页面请不要使用上面 `textEditor` 中的 `.hide()` 方法，该方法在后续 API 中已废弃。

![hide](https://img.alicdn.com/imgextra/i1/O1CN01Upwhhm1I5DvRuwckG_!!6000000000841-2-tps-920-303.png)

正确用法如下：

该命令用于关闭当前激活的编辑器页面

```tsx
vscode.commands.executeCommand('workbench.action.closeActiveEditor');
```

### 前后端通信

在使用编辑器组件的时候，你也可以从 props 中获取到前后端通信所需的 `sumiExtendService` 及 `sumiExtendSet`，如：

```tsx
export const CustomComponent = (props) => {
  const { sumiExtendService, sumiExtendSet, resource } = props;
  ...
}
```

详细实现方式可见：[通信模型](../develop/connection-mode)。
