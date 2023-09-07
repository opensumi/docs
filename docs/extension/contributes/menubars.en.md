---
id: menubars
title: Menubars
slug: menubars
order: 2
---

> Contribute menu items to the top menu (Menubar) through `sumiContributes`

## View position

The menu located at the top of the overall IDE may differ slightly in the Electron environment.

![Sample](https://img.alicdn.com/imgextra/i4/O1CN01Uwnb991TdzoK9OYAt_!!6000000002406-2-tps-1000-426.png)

## How to register

To add a single item to the menubar, you can register your menubar item through the `sumiContributes` field in `package.json`, with the following data structure:

```typescript
interface IContributedMenubarItem {
  id: string; // As the menu-id of menubar-item, you can contribute menu items here through menus
  title: string; // Display text
  order?: number; // Sorting factor, the smaller the higher the front
}
```

Among them, id and title are required items, and order is an optional item. If not filled, the position will be determined according to the default activation order of the extension.

```json
{
  "sumiContributes": {
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
          "command": "git.commit",
          "group": "0_changes",
          "when": "scmProvider == git"
        }
        ...
      ]
    }
  }
}
```

The final effect of the example is as follows:

![Sample](https://img.alicdn.com/imgextra/i2/O1CN01VLQjCz1iP598hWLQO_!!6000000004404-2-tps-1000-397.png)

For other menu registrations, see: [Menus Contribution Points](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)
