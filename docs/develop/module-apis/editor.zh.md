---
id: editor
title: 编辑器模块
slug: editor
---

## 基础概念

下图展示了打开一个编辑器 tab 的完整过程，可用于理解编辑器模块的核心概念：

![](https://img.alicdn.com/imgextra/i2/O1CN01BRKCnA1kelm2RqRVn_!!6000000004709-2-tps-1448-1058.png)

1. 在整个 IDE 全局中，拥有一个唯一的 WorkbenchEditorService 实例，它是全局的编辑器管理服务。我们在打开一个编辑器时，首先要调用它的 open 方法，传入一个对应的 uri，如 file://path/to/fileToOpen.ts

2. 为了打开这个 uri， 我们需要将其转换为一个在编辑器中可打开的 IResource, 它会拥有更多必要的对编辑器的信息。 这些信息由提前注册的 `IResourceProvider` 提供

```typescript
/**
 * Resource
 * 一个资源代表了一个能够在编辑器区域被打开的东西
 */
export interface IResource<MetaData = any> {
  /**
   * 是否允许刷新后恢复
   */
  supportsRevive?: boolean;

  // 资源名称
  name: string;
  // 资源URI
  uri: URI;
  // 资源icon的class
  icon: string;
  // 资源的额外信息
  metadata?: MetaData;
  // 资源已被删除
  deleted?: any;
}
```

3. 获得 IResource 之后，就可以在 tab 上创建新 tab， 展示对应的名称和 icon 了
<<<<<<< HEAD
4. 为了能在编辑器中展示内容，还需要知道如何把这个 IResource 打开。开天的编辑器模块支持一个资源拥有多种打开方式，如 md 文件拥有代码和实时预览的方式。一个打开方式可以是代码编辑器、diff 编辑器，或者是一个编辑器富组件（React 组件）。这些打开方式和富组件都需要提前在 `EditorComponentRegistry` 中进行注册
=======
4. 为了能在编辑器中展示内容，还需要知道如何把这个 IResource 打开。OpenSumi 的编辑器模块支持一个资源拥有多种打开方式，如 md 文件拥有代码和实时预览的方式。一个打开方式可以是代码编辑器、diff 编辑器，或者是一个编辑器富组件（React 组件）。这些打开方式和富组件都需要提前在 `EditorComponentRegistry` 中进行注册
>>>>>>> origin/main

```typescript
// 定义一个resource如何被打开
export interface IEditorOpenType {
  type: 'code' | 'diff' | 'component';

  componentId?: string;

  title?: string;

  readonly?: boolean;

  // 默认0， 大的排在前面
  weight?: number;
}
```

5. 获得对应的打开方式后，根据用户选择的类型将对应的内容展现在编辑器的主体中，这样就完成了一个 tab 的打开过程

## 拓展编辑器

### BrowserEditorContribution

所有向编辑器模块贡献功能的贡献点统一使用 `BrowserEditorContribution`。

**registerResource**

用来在合适的时机向 `ResourceService` 注册可以在编辑器内打开的资源。

为了让一个 uri 能够在编辑器中被打开，首先需要向 `ResourceService` 注册一个用于解析 uri 至一个编辑器资源（`IResource`) 的 `IResourceProvider`。它的主要职责是在这个 uri 在编辑器标签 Tab 上显示时提供它的名称、图标、是否被编辑等状态，以及相应这个 tab 被关闭时的回调等等。

**registerEditorComponent**

用来在合适的时机向 `EditorComponentRegistry` 注册编辑器组件、打开方式等功能。

一个 uri 对应的编辑器资源 (`IResource`) 需要能够在编辑器中展示，还需要为它注册对应的一个或者多个打开方式，以及对应打开方式使用的 React 组件。

**onDidRestoreState**

当进入 IDE 时，编辑器会尝试恢复上一次打开的编辑器组和组内打开的文件，完成后会执行 onDidRestoreState 这个 hook。

**registerEditorFeature**

用来在合适的时机向 `IEditorFeatureRegistry` 注册 `EditorFeatureContribution`，以通过这种方式增强 monaco 编辑器的能力。

### Example

**示例 1** : 为 example_scheme://exampleTitle 这样的 Uri 注册一个编辑器组件，使得它能在编辑器内被打开。

```tsx
const ExampleEditorComponent = () => {
  return <div>示例组件内容</div>;
};

@Domain(BrowserEditorContribution)
export class ExampleEditorContribution implements BrowserEditorContribution {
  registerResource(resourceService: ResourceService): void {
    // 注册example_scheme 可以在编辑器打开，并且设定对应的tab icon 和 名字
    resourceService.registerResourceProvider({
      scheme: 'example_scheme',
      provideResource: async (
        uri: URI
      ): Promise<IResource<IWelcomeMetaData>> => {
        return {
          uri,
          name: '示例编辑器组件',
          icon: 'example-icon-class'
        };
      }
    });
  }

  registerEditorComponent(registry: EditorComponentRegistry) {
    // 将组件进行注册
    registry.registerEditorComponent({
      component: ExampleEditorComponent,
      uid: 'example_scheme_component',
      scheme: 'example_scheme'
    });

    // 将这个组件设置为这个 example_scheme 的 resource 的默认打开方式
    registry.registerEditorComponentResolver(
      'example_scheme',
      (resource, results) => {
        results.push([
          {
            type: 'component',
            componentId: 'example_scheme_component'
          }
        ]);
      }
    );
  }
}
```

**示例 2** ： 为 monaco 编辑器提供额外的能力。

```ts

@Domain(BrowserEditorContribution)
export class ExampleEditorContribution implements BrowserEditorContribution {

  registerEditorFeature(registry: IEditorFeatureRegistry) {
    registry.registerEditorFeatureContribution({
      contribute: (editor: IEditor) => {
        // 在编辑器被创建时，会调用 contribute 这个函数，此时可以添加功能
        // 需要返回一个 disposer，在编辑器实例被销毁的时候调用
        return editor.monacoEditor.onDidChangeModel((e) => {
          console.log(e.oldModelUrl?.toString());
        })
      },
  }
}

```

## 使用

外部模块调用编辑器模块主要通过 `WorkbenchEditorService` 这个 class 来进行对应的操作。

### Methods

##### `closeAll()`

```js
closeAll(uri?: URI, force?: boolean): Promise<void>;
```

关闭全部编辑器

##### `open()`

```js
open(uri: URI, options?: IResourceOpenOptions): Promise<IOpenResourceResult>;
```

打开指定的 uri

##### `openUris()`

```js
openUris(uri: URI[]): Promise<void>;
```

打开多个 uri

##### `saveAll()`

```js
saveAll(includeUntitled?: boolean): Promise<void>;
```

保存全部

##### `close()`

```js
close(uri: any, force?: boolean): Promise<void>;
```

关闭指定的 uri， 等同于 closeAll 带 uri 参数

##### `getAllOpenedUris()`

```js
getAllOpenedUris(): URI[];
```

获得当前打开的 uri

##### `createUntitledResource()`

```js
createUntitledResource(options?: IUntitledOptions): Promise<IOpenResourceResult>;
```

创建一个待保存的资源

### Properties

##### `onActiveResourceChange`

```js
onActiveResourceChange: Event<MaybeNull<IResource>>;
```

当前 resource 发生变更事件

##### `onCursorChange`

```js
onCursorChange: Event<CursorStatus>;
```

当前编辑器内光标变化事件

##### `onDidEditorGroupsChanged`

```js
onDidEditorGroupsChanged: Event<void>;
```

编辑器组发生改变时的事件

##### `onDidCurrentEditorGroupChanged`

```js
onDidCurrentEditorGroupChanged: Event<IEditorGroup>;
```

当前 editorGroup 发生改变的事件

##### `editorGroups`

```js
editorGroups: IEditorGroup[];
```

所有的编辑器组

##### `currentEditor`

```js
currentEditor: IEditor | null;
```

当前的编辑器对象

##### `currentResource`

```js
currentResource: MaybeNull<IResource>;
```

当前焦点的编辑器资源

##### `currentEditorGroup`

```js
currentEditorGroup: IEditorGroup;
```

当前的编辑器组
