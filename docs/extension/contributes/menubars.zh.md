---
id: menubars
title: Menubars
slug: menubars
order: 2
---

> 通过 `sumiContributes`  贡献 顶部菜单(Menubar) 菜单项

## 视图位置

位于整体 IDE 顶部区域的菜单，在 Electron 环境下可能略有区别

![Sample](https://img.alicdn.com/imgextra/i4/O1CN01Uwnb991TdzoK9OYAt_!!6000000002406-2-tps-1000-426.png)

## 如何注册

为 menubar 增加单项，可以通过 `package.json` 中的  `sumiContributes`  字段来注册你的 menubar 项，其中数据结构如下：

```typescript
interface IContributedMenubarItem {
  id: string; // 作为 menubar-item 的 menu-id, 后续可通过 menus 往这里贡献菜单项
  title: string; // 展示的文案
  order?: number; // 排序因子, 越小越靠前
}
```

其中 id 和 title 是必填项，order 是选填项，不填则按照插件默认激活顺序决定位置

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

示例最终效果如下：

![Sample](https://img.alicdn.com/imgextra/i2/O1CN01VLQjCz1iP598hWLQO_!!6000000004404-2-tps-1000-397.png)

其余菜单注册，可见：[Menus 贡献点](https://code.visualstudio.com/api/references/contribution-points#contributes.menus)
