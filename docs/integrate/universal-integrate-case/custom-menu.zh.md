---
id: custom-menu
title: 自定义菜单
slug: custom-menu
order: 2
---

## 注册自定义菜单

注册自定义菜单，常见的有两种模式：

- 注册新的菜单项
- 向已有的菜单项注册子菜单

OpenSumi 提供了自定义菜单能力，基于 OpenSumi 的 [Contribution](../../develop/basic-design/contribution-point) 机制，实现 `MenuContribution` ，调用 `menuRegistry` 提供的方法即可。

```typescript
interface MenuContribution {
  registerMenus?(menus: IMenuRegistry): void;
}

interface IMenuRegistry {
  // 注册新的菜单项
  registerMenubarItem(
    menuId: string,
    item: PartialBy<IMenubarItem, 'id'>
  ): IDisposable;
  // 向已有的菜单项注册子菜单
  registerMenuItem(
    menuId: MenuId | string,
    item: IMenuItem | ISubmenuItem | IInternalComponentMenuItem
  ): IDisposable;
}
```

## 注册新的菜单项

例如我们希望注册一个新的 `终端` 菜单项，并希望它展示在第一项，调用 `registry.registerMenuBarItem`， 同时传入 `order: 0` 表示其定位在第一项。

```typescript
import {
  MenuContribution,
  IMenuRegistry,
  MenuId
} from '@opensumi/ide-core-browser/lib/menu/next';

const terminalMenuBarId = 'menubar/terminal';

@Domain(MenuContribution)
class MyMenusContribution implements MenuContribution {
  registerMenus(registry: IMenuRegistry) {
    registry.registerMenubarItem(terminalMenuBarId, {
      label: '终端',
      order: 0
    });
  }
}
```

![Menu](https://img.alicdn.com/imgextra/i4/O1CN01AMrUFm1E5RVxMZ417_!!6000000000300-2-tps-3808-2414.png)

## 向已有的菜单项注册子菜单

我们将`终端`菜单项注册在了菜单栏的第一项，但它还没有子菜单，点击后没有任何反应，我们需要再为其注册一组子菜单。调用 `registry` 的 `registerMenuItem` 可以注册单个菜单项，也可以使用 `registerMenuItems` 方法来批量注册多个子菜单项。
菜单点击后需要执行某些操作，在这个例子中，我们希望点击后拆分终端，需要为其绑定一个 `Command`，`Command` 也一样可以通过实现 `CommandContribution` 来[自定义](./custom-command)，在这里我们使用内置的 `terminal.split` 命令。

> 注意，当绑定的 Command 在注册时也指定了 `label` 属性时，注册菜单项的 label 默认不会生效

```typescript
registerMenus(registry: IMenuRegistry) {
  registry.registerMenubarItem(terminalMenuBarId, { label: '终端', order: 0 });

  registry.registerMenuItem(terminalMenuBarId, {
    command: 'terminal.split',
    group: '1_split',
  });
}
```

![Split Terminal](https://img.alicdn.com/imgextra/i1/O1CN018sreiD26Jd2EQc1RI_!!6000000007641-2-tps-2409-1510.png)

### 子菜单分组

当注册的菜单较多时，我们可能希望将一些类似操作的子菜单与其他菜单间隔起来，可以使用 `group` 属性来为子菜单分组。具体来说，就是为这些`类似操作`的菜单使用相同的 `group` 值即可。这里我们使用 `registry.registerMenuItems` 来注册更多子菜单。

```typescript
registerMenus(registry: IMenuRegistry) {
  registry.registerMenubarItem(terminalMenuBarId, { label: '终端', order: 0 });

  registry.registerMenuItems(terminalMenuBarId, [
    {
      command: 'terminal.split',
      group: '1_split',
    },
    {
      command: 'terminal.remove',
      group: '2_clear',
    },
    {
      command: 'terminal.clear',
      group: '2_clear',
    },
    {
      command: 'terminal.search',
      group: '3_search',
    },
    {
      command: 'terminal.search.next',
      group: '3_search',
    },
  ]);
}
```

![More MenuItems](https://img.alicdn.com/imgextra/i1/O1CN0142Ey531JAY0aEEurA_!!6000000000988-2-tps-2409-1510.png)

### 注册二级子菜单

对于同类型的菜单，除了使用 `group` 来将它们分组之外，还可以将其注册为`二级子菜单`，当子菜单较多时，使用二级菜单能有效的改善用户体验。例如我们希望将 `搜索` 以及 `搜索下一个匹配项` 都注册为 `搜索` 的二级菜单。

```typescript
const searchSubMenuId = 'terminal/search';

registerMenus(registry: IMenuRegistry) {
  registry.registerMenubarItem(terminalMenuBarId, { label: '终端', order: 0 });

  registry.registerMenuItems(terminalMenuBarId, [
    {
      command: 'terminal.split',
      group: '1_split',
    },
    {
      command: 'terminal.remove',
      group: '2_clear',
    },
    {
      command: 'terminal.clear',
      group: '2_clear',
    },
    {
      label: '搜索',
      group: '3_search',
      submenu: searchSubMenuId,
    },
  ]);

  registry.registerMenuItems(searchSubMenuId, [
    {
      command: 'terminal.search',
    },
    {
      command: 'terminal.search.next',
    },
  ]);

}
```

![submenu](https://img.alicdn.com/imgextra/i3/O1CN01uVgEDb1CnICqwllsD_!!6000000000125-2-tps-2208-1527.png)

## 反注册菜单或者菜单项

OpenSumi 也提供了反注册菜单或者菜单项的功能，如果你不需要界面上的某些按钮，可以反注册掉它们。

core 内部会预先注册了一些菜单，如：帮助；也为这些菜单预先配置了菜单项，如: 帮助 > 切换开发人员工具。

我们在 `IMenuRegistry` 中提供了两个方法: `unregisterMenuId` 和 `unregisterMenuItem`; 前者用来删除某个菜单，后者用来删除某个菜单的菜单项：

```ts
export abstract class IMenuRegistry {
  ...
  abstract unregisterMenuItem(menuId: MenuId | string, menuItemId: string): void;
  abstract unregisterMenuId(menuId: string): IDisposable;
}
```

比如我们想删除帮助菜单项，可以使用：

```ts
import {
  MenuContribution,
  IMenuRegistry,
  MenuId
} from '@opensumi/ide-core-browser/lib/menu/next';

const terminalMenuBarId = 'menubar/terminal';

@Domain(MenuContribution)
class MyMenusContribution implements MenuContribution {
  registerMenus(registry: IMenuRegistry) {
    registry.unregisterMenuId(MenuId.MenubarHelpMenu);
  }
}
```

如果我们想删除帮助菜单中的切换开发人员功能，我们需要先查到这个菜单项的 id，一般来说就是该菜单要执行的 command 的 id:

```ts
import {
  MenuContribution,
  IMenuRegistry,
  MenuId
} from '@opensumi/ide-core-browser/lib/menu/next';

const terminalMenuBarId = 'menubar/terminal';

@Domain(MenuContribution)
class MyMenusContribution implements MenuContribution {
  registerMenus(registry: IMenuRegistry) {
    registry.unregisterMenuItem(MenuId.MenubarHelpMenu, 'electron.toggleDevTools');
  }
}
```

core 内部注册的菜单你可以通过关键字 `registerMenuItem` 搜索到，比如 electron-basic 里注册的菜单项在这儿：[packages/electron-basic/src/browser/index.ts#L159](https://github.com/opensumi/core/blob/36846886d9cbeee47ac17e745576fb0d99f1f423/packages/electron-basic/src/browser/index.ts#L159)
