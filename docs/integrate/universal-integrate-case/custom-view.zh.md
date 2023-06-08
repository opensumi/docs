---
id: custom-view
title: 自定义视图
slug: custom-view
order: 3
---

## 概览

OpenSumi 视图基于 `插槽机制` 设计，整个 Layout 本身是一个大的 React 组件，组件会将视图划分为若干个插槽。如 OpenSumi 默认提供的布局组件就会将视图划分为如下图所示的插槽模板：

![默认插槽模板](https://img.alicdn.com/imgextra/i3/O1CN01jVb1Nv1n4XHe0H2wG_!!6000000005036-2-tps-1714-1374.png)

插槽用于组件视图的挂载，每个插槽会消费一个如下数据结构的数据：

```typescript
type ComponentsInfo = Array<{
  views: View[];
  options?: ViewContainerOptions;
}>;
export interface View {
  // 无关选项已被隐藏
  component: React.ComponentType<any>;
}
```

`插槽渲染器` 决定了这个数据的消费方式。默认情况下，视图会从上而下平铺布局。在侧边栏、底部栏位置，插槽渲染器默认为支持折叠展开和切换的 TabBar 组件。除了侧边栏区域会通过手风琴的方式支持多个子视图外，其余位置默认只会消费 views 的第一个视图。

数据的提供方为视图配置 LayoutConfig，其数据结构如下：

```typescript
export const defaultConfig: LayoutConfig = {
  [SlotLocation.top]: {
    modules: ['@opensumi/ide-menu-bar']
  },
  [SlotLocation.left]: {
    modules: [
      '@opensumi/ide-explorer',
      '@opensumi/ide-search',
      '@opensumi/ide-scm',
      '@opensumi/ide-extension-manager',
      '@opensumi/ide-debug'
    ]
  }
};
```

视图的 Token 与真实的 React 组件通过 ComponentContribution 进行注册关联。

```typescript
import { Search } from './search.view';

@Domain(ComponentContribution)
export class SearchContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register('@opensumi/ide-search', [], {
      containerId: SEARCH_CONTAINER_ID,
      iconClass: getIcon('search'),
      title: localize('search.title'),
      component: Search,
      priority: 9
    });
  }
}
```

下面以在 MenuBar 右侧增加一个 ToolBar 组件为例，介绍如何定制 Layout。

![视图效果](https://img.alicdn.com/imgextra/i4/O1CN014ixdVn1OainoMihzF_!!6000000001722-2-tps-1424-882.png)

完整代码案例见：[Custom View](https://github.com/opensumi/opensumi-modue-samples/tree/main/modules/custom-toolbar)

## 视图注册

首先我们需要将 ToolBar 组件进行注册，关联到一个字符串 Token `test-toolbar` 上：

```tsx
export const TestToolbar = () => (
  <div
    style={{
      lineHeight: '35px',
      flex: 1,
      padding: '0 20px',
      textAlign: 'center',
      backgroundColor: 'var(--kt-menubar-background)'
    }}
  >
    I'm a Test ToolBar
  </div>
);
```

```ts
@Domain(ComponentContribution)
export class TestContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'test-toolbar',
      [
        {
          id: 'test-toolbar',
          component: TestToolbar,
          name: '测试'
        }
      ],
      {
        containerId: 'test-toolbar'
      }
    );
  }
}
```

### 底部插槽注册注意事项

如果你使用的是底部插槽 (SlotLocation.bottom), 该插槽的样式为 `overflow: hidden;`，如果你需要实现滚动的页面效果，请使用一层 div 进行包裹并设置 overflow 属性。

```tsx
export const BottomView = () => (
  <div
    style={{
      overflow: auto,
    }}
  >
    <App />
  </div>
);
```

## 视图消费

对于该需求，支持视图的渲染有两种方案：

1. 替换顶部位置的插槽渲染器，支持左右平铺
2. 在布局组件上划出一个新的插槽位置，单独支持 ToolBar 注册

### 定制插槽渲染器

通过 SlotRendererContribution 替换顶部的 SlotRenderer，将默认的上下平铺模式改成横向的 flex 模式：

```ts
export const TopSlotRenderer: (props: {
  className: string;
  components: ComponentRegistryInfo[];
}) => any = ({ className, components }) => {
  const tmp = components.map(item => item.views[0].component!);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {tmp.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  );
};

@Domain(SlotRendererContribution)
export class TestToolbarSlotContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry) {
    registry.registerSlotRenderer(SlotLocation.top, TopSlotRenderer);
  }
}
```

之后在视图配置里将 ToolBar 的视图传入顶部位置即可：

```ts
renderApp({
  ...
  [SlotLocation.top]: {
    modules: ['@opensumi/ide-menu-bar', 'test-toolbar']
  }
  ...
});
```

### 增加插槽位置

增加插槽位置非常简单，只需要将 SlotRenderer 组件放入视图即可，Layout 设计的很灵活，你可以在任意位置插入这个渲染器。在本例中，可以选择在布局组件中增加该位置，或在 MenuBar 视图内增加该位置：

```ts
export function LayoutComponent() {
  return (
    <BoxPanel direction="top-to-bottom">
      <BoxPanel direction="left-to-right">
        <SlotRenderer
          color={colors.menuBarBackground}
          defaultSize={35}
          slot="top"
        />
        // 增加一个 Slot 插槽
        <SlotRenderer
          color={colors.menuBarBackground}
          defaultSize={35}
          slot="customAction"
        />
      </BoxPanel>
    </BoxPanel>
  );
}

// 或在 MenuBar 视图内增加
export const MenuBarMixToolbarAction: React.FC<MenuBarMixToolbarActionProps> = props => {
  return (
    <div className={clx(styles.MenuBarWrapper, props.className)}>
      <MenuBar />
      <SlotRenderer slot="customAction" flex={1} overflow={'initial'} />
    </div>
  );
};
```

增加好插槽位置后，在视图配置里增加对应位置及相应的视图 Token 即可：

```ts
renderApp({
  ...
  customAction: {
    modules: ['test-toolbar']
  }
  ...
});
```

## 扩展阅读

一般情况下，使用上述示例的方式就可以完成常见的布局定制需求支持，但是对于一些需要拖拽改变尺寸功能、视图切换功能的定制场景，直接使用原生 HTML 开始写的话会比较复杂，且交互不一致，OpenSumi 提供了可用于搭建布局的几类基础组件：

- 布局基础组件
  - BoxPanel 组件，普通 Flex 布局组件，支持不同方向的 Flex 布局
  - SplitPanel 组件，支持鼠标拖拽改变尺寸的 BoxPanel
- 插槽渲染器实现组件
  - Accordion 组件，手风琴组件，支持 SplitPanel 的所有能力，同时支持子视图面板的折叠展开控制
  - TabBar 组件，多 Tab 管理组件，支持视图的激活、折叠、展开、切换，支持 Tab 拖拽更换位置
  - TabPanel 组件，Tab 渲染组件，侧边栏为 Panel Title + Accordion，底部栏为普通 React 视图

具体的组件使用方式可以参考组件的类型声明。
