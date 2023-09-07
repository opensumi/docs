---
id: submenus
title: SubMenus
slug: submenus
order: 3
---

> Contribute submenu items via `sumiContributes`

When you need to register a secondary menu, you can register your menubar item through the `sumiContributes` field in `package.json`, where the data structure is as follows:

```typescript
interface IContributedSubmenuItem {
  id: string; // As the menu-id of submenu-id, you can contribute menu items here through menus
  title: string; // display text
  group?: string;
  icon: {
    light: string;
    dark: string;
  };
}
```

Among them, id, title and icon are required items, and group is an optional item, which is used to define the grouping of the menu.

## Example

Use the below contributes:

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

The registration effect under `tabbar/common/bottom` position in the bottom panel:

![Bottom](https://img.alicdn.com/imgextra/i3/O1CN01yBuGjj1CwS88iXbih_!!6000000000145-2-tps-364-346.png)

Set the registration effect under the position of the button `settings/icon/menu`:

![Settings](https://img.alicdn.com/imgextra/i4/O1CN011kzOGr1fzm26GGINk_!!6000000004078-2-tps-400-216.png)

Registration effect under `tabbar/bottom/common` position in the top TabBar area:

![TabBar](https://img.alicdn.com/imgextra/i1/O1CN01smMtJR1krb2T7rYs9_!!6000000004737-0-tps-500-675.jpg)

Actual business application effect (custom registration point):

![Custom](https://img.alicdn.com/imgextra/i1/O1CN0110UjX71G8JELfZ9sT_!!6000000000577-2-tps-710-400.png)

General menu registration, see: [Menus Contribution Points](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)
