---
id: layout
title: Layout
slug: layout
order: 4
---

OpenSumi 扩展 API 中包含名为 `layout` 的 namespace，除了直观的 `toggleBottomPanel`、`toggleLeftPanel`、`toggleRightPanel` 等方法之外，可以使用 `getTabbarHandler` 传入特定 Tabbar 面板的 ID 获取一个 handler 对象，用于更精细的控制 Tabbar。

这个 ID 是指插件 UI 侧注册视图的 ID，一般我们可以简单的通过 Dom 结构上找到这些信息，如：

![Debug Console](https://img.alicdn.com/imgextra/i3/O1CN01dMQBzL1I16MUIkxwe_!!6000000000832-2-tps-1566-772.png)

![Explorer](https://img.alicdn.com/imgextra/i4/O1CN01ousv8M26hRlrYpMxj_!!6000000007693-2-tps-1510-1202.png)

## 使用方法

```ts
import * as sumi from 'sumi';

const tabbar = sumi.layout.getTabbarHandler(`explorer`);
tabbar.setSize(500); // 设置面板尺寸
tabbar.activate(); //展开面板
tabbar.deactivate(); // 收起面板
tabbar.setVisible(); // 设置为隐藏状态
tabbar.onActivate(); // 面板展开时的事件
tabbar.onInActivate(); // 面板收起时的事件
tabbar.setIcon(); // 设置对应 Tab 上的图标
tabbar.setTitle(); // 设置对应 Tab 上的文字
tabbar.setBadge('12'); // 设置 Tab 的徽章
```

对于其他插件注册的视图，可以通过 `getExtensionTabbarHandler` 方法获取其实例，使用时需要传入对应插件的 ID，如：

```ts
const tabbar = sumi.layout.getExtensionTabbarHandler('viewId', 'extensionId');
```

如有疑问，欢迎在 Issue 中提问交流 ~
