---
id: submenus
title: SubMenus
slug: submenus
order: 3
---

> 通过 `sumiContributes`  贡献 子菜单(submenu) 项

## 如何注册

需要注册二级菜单时，可以通过 `package.json` 中的  `sumiContributes`  字段来注册你的 menubar 项，其中数据结构如下：

```typescript
interface IContributedSubmenuItem {
  id: string; // 作为 submenu-id 的 menu-id, 后续可通过 menus 往这里贡献菜单项
  title: string; // 展示的文案
  group?: string;
  icon: {
    light: string;
    dark: string;
  };
}
```

其中 id 、title 和 icon 是必填项，group 是选填项，用于定义菜单的分组。

### 案例展示

以下面注册为例

```json
{
  "sumiContributes": {
    "submenus": {
      "git_clone_menubar": [
        {
          "id": "my_submenu_1",
          "title": "%command.init%"
        }
      ],
      "tabbar/bottom/common": [
        {
          "id": "my_submenu_2",
          "title": "%command.openRepository%",
          "group": "navigation",
          "icon": {
            "light": "resources/icons/light/git.svg",
            "dark": "resources/icons/dark/git.svg"
          }
        }
      ],
      "settings/icon/menu": [
        {
          "id": "my_submenu_3",
          "title": "%command.openRepository%",
          "group": "navigation"
        }
      ]
    },
    "menubars": [
      {
        "id": "git_clone_menubar",
        "title": "%command.clone%",
        "order": 10
      }
    ],
    "menus": {
      "git_clone_menubar": [
        {
          "command": "git.init",
          "group": "navigation",
          "when": "config.git.enabled && !scmProvider && gitOpenRepositoryCount == 0 && workspaceFolderCount != 0"
        }
      ],
      "my_submenu_1": [
        {
          "command": "git.close",
          "group": "navigation"
        }
      ],
      "my_submenu_2": [
        {
          "command": "git.commit",
          "group": "navigation",
          "when": "scmProvider == git"
        }
      ],
      "my_submenu_3": [
        {
          "command": "git.stageAll",
          "group": "1_modification"
        }
      ]
    }
  }
}
```

底部面板 `tabbar/common/bottom` 位置下的注册效果：

![Bottom](https://img.alicdn.com/imgextra/i3/O1CN01yBuGjj1CwS88iXbih_!!6000000000145-2-tps-364-346.png)

设置按钮 `settings/icon/menu`  位置下的注册效果：

![Settings](https://img.alicdn.com/imgextra/i4/O1CN011kzOGr1fzm26GGINk_!!6000000004078-2-tps-400-216.png)

顶部 TabBar 区域 `tabbar/bottom/common` 位置下的注册效果：

![TabBar](https://img.alicdn.com/imgextra/i1/O1CN01smMtJR1krb2T7rYs9_!!6000000004737-0-tps-500-675.jpg)

实际业务应用效果（自定义注册点）：

![Custom](https://img.alicdn.com/imgextra/i1/O1CN0110UjX71G8JELfZ9sT_!!6000000000577-2-tps-710-400.png)

常规菜单注册，可见：[Menus 贡献点](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)
