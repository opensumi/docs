---
id: connection-mode
title: 通信模型
slug: connection-mode
order: 0
---

OpenSumi 插件支持 Browser 及 Node 环境下的扩展，一般的我们建议在 Browser 层仅注册视图，在 Node 层编写插件业务逻辑。

## 代码示例

![Click](https://img.alicdn.com/imgextra/i3/O1CN01jgVXs41u6YSrFgIZY_!!6000000005988-2-tps-362-120.png)

考虑以上场景，我希望在点击按钮时弹出一个错误弹窗，这需要在插件 Browser 层声明一个位于左侧区域的按钮，同时在插件 Node 层实现弹出错误的逻辑。

### Borwser 层实现

在 `extend/browser/Leftview.tsx` 下实现组件：

```tsx
// extend/browser/Leftview.tsx
import * as React from 'react';

import { Button } from '@ali/ide-components';

export const Leftview: React.FC<IComponentProps<INodeService>> = ({
  sumiExtendSet,
  sumiExtendService
}) => {
  const defaultTitle = 'Click';
  const [title, setTitle] = useState(defaultTitle);

  function onDidUpdateTitle(val: string) {
    setTitle(defaultTitle + ' ' + val);
  }

  useEffect(() => {
    if (sumiExtendSet) {
      sumiExtendSet.set({
        updateTitle: onDidUpdateTitle
      });
    }
  }, []);
  function handleClick() {
    // sumiExtendService.node 包含一份该插件注册的 API Proxy
    sumiExtendService.node.sayHello();
  }
  return (
    <Button size="small" onClick={handleClick}>
      {Title}
    </Button>
  );
};
```

在 `extend/browser/index.ts` 下导出组件

```typescript
// extend/browser/index.ts
import { Leftview } from './toolbar-button';

export { Leftview };
```

在 `package.json` 中声明组件渲染位置及方式：

```json
// package.json
{
  "kaitianContributes": {
    "browserMain": "./out/browser/index.js",
    "nodeMain": "./out/node/index.js",
    "viewsProxies": ["Leftview"],
    "browserViews": {
      "left": {
        "type": "add",
        "view": [
          {
            "id": "Leftview",
            "icon": "extension"
          }
        ]
      }
    }
  }
}
```

这段代码中，我们声明了一个视图，其渲染位置为左侧边栏位置。

在组件中我们为按钮绑定了一个事件处理函数，点击时调用来自 `props.sumiExtendService.node` 上的方法 (请注意，这是一个插件 Node 层 API 的代理，这段代码并不会直接在 Node 环境中运行)。

同时，我们也在 Browser 层绑定了一个 `updateTitle` 方法，该方法也可以在后续的 Node 层代码中被调用。

### Node 层实现

```typescript
// extend/node/index.ts
import * as sumi from 'sumi'; // sumi node API (extends vscode)

export function activate(context: sumi.ExtensionContext) {
  const { componentProxy, registerExtendModuleService } = context;

  registerExtendModuleService({
    async sayHello() {
      // 调用 Leftview 组件中注册的 `updateTitle` 方法
      await componentProxy.Leftview.updateTitle('Hello sumi Extension');
      sumi.window.showInformationMessage('Hello OpenSumi');
      return 'Hello sumi Extension';
    }
  });
}
```

这段代码中，我们在 `activate` 函数里调用 `registerExtendModuleService` 注册了一个名为 `sayHello` 的方法。

这样既可在 OpenSumi 插件中通过前端调用 Node 层的方法，你也可以将复杂的逻辑封装在 Node 环境的插件里，避免在 UI 插件中运行过多的任务导致界面卡顿。

同时，我们需要在 Node 层也可以通过 `componentProxy` 获取到在前端组件中通过 `sumiExtendSet` 绑定的前端方法。

最终的运行效果如下：

![Preview](https://img.alicdn.com/imgextra/i3/O1CN01rQT5p11bgl4Y5Jiau_!!6000000003495-1-tps-960-518.gif)

## 使用 Command 实现前后端通信

除了上述方式外，也可以使用我们更为熟悉的 `command` 机制来实现前后端通信，command 是 OpenSumi 和 VS Code 中非常重要且常见的一种机制，使用 `registerCommand` 与 `executeCommand` 两个方法来注册与执行命令，OpenSumi 在前端 API 中也提供了 `executeCommand` 方法（为降低复杂度，暂不提供 `registerCommand` 方法）。这样一来，你可以在前端通过 `executeCommand` 来调用 Node 层注册的命令。

```typescript
// Node 环境
import { commands } from 'sumi';

export function activate() {
  commands.regiterCommand('getProjectType', () => {
    //...
  });
}

// 前端环境

import { commands } from 'sumi-browser';

export const MyProjectView = () => {
  const handleGetProjectType = useCallback(() => {
    commands.executeCommand('getProjectType').then(res => {
      //...
    });
  }, []);
  return (
    <div>
      <Button onClick={handleGetProjectType}>Get Project Type</Button>
    </div>
  );
};
```

## 插件间通信

在 VS Code 插件中，通过 `activate` 函数返回一组对象的方式，可以对外暴露 API，对于其他插件，可以通过 `vscode.extensions.getExtension` 来获取到插件实例，并且可以调用这些 API。

如插件 A 在 `activate` 函数中暴露了 `sayHello` 接口

```ts
function activate(context) {
  return {
    sayHello() {
      // 返回 sayHello
      //...
    }
  };
}
```

在插件 B 中就可以这样使用：

```ts
async function activate(context) {
  const exta = vscode.extensions.getExtension('{插件 A 的 ID}'); // 如 `opensumi.a`

  await exta.activate();
  exta.exports.sayHello(); // 调用 sayHello
}
```

在 OpenSumi 插件的 Node 层，同样可以使用这种方式来进行相互调用，而访问 OpenSumi 插件 Node 层的属性名为 `exetndsExports` ，与 VS Code 有所区分。

同样的，在 `extend/node/index.ts` 中的 `activate` 方法返回对象：

```typescript
function activate(context) {
  return {
    sayHello() {
      // 返回 sayHello
      //...
    }
  };
}
```

在另外一个插件就可以这样使用：

```ts
async function activate(context) {
  const exta = sumi.extensions.getExtension('{插件 A 的 ID}'); // 如 `opensumi.a`

  await exta.activate();
  exta.extendExports.sayHello(); // 调用 sayHello
}
```
