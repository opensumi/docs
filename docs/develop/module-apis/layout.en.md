---
id: layout
title: Layout Module
slug: layout
---

## Basic Concept

The layout module (@OpenSumi/IDE-main-Layout) is responsible for the basic layout of the IDE, dividing the entire window into several areas in the shape of left, main and bottom, which we define as slots. After the layout is partitioned, several large views registered to the slot are consumed through the provided slot renderer component. In special slots such as the left sidebar, a large view (called a view container) can also support registering multiple small sub views. Therefore the final organizational relationship between the entire layout and the React view component is:

![The Organizational Relations Between Layout and View](https://img.alicdn.com/tfs/TB1gXOU3UH1gK0jSZSyXXXtlpXa-1850-990.png)

The views we register will end up inside the view container or sub-views. Each view will be injected with a global DI instance through the ContextProvider, and the instances of each class will be available inside the view through the `useInjectable` method.

## Userage

### Register a new view

#### Mode 1: Static Declaration

Associate a view to a unique view Token via `ComponentContribution`, and then declare the Token to the corresponding location:  

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

#### Mode 2：Dynamic registration

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

### Control/Listen for view changes

After registering a view to a location (currently left, bottom and right) that supports multi-view switching, you can get `TabbarHandler` via `layoutService.getTabbarHandler(viewOrContainerId: string)`. `TabbarHandler` provides very powerful view control and listening capabilities: the

```ts
interface TabbarHandler {
  /**
   * dispose 整个视图面板
   */
  dispose();
  /**
   * dispose 子视图
   */
  disposeView(viewId: string);
  /**
   * 激活该视图
   */
  activate();
  /**
   * 取消激活该视图
   */
  deactivate();
  /**
   * 当前视图激活状态
   */
  isActivated();
  /**
   * 显示当前视图（区别于激活）
   */
  show();
  /**
   * 隐藏当前视图（区别于取消激活，整个视图将不展示在 tabbar 上）
   */
  hide();
  /**
   * 设置视图的顶部标题组件
   */
  setTitleComponent(Fc: React.ComponentType, props?: object);
  /**
   * 设置当前视图的展开尺寸，会强制展开面板
   */
  setSize(size: number);
  /**
   * 设置视图tab的徽标
   */
  setBadge(badge: string);
  /**
   * 获取视图tab的徽标
   */
  getBadge();
  /**
   * 设置视图tab的图标
   */
  setIconClass(iconClass: string);
  /**
   * 当前视图是否折叠（区别于激活，整个slot位置都会折叠）
   */
  isCollapsed(viewId: string);
  /**
   * 折叠视图所在位置
   */
  setCollapsed(viewId: string, collapsed: boolean);
  /**
   * 切换子视图的折叠展开状态
   */
  toggleViews(viewIds: string[], show: boolean);
  /**
   * 更新子视图的标题
   */
  updateViewTitle(viewId: string, title: string);
  /**
   * 更新视图的标题
   */
  updateTitle(label: string);
  /**
   * 禁用侧边栏的resize功能
   */
  setResizeLock(lock?: boolean);
}
```

## 类

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

Available only in Slot that supports multi-view rendering. Replaces an existing sub view, typically used in preloaded scenarios to replace a loaded placeholder view.

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
  // Control the use of sum of incoming dimensions as total dimensions or use dom dimensions
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
  // Size of tabPanel (horizontal for width, vertical for height)
  panelSize?: number;
}>;
```
