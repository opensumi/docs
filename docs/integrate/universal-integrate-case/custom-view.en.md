---
id: custom-view
title: Custom View
slug: custom-view
order: 3
---

## OverView

The OpenSumi view is based on the `slot mechanism` design, where the entire Layout itself is a large React component that divides the view into several slots. For example, the default layout component provided by OpenSumi divides the view into slot templates as shown in the following figure:

![Default slot template](https://img.alicdn.com/imgextra/i3/O1CN01jVb1Nv1n4XHe0H2wG_!!6000000005036-2-tps-1714-1374.png)

Slots are used for the mounting of component views and each slot consumes a data structure as follows.

```typescript
type ComponentsInfo = Array<{
  views: View[];
  options?: ViewContainerOptions;
}>;
export interface View {
  // Irrelevant options have been hidden
  component: React.ComponentType<any>;
}
```

 `Slot renderer` determines how this data is consumed. By default, the view is laid out tiled from top to bottom. In the sidebar and bottom bar. The slot renderer defaults to a TabBar component that supports collapsing and expanding and toggling. Except for the sidebar area which will support multiple sub-views though accordion, other places will only consume the first view of views will be d by default. 

The data provider offers LayoutConfig for the view configuration, whose data structure is as follows:

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

The Token of the view is registered and connected with the real React component through ComponentContribution.

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

The following is an example of how to customize the Layout by adding a ToolBar component to the right side of the MenuBar.

![view effects](https://img.alicdn.com/imgextra/i2/O1CN01GNMkW31ygVtoizfSG_!!6000000006608-2-tps-2880-1750.png)

## View Registration

First we need to register the ToolBar component to connect it to a string Token `test-toolbar`.

```typescript
export const Toolbar = () => (
  <div style={{ lineHeight: '27px' }}>I'm a ToolBar, ToolBar, ToolBar</div>
);

@Domain(ComponentContribution)
export class TestContribution implements ComponentContribution {
  registerComponent(registry: ComponentRegistry) {
    registry.register(
      'test-toolbar',
      [
        {
          id: 'test-toolbar',
          component: Toolbar,
          name: 'Test'
        }
      ],
      {
        containerId: 'test-toolbar'
      }
    );
  }
}
```

## View Consumption

For this demand, there are two options to support the rendering of views.

1. Replace the top slot renderer to support left and right tiling
2. Map out a new slot location on the layout component that supports ToolBar registration alone  

### Custom Slot Renderers

Replace the top SlotRenderer with the SlotRenderer Contribution, changing the default top and bottom tiled mode into a horizontal flex mode:

```typescript
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
export class SampleContribution implements SlotRendererContribution {
  registerRenderer(registry: SlotRendererRegistry) {
    registry.registerSlotRenderer(SlotLocation.top, TopSlotRenderer);
  }
}
```
Then, in the view configuration, import the ToolBar's view to the top place.

```typescript
const layoutConfig = {
  [SlotLocation.top]: {
    modules: ['@opensumi/ide-menu-bar', 'test-ToolBar']
  }
  // rest code
};
renderApp({
  layoutConfig
  // rest code
});
```

### Add a Slot's Position

Adding a slot position is very simple: just put the SlotRenderer component into the view. The Layout is designed to be flexible and you can insert this renderer anywhere. In this case, you can choose to add the position in the Layout component or within the MenuBar view: 

```typescript
// Add to the layout template
export function LayoutComponent() {
  return (
    <BoxPanel direction="top-to-bottom">
      <BoxPanel direction="left-to-right">
        <SlotRenderer
          color={colors.menuBarBackground}
          defaultSize={27}
          slot="top"
        />
        // Add a slot
        <SlotRenderer
          color={colors.menuBarBackground}
          defaultSize={27}
          slot="action"
        />
      </BoxPanel>
      // rest code
    </BoxPanel>
  );
}

// Add to the MenuBar view  
export const MenuBarMixToolbarAction: React.FC<MenuBarMixToolbarActionProps> = props => {
  return (
    <div className={clx(styles.MenuBarWrapper, props.className)}>
      <MenuBar />
      <SlotRenderer slot="action" flex={1} overflow={'initial'} />
    </div>
  );
};
```

After adding the slot location, put on the corresponding location and view Token in the view configuration.

```typescript
const layoutConfig = {
  [SlotLocation.action]: {
    modules: ['test-toolbar']
  }
  // rest code
};
```

## Extended Reading

In general, above method can complete the layout of the common custom needs support, but for some need to drag and change size, view, switching functions of customization scenarios, it would be more complicated to start writing directly with native HTML and the interaction is inconsistent. OpenSumi provides several types of basic components that can be used to build layouts.


- The Layout Basic components
  - BoxPanel，a common Flex layout component that supports Flex layouts in different directions
  - SplitPanel，a class of BoxPanel that Supports mouse drag and drop to change the size
- Slot renderer implementation component
  - Accordion，accordion component，support SplitPanel's all capabilities，as well as the control of folding and expanding subview panels
  - TabBar，a multi-tab management component, supports view activation, folding, expansion, and switching, and supports Tab drag to change position  
  - TabPanel，Tab rendering component. Its sidebar is Panel Title + Accordion. The bottom column is the ordinary React view

For details on how to use components, please refer to the component type declaration.
