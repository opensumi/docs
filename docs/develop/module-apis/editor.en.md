---
id: editor
title: Editor Mode
slug: editor
---

## Basic Concept

The following diagram shows a complete process to open an editor tab, which can help to understand the core concepts of the editor module.

![](https://img.alicdn.com/imgextra/i2/O1CN01BRKCnA1kelm2RqRVn_!!6000000004709-2-tps-1448-1058.png)

1. The global IDE possesses a unique WorkbenchEditorService instance. The latter is the global editor management service. When we open an editor, we first call its open method and import a corresponding uri, for example, file://path/to/fileToOpen.ts.

2. To open this uri, we need to convert it into IResource that can be opened in the editor. It will contain more information necessary for the editor. This information is provided by the pre-registered `IResourceProvider`.

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
  // The class of resource icon
  icon: string;
  // Addtional information of Resource 
  metadata?: MetaData;
  // The resource has been removed
  deleted?: any;
}
```

3. Once you get the IResource, you can create a new tab on tab, showing the corresponding name and icon.
4. To display contents in the editor, you also need to know how to open the IResource. KAITIAN editor module supports multiple ways to open a resource, for example, .md files with code and real-time preview. An opening means can be a code editor, diff editor, or an editor's rich components(React component). You need to register these open methods and rich components in EditorComponentRegistry in advance.

```typescript
// Define how to open a resource 
export interface IEditorOpenType {
  type: 'code' | 'diff' | 'component';

  componentId?: string;

  title?: string;

  readonly?: boolean;

  // Default 0，bigger ones rank first
  weight?: number;
}
```

5. After you obtained related opening method, the corresponding content appears in the editor body according to the user selected type, therefore completing the opening process of a tab. 

## Extend the Editor

### BrowserEditorContribution

Contribution points that offer features to the editor module use `BrowserEditorContribution`.

**registerResource**

It is used to register resources in `ResourceService` that can be opened in the editor at the right time.

To open a URI in the editor, first you need to register a `IResourceProvider` in `ResourceService`. `IResourceProvider` resolves the URI to an editor resource (`IResource`) . When it is displayed on the editor Tab, its main duty is to diplay URI status including name, icon, edited status, as well as the corresponding callback when the tab is closed.

**registerEditorComponent**

It is used to register editor components, open methods, and other features in `EditorComponentRegistry` at the right time.

editor resource(`IResource`) corresponding to a uri needs to be able to show in the editor, and one or more openning methods need to be registered for it, as well as the React component used for the corresponding open method.

**onDidRestoreState**

When entering the IDE, the editor will try to restore the last opened editor group and the files opened inside the group
When finished, the hook onDidRestoreState will be executed.

**registerEditorFeature**

It is used to register `EditorFeatureContribution` with the `IEditorFeatureRegistry` at the right time, to enhance the monaco editor in this way.

### Example

**Sample 1**: Register an editor component for a Uri, e.g. example_scheme://exampleTitle, so that it can be opened within the editor.

```tsx
const ExampleEditorComponent = () => {
  return <div>示例组件内容</div>;
};

@Domain(BrowserEditorContribution)
export class ExampleEditorContribution implements BrowserEditorContribution {
  registerResource(resourceService: ResourceService): void {
    // To register example_scheme will allow you to open it in the editor and set related tab icon and name
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
    // Register the component
    registry.registerEditorComponent({
      component: ExampleEditorComponent,
      uid: 'example_scheme_component',
      scheme: 'example_scheme'
    });

    // Set this component as the default opening method for the example_scheme's resource  
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
        // The contribute function is called when the editor is created. You can add some features at this time 
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

The event of current editorGroup changes

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

Editor resources of current focus

##### `currentEditorGroup`

```js
currentEditorGroup: IEditorGroup;
```

The current editor group
