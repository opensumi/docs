---
id: layout
title: 布局模块
slug: layout
---

## 基础概念

布局模块（即 @opensumi/ide-main-layout）负责 IDE 的基础布局划分，将整个窗口划分为形如 left、main、bottom 的若干块区域，我们定义这种区域为插槽。在布局划分之后，又通过提供的插槽渲染器组件来消费注册到插槽的若干个大视图。在如左侧边栏这类特殊的插槽中，一个大的视图（称为视图容器）还可以支持注册多个小的子视图。所以最终整个布局和 React 视图组件的一个组织关系为：

![布局与视图的组织关系](https://img.alicdn.com/tfs/TB1gXOU3UH1gK0jSZSyXXXtlpXa-1850-990.png)

我们注册的视图最终会落到视图容器或子视图内。每个视图会通过 ContextProvider 注入全局的 DI 实例，视图内通过 `useInjectable` 方法就可以拿到各个类的实例。

## 使用

### 注册新视图

#### 方式一：静态声明

通过 `ComponentContribution` 将视图关联到唯一的视图 Token，再将 Token 声明到对应的位置：

```ts
// 关联视图信息到token
registerComponent(registry: ComponentRegistry) {
  registry.register('@opensumi/ide-debug-console', {
    // 子视图ID
    id: DEBUG_CONSOLE_VIEW_ID,
    component: DebugConsoleView,
  }, {
    title: localize('debug.console.panel.title'),
    priority: 8,
    // 视图容器ID
    containerId: DEBUG_CONSOLE_CONTAINER_ID,
    iconClass: getIcon('debug'),
  });
}
// 映射token到视图Slot
const layoutConfig = {
  [SlotLocation.left]: {modules: ['@opensumi/ide-debug-console']}
}
renderApp({
  layoutConfig,
  // rest code
});
```

#### 方式二：动态注册

直接通过 `LayoutService` 注册视图：

```ts
this.layoutService.collectTabbarComponent(
  [
    {
      // 子视图ID
      id: CommentPanelId,
      component: CommentsPanel
    }
  ],
  {
    badge: this.panelBadge,
    // 视图容器ID
    containerId: CommentPanelId,
    title: localize('comments').toUpperCase(),
    hidden: false,
    activateKeyBinding: 'ctrlcmd+shift+c',
    ...this.commentsFeatureRegistry.getCommentsPanelOptions()
  },
  'bottom'
);
```

动态注册方式还支持注册子视图到已有的视图容器内：

```ts
// 注册文件树到资源管理器容器内
this.layoutService.collectViewComponent(
  {
    id: ExplorerResourceViewId,
    name: this.getWorkspaceTitle(),
    weight: 3,
    priority: 9,
    collapsed: false,
    component: FileTree
  },
  EXPLORER_CONTAINER_ID
);
```

### 控制/监听视图变化

视图注册到支持多视图切换的位置后（目前为左侧、底部和右侧），可以通过 `layoutService.getTabbarHandler(viewOrContainerId: string)` 拿到 `TabbarHandler`，`TabbarHandler` 提供了非常强大的视图控制与监听能力：

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

布局模块最上层的控制服务。

#### Methods

##### `isVisible()`

```js
isVisible(location: string): Boolean
```

仅在支持多视图注册、可折叠展开的 Slot 可用。传入 Slot 位置，返回视图是否可见（非折叠状态）的状态。

##### `toggleSlot()`

```js
toggleSlot(location: string, show?: boolean | undefined, size?: number | undefined): void
```

仅在支持多视图注册、可折叠展开的 Slot 可用。切换 Slot 的折叠展开状态，支持显示的传入`show`参数指定是否展开，未传入则取当前状态相反值进行切换；支持显示传入`size`参数指定最终的展开尺寸。

传入的`size`若为 0 会被忽略。

##### `getTabbarService()`

```js
getTabbarService(location: string): TabbarService
```

仅在支持多视图注册、可折叠展开的 Slot 可用。传入 Slot 位置，返回指定位置的`TabbarService`实例。

##### `getAccordionService()`

```js
getAccordionService(containerId: string): AccordionService
```

仅在支持多子视图渲染的 Slot 可用。传入 Slot 位置，返回指定位置的`AccordionService`实例。

##### `getTabbarHandler()`

```js
getTabbarHandler(viewOrContainerId: string): TabBarHandler | undefined
```

仅在支持多视图注册、可折叠展开的 Slot 可用。获取视图或子视图对应的视图控制器，控制器支持进行视图事件监听、主动切换展开状态等能力。

一般情况下推荐使用`TabBarHandler`对视图状态进行主动控制，而不是使用`toggleSlot` api。

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

仅在支持多视图注册、可折叠展开的 Slot 可用。往指定 Slot 注册一个或多个视图（若指定 Slot 不支持多个子视图，则只会渲染第一个）。支持自定义视图的标题组件`titleComponent`，标题组件为侧边栏顶部区域或底部栏的左上角区域。

##### `disposeContainer()`

```js
disposeContainer(containerId: string): void
```

仅在支持多视图注册、可折叠展开的 Slot 可用。销毁一个已注册的视图面板。

##### `collectViewComponent()`

```js
collectViewComponent(view: View, containerId: string, props: any = {}): string
```

仅在支持多子视图渲染的 Slot 可用。往一个视图面板内加入新的子视图面板，支持传入自定义的默认 props。

##### `replaceViewComponent()`

```js
replaceViewComponent(view: View, props?: any): void
```

仅在支持多子视图渲染的 Slot 可用。替换一个已存在的子视图，一般用于预加载场景下，替换加载中的占位视图。

##### `disposeViewComponent()`

```js
disposeViewComponent(viewId: string): void
```

仅在支持多子视图渲染的 Slot 可用。销毁一个已经注册的子视图。

##### `revealView()`

```js
revealView(viewId: string): void
```

仅在支持多子视图渲染的 Slot 可用。强制展开一个子视图，注意该方法并不会保证子视图所在的视图容器可见。

---

### TabbarService

`DI Token: TabbarServiceFactory`

面向多视图注册、可折叠展开的 Slot 使用的视图激活控制服务。

#### Properties

##### `onCurrentChange`

```js
readonly onCurrentChange: Event<{previousId: string; currentId: string}>
```

当前激活视图变化的事件。

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

注册一个新的视图容器。返回一个销毁该容器及其所有副作用的句柄。

---

## React 组件

### BoxPanel

弹性布局容器组件，将子视图按照一定的方向进行渲染

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

支持 Resize 的布局容器组件

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
  // setAbsoluteSize 时保证相邻节点总宽度不变
  resizeKeep?: boolean;
  dynamicTarget?: boolean;
  // 控制使用传入尺寸之和作为总尺寸或使用dom尺寸
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
  // tabbar的尺寸（横向为宽，纵向高），tab折叠后为改尺寸加上panelBorderSize
  barSize?: number;
  // 包含tab的内外边距的总尺寸，用于控制溢出隐藏逻辑
  tabSize: number;
  MoreTabView: React.FC,
  panelBorderSize?: number;
  tabClassName?: string;
  className?: string;
  // tab上预留的位置，用来控制tab过多的显示效果
  margin?: number;
}>;
```

##### `TabpanelView`

```js
TabpanelView: React.FC<{
  PanelView: React.FC<{ component: ComponentRegistryInfo, side: string, titleMenu: IMenu }>;
  // tabPanel的尺寸（横向为宽，纵向高）
  panelSize?: number;
}>;
```
