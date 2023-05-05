---
id: custom-editor-component
title: Custom Editor Component
slug: custom-editor-component
order: 9
---

In OpenSumi's Browser extension, it is supported to customize the components of the editor area by specifying `scheme`.

This function is similar to VS Code's Webview API, the difference is that we can use a React component to build it.

## register

To register an editor component, you need to provide a custom `scheme`. To open this component, you can use `vscode.commands.executeCommand` to execute `vscode.open`. Note that the execution here requires logic at the plug-in Node layer.

```ts
// browser/index.ts

export const CustomEditor = props => 'custom editor';

export default {
  editor: {
    type: 'add',
    component: [
      {
        id: 'my-custom-editor-component',
        scheme: 'my-custom-editor-component', // should be unique
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

When calling `vscode.commands.executeCommand` to execute the command to open the editor, parameters can be passed in `queryString` of `uri`, and these parameters will be passed in as props of the editor component on the Browser side.

## Special usage

### Get the detailed information and status control of the opened page

After registering the page, you can also open it through the `vscode.window.showTextDocument` interface, which supports more parameter configurations, and you can get detailed editor information. For detailed documents, see [VSCode API - showTextDocument](https ://code.visualstudio.com/api/references/vscode-api), the basic usage is as follows:

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

### close page

Please do not use the `.hide()` method in the above `textEditor` to close the page, this method is deprecated.

![hide](https://img.alicdn.com/imgextra/i1/O1CN01Upwhhm1I5DvRuwckG_!!6000000000841-2-tps-920-303.png)

The correct usage is as follows:

```tsx
vscode.commands.executeCommand('workbench.action.closeActiveEditor');
```

This command is used to close the currently active editor page

### Front-end and back-end communication

When using the editor component, you can also get `sumiExtendService` and `sumiExtendSet` required for front-end and back-end communication from props, such as:

```tsx
export const CustomComponent = (props) => {
  const { sumiExtendService, sumiExtendSet, resource } = props;
  ...
}
```

You can see [Communication Model](../develop/connection-mode) for more detail.
