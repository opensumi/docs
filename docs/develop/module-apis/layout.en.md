---
id: layout
title: Layout Module
slug: layout
---

## Basic Concept

The layout module(that is, @OpenSumi/IDE-main-Layout) is responsible for the basic layout of the IDE, dividing the entire window into several areas in the shape of left, main and bottom. We define those areas as slots. After we partition the layout, several large views registered to the slot are consumed through the provided slot renderer component. In special slots such as the left sidebar, a large view(called a view container) also supports registering multiple small subviews, so the final organizational relationship between the entire layout and the React view component is:

![The Organizational Relations Between Layout and View](https://img.alicdn.com/tfs/TB1gXOU3UH1gK0jSZSyXXXtlpXa-1850-990.png)

The views we register will end up inside the view container or sub-views. Each view will be injected with a global DI instance through the ContextProvider, and the instances of each class will be available inside the view through the `useInjectable` method.

## User Guide

### Register a New View

#### Mode 1: Static Declaration

Associate a view to a unique view Token by using `ComponentContribution`, and then declare the Token to the corresponding location:  

```ts
// Associate view information to Tokens
registerComponent(registry: ComponentRegistry) {
  registry.register('@opensumi/ide-debug-console', {
    // Subview ID
    id: DEBUG_CONSOLE_VIEW_ID,
    component: DebugConsoleView,
  }, {
    title: localize('debug.console.panel.title'),
    priority: 8,
    // View container ID
    containerId: DEBUG_CONSOLE_CONTAINER_ID,
    iconClass: getIcon('debug'),
  });
}
// Map token to view slot 
const layoutConfig = {
  [SlotLocation.left]: {modules: ['@opensumi/ide-debug-console']}
}
renderApp({
  layoutConfig,
  // rest code
});
```

#### Mode 2：Dynamic Registration

Register the view by `LayoutService` directly:

```ts
this.layoutService.collectTabbarComponent(
  [
    {
      // Subview ID
      id: CommentPanelId,
      component: CommentsPanel
    }
  ],
  {
    badge: this.panelBadge,
    // View container ID
    containerId: CommentPanelId,
    title: localize('comments').toUpperCase(),
    hidden: false,
    activateKeyBinding: 'ctrlcmd+shift+c',
    ...this.commentsFeatureRegistry.getCommentsPanelOptions()
  },
  'bottom'
);
```

Dynamic registration mode also supports registering subviews to an existing view container:

```ts
// Register the file tree into the resource manager container
this.layoutService.collectViewComponent(
  {
    id: ExplorerResourceViewId,
    name: this.getWorkspaceTitle(),
    weight: 3,
    priority: 9,
    collapsed: false,
    component: FileTree
  },
  ExplorerContainerId
);
```

### Control/Listen for View Changes

After registering a view to a location (currently left, bottom and right) that supports multi-view switching, you can get `TabbarHandler` by using `layoutService.getTabbarHandler(viewOrContainerId: string)`. `TabbarHandler` provides very powerful view control and listening capabilities: 

```ts
interface TabbarHandler {
  /**
   * dispose the entire view panel
   */
  dispose();
  /**
   * dispose subview
   */
  disposeView(viewId: string);
  /**
   * activate the view
   */
  activate();
  /**
   * deactivate the view
   */
  deactivate();
  /**
   * active status of the view
   */
  isActivated();
  /**
   * display current view (as distinct from active)
   */
  show();
  /**
   * hide the current view (as opposed to de-activating it, where the entire view will not be displayed on the tabbar)
   */
  hide();
  /**
   * Set the top title component of the view
   */
  setTitleComponent(Fc: React.ComponentType, props?: object);
  /**
   * set the expansion size of the current view, which will force the panel to expand 
   */
  setSize(size: number);
  /**
   * set the view tab's logo
   */
  setBadge(badge: string);
  /**
   * get the view tab's logo
   */
  getBadge();
  /**
   * set the view TAB icon
   */
  setIconClass(iconClass: string);
  /**
   * whether the current view collapses (different from active, the entire slot position collapses)
   */
  isCollapsed(viewId: string);
  /**
   * collapse view location
   */
  setCollapsed(viewId: string, collapsed: boolean);
  /**
   * toggles the collapse expansion state of a subview
   */
  toggleViews(viewIds: string[], show: boolean);
  /**
   * Update the title of the subview
   */
  updateViewTitle(viewId: string, title: string);
  /**
   * Update the title of the view
   */
  updateTitle(label: string);
  /**
   * disable resize in the sidebar
   */
  setResizeLock(lock?: boolean);
}
```

## Class

### LayoutService

`DI token: IMainLayoutService`

Control services at the top of the layout module.

#### Static Methods

##### `test()`

```js
static test(
  text: string,
  delimiter?: string
): ContentState
```

This is a static method of testing (LayoutService does not have static methods, as an example).

#### Methods

##### `isVisible()`

```js
isVisible(location: string): Boolean
```

Available only in slots that support multiple view registration and collapsible expansion. Import in the Slot location and return the state of whether the view is visible (not collapsed).

##### `toggleSlot()`

```js
toggleSlot(location: string, show?: boolean | undefined, size?: number | undefined): void
```

Only available for Slot with multi-view registration and collapsible expansion. Toggle the collapsed and expanded state of Slot, support to pass `show` parameter for display to specify whether to expand or not, or take the opposite value of current state to switch if not passed; support to pass `size` parameter for display to specify the final expanded size.

The incoming `size` of 0 will be ignored.

##### `getTabbarService()`

```js
getTabbarService(location: string): TabbarService
```
Available only in Slot that supports multi-view registration and collapsible expansion. Pass in the Slot location and return the `TabbarService` instance at the specified location.

##### `getAccordionService()`

```js
getAccordionService(containerId: string): AccordionService
```

Available only for Slots that support multiple sub view rendering. Pass in the Slot location and return the `AccordionService` instance at the specified location.

##### `getTabbarHandler()`

```js
getTabbarHandler(viewOrContainerId: string): TabBarHandler | undefined
```

Available only in slots that support multiple view registration and collapsible expansion. Obtain the view controller corresponding to a view or subview. The controller supports view event monitoring and active expansion.

It is generally recommended to use `TabBarHandler` for active control of view state, rather than the `toggleSlot` API.

###### Example

```js
const handler = layoutService.getTabbarHandler('explorer');
handler.onActivate(() => {
  console.log('explorer tab activated!');
});
handler.activate();
```

##### `collectTabbarComponent()`

```js
collectTabbarComponent(views: View[], options: ViewContainerOptions, side: string): string
```

Available only for Slots that support multi-view registration and can be collapsed and expanded. Register one or more views to the specified Slot (if the specified Slot does not support multiple sub-views, only the first one will be rendered). Support for custom view title component `titleComponent`, which is the top area of the sidebar or the top left area of the bottom bar.

##### `disposeContainer()`

```js
disposeContainer(containerId: string): void
```

Available only in Slot that supports multi-view registration with collapsible expansion. Destroys a registered view panel.

##### `collectViewComponent()`

```js
collectViewComponent(view: View, containerId: string, props: any = {}): string
```

Available only in Slot that supports multi-view rendering. Adding a new sub view panel to a view panel supports passing in custom default props.

##### `replaceViewComponent()`

```js
replaceViewComponent(view: View, props?: any): void
```

Available only in Slot that supports multi-view rendering. Replace an existing sub view, typically used in preloaded scenarios to replace a loaded placeholder view.

##### `disposeViewComponent()`

```js
disposeViewComponent(viewId: string): void
```

Available only in slots that support multiple subview rendering. Destroy a registered subview.  

##### `revealView()`

```js
revealView(viewId: string): void
```

Available only in Slot that supports multi-subview rendering. To make a subview collapsible, note that this method does not guarantee that the view container where the subview is located is visible.

---

### TabbarService

`DI Token: TabbarServiceFactory`

Face the view activation control service of Slot with multi-view registration and collapsible extension

#### Properties

##### `onCurrentChange`

```js
readonly onCurrentChange: Event<{previousId: string; currentId: string}>
```

The event that currently activates a view change

###### Example

```js
tabbarService.onCurrentChange(e => {
  console.log(e.currentId, e.previousId);
});
```

#### Methods

##### `registerContainer()`

```js
registerContainer(containerId: string, componentInfo: ComponentRegistryInfo): IDisposable
```

Register a new view container. Returns a handle to destroy the container and all its side effects.

---

## React Component

### BoxPanel

An elastic layout container component that renders subviews in a certain direction

```ts
type ChildComponent = React.ReactElement<{ flex?: number; defaultSize?: number; id: string; overflow: string; }>;

BoxPanel: React.FC<{
  children?: ChildComponent | ChildComponent[];
  className?: string;
  direction?: Layout.direction;
  flex?: number;
  zIndex?: number
}>
```

### SplitPanel

Layout container component with Resize support

```ts
interface SplitChildProps {
  id: string;
  minSize?: number;
  maxSize?: number;
  minResize?: number;
  flex?: number;
  overflow?: string;
  flexGrow?: number;
  slot?: string;
  noResize?: boolean;
  savedSize?: number;
  defaultSize?: number;
  children?: ChildComponent | ChildComponent[];
}

interface SplitPanelProps extends SplitChildProps {
  className?: string;
  direction?: Layout.direction;
  id: string;
  // setAbsoluteSize ensures that the total width of adjacent nodes remains unchanged
  resizeKeep?: boolean;
  dynamicTarget?: boolean;
  // Control the use of incoming dimensions sum as total dimensions or use dom dimension
  useDomSize?: boolean;
}

SplitPanel: React.FC<SplitPanelProps>
```

### TabRendererBase

#### props

##### `side`

```js
side: string;
```

##### `className`

```js
className?: string;
```

##### `components`

```js
components: ComponentRegistryInfo[];
```

##### `direction`

```js
direction?: Layout.direction;
```

##### `noAccordion`

```js
noAccordion?: boolean;
```

##### `TabbarView`

```js
TabbarView: React.FC<{
  TabView: React.FC<{component: ComponentRegistryInfo}>,
  forbidCollapse?: boolean;
  // Tabbar size (horizontal for width, vertical for height), tab collapsed to change the size with panelBorderSize added
  barSize?: number;
  // Includes the total size of the inner and outer margins of the tab, used to control the overflow hiding logic
  tabSize: number;
  MoreTabView: React.FC,
  panelBorderSize?: number;
  tabClassName?: string;
  className?: string;
  // The position reserved on the tab, used to control the display effect of too many tabs
  margin?: number;
}>;
```

##### `TabpanelView`

```js
TabpanelView: React.FC<{
  PanelView: React.FC<{ component: ComponentRegistryInfo, side: string, titleMenu: IMenu }>;
  // Size of tabPanel (horizontal is the width, vertical is height)
  panelSize?: number;
}>;
```
