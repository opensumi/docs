---
id: editor
title: Editor Mode
slug: editor
---

## Basic Concept

The following diagram shows the complete process of opening an editor tab, which can be used to understand the core concepts of the editor module.

![](https://img.alicdn.com/imgextra/i2/O1CN01BRKCnA1kelm2RqRVn_!!6000000004709-2-tps-1448-1058.png)

1. There is a unique WorkbenchEditorService instance in the whole IDE global, which is the global editor management service. When we open an editor, we first call its open method, passing in a corresponding uri, such as file://path/to/fileToOpen.ts

2. To open this uri, we need to convert it into IResource that can be opened in the editor, which will have more information necessary for the editor. This information is provided by the pre-registered `IResourceProvider`.

```typescript
/**
 * Resource
 * A resource represents something that can be opened in the editor area  
 */
export interface IResource<MetaData = any> {
  /**
   * Whether to allow refresh recovery
   */
  supportsRevive?: boolean;

  // Resource Name
  name: string;
  // Resource URI
  uri: URI;
  // Resource icon' class
  icon: string;
  // Resource 'addtional information
  metadata?: MetaData;
  // The resource has been deleted
  deleted?: any;
}
```

3. Once you get the IResource, you can create a new tab on the tab, displaying the corresponding name and icon.
4. In order to display contents in the editor, you also need to know how to open the IResource. KAITIAN editor module supports multiple ways to open a resource, such as .md files with code and live preview. An opening means can be a code editor, diff editor, or an editor's rich components(React). These open methods and rich components need to be registered in the EditorComponentRegistry in advance  

```typescript
// Define how to open a resource 
export interface IEditorOpenType {
  type: 'code' | 'diff' | 'component';

  componentId?: string;

  title?: string;

  readonly?: boolean;

  // Default 0，the bigger ones rank first
  weight?: number;
}
```

5. According to the type that the user selected, the corresponding content is displayed in the body of the editor after related opening method is obtained,, thus opening process of a tab is finished.  

## Extended Editor

### BrowserEditorContribution

All contribution points contributing to the editor module use `BrowserEditorContribution`.

**registerResource**

Used to register resources in `ResourceService` that can be opened in the editor at the right time.

To open a URI in the editor, you first need to register a `ResourceService` that resolves the URI to an editor resource (`IResource`) in `ResourceService`. Its main responsibility is to provide the name, icon, edited status, etc. of the URI when it is displayed on the editor Tab, and the corresponding callback when the Tab is closed, etc.

**registerEditorComponent**

Used to register editor components, open methods, and other functions with `EditorComponentRegistry` at the right time.

The editor resource (`IResource`) corresponding to a uri needs to be able to be displayed in the editor, and one or more open methods need to be registered for it, as well as the React component used for the corresponding open method.

**onDidRestoreState**

When entering the IDE, the editor will try to restore the last opened editor group and the files opened inside the group
When finished, the hook onDidRestoreState will be executed.

**registerEditorFeature**

Used to register `EditorFeatureContribution` with the `IEditorFeatureRegistry` at the right time, to enhance the monaco editor in this way.

### Example

**Sample 1**: Register an editor component for a Uri, e.g. example_scheme://exampleTitle, so that it can be opened within the editor.

```tsx
const ExampleEditorComponent = () => {
  return <div>示例组件内容</div>;
};

@Domain(BrowserEditorContribution)
export class ExampleEditorContribution implements BrowserEditorContribution {
  registerResource(resourceService: ResourceService): void {
    // Register example_scheme that allows you to open it in the editor and set the corresponding tab icon and name
    resourceService.registerResourceProvider({
      scheme: 'example_scheme',
      provideResource: async (
        uri: URI
      ): Promise<IResource<IWelcomeMetaData>> => {
        return {
          uri,
          name: 'Sample Editor Component',
          icon: 'example-icon-class'
        };
      }
    });
  }

  registerEditorComponent(registry: EditorComponentRegistry) {
    // register the component
    registry.registerEditorComponent({
      component: ExampleEditorComponent,
      uid: 'example_scheme_component',
      scheme: 'example_scheme'
    });

    //  Set this component as the default opening method for the example_scheme's resource  
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

**Sample 2** ：Provide additional capabilities to the monaco editor

```ts

@Domain(BrowserEditorContribution)
export class ExampleEditorContribution implements BrowserEditorContribution {

  registerEditorFeature(registry: IEditorFeatureRegistry) {
    registry.registerEditorFeatureContribution({
      contribute: (editor: IEditor) => {
        // The contribute function is called when the editor is created, you can add some features at this time 
        // need to return a disposer，which can be called when the editor instance is destroyed
        return editor.monacoEditor.onDidChangeModel((e) => {
          console.log(e.oldModelUrl?.toString());
        })
      },
  }
}

```

## User Guide

The external module calls the editor module mainly through the class `WorkbenchEditorService`, to perform corresponding operations.  

### Methods

##### `closeAll()`

```js
closeAll(uri?: URI, force?: boolean): Promise<void>;
```

Close All Editors

##### `open()`

```js
open(uri: URI, options?: IResourceOpenOptions): Promise<IOpenResourceResult>;
```

Open the assigned uri

##### `openUris()`

```js
openUris(uri: URI[]): Promise<void>;
```

Open mutilpile uris

##### `saveAll()`

```js
saveAll(includeUntitled?: boolean): Promise<void>;
```

Save All

##### `close()`

```js
close(uri: any, force?: boolean): Promise<void>;
```

Close the specified uri, equal to closeAll with the URI parameter

##### `getAllOpenedUris()`

```js
getAllOpenedUris(): URI[];
```

Get the uri that is currently open

##### `createUntitledResource()`

```js
createUntitledResource(options?: IUntitledOptions): Promise<IOpenResourceResult>;
```

Create a resource to be saved

### Properties

##### `onActiveResourceChange`

```js
onActiveResourceChange: Event<MaybeNull<IResource>>;
```

The current resource has a change event

##### `onCursorChange`

```js
onCursorChange: Event<CursorStatus>;
```

Cursor change event in the current editor

##### `onDidEditorGroupsChanged`

```js
onDidEditorGroupsChanged: Event<void>;
```

The event that the current editorGroup changed

##### `onDidCurrentEditorGroupChanged`

```js
onDidCurrentEditorGroupChanged: Event<IEditorGroup>;
```

The event that the current editorGroup changed

##### `editorGroups`

```js
editorGroups: IEditorGroup[];
```

All editor groups

##### `currentEditor`

```js
currentEditor: IEditor | null;
```

The current editor object

##### `currentResource`

```js
currentResource: MaybeNull<IResource>;
```

Editor resources of the current focus

##### `currentEditorGroup`

```js
currentEditorGroup: IEditorGroup;
```

The current editor groups
