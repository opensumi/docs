---
id: toolbar
title: Toolbar
slug: toolbar
order: 1
---

Toolbar 默认位于 IDE 顶部菜单栏右侧，根据不同集成方的配置，也可以展现为单独的一栏，类似支付宝小程序开发者工具。如下图所示：

![sample1](https://img.alicdn.com/imgextra/i2/O1CN01vZ7d8C1cyS0IU2qtR_!!6000000003669-2-tps-1685-86.png)
![sample2](https://img.alicdn.com/imgextra/i4/O1CN01qSsHwA21oFZktRttG_!!6000000007031-2-tps-1651-87.png)
![sample3](https://img.alicdn.com/imgextra/i2/O1CN01cNra151YvvM7eJw2A_!!6000000003122-2-tps-1529-46.png)

在 `sumi.toolbar` 命名空间内包含 toolbar 相关的 API，可以结合 [Toolbar 贡献点](../contributes/toolbar) 对工具栏进行更细致的控制。

Toolbar 包含三个方法，用于获取或者注册一个 Toolbar Action，如：

```ts
/**
 * 注册一个 select 类型的 Toolbar Action
 * @param contribution IToolbarSelectContribution
 * 返回一个用于操作和响应 toolbar 上对应 select 控件的 handle
 */
export function registerToolbarAction<T>(
  contribution: IToolbarSelectContribution<T>
): Promise<IToolbarSelectActionHandle<T>>;
/**
 * 注册一个 button 类型的 Toolbar action
 * @param contribution IToolbarButtonContribution
 * 返回一个用于操作和响应 toolbar 上对应 button 控件的 handle
 */
export function registerToolbarAction(
  contribution: IToolbarButtonContribution
): Promise<IToolbarButtonActionHandle>;

/**
 * 获得一个 Toolbar action 的 handle， 用于操作和响应 toolbar 上的 button
 * @param id
 */
export function getToolbarActionButtonHandle(
  id: string
): Promise<IToolbarButtonActionHandle>;

/**
 * 获得一个 Toolbar action 的 handle， 用于操作和响应 toolbar 上的 select
 * @param id
 */
export function getToolbarActionSelectHandle<T = any>(
  id: string
): Promise<IToolbarSelectActionHandle<T>>;
```

## registerToolbarAction

使用 `registerToolbarAction` 可以动态注册 Toolbar 元素，与通过 Toolbar 贡献点注册不同的是，贡献点的 Toolbar Action 无论插件是否激活都会展示，而通过 API 仅会在插件激活以后才会真正注册并显示在工具栏。

参数与 Toolbar 贡献点基本一致，基本可以直接将贡献点声明的内容作为参数调用。

```ts
sumi.toolbar.registerToolbarAction({
  type: 'button',
  title: '运行',
  iconPath: './icons/gua.svg',
  id: 'common-start',
  // 使用 mask 方式渲染 svg，前景色为 --activityBar-inactiveForeground
  iconMaskMode: true,
  // 定义按钮的几种状态
  states: {
    // 默认将标题前景色设为红色
    default: {
      titleForeground: '#FF004F'
    },
    // clicked 状态下为灰色
    clicked: {
      titleForeground: '#CCC'
    }
  }
});

sumi.toolbar.registerToolbarAction({
  type: 'select', // 注册一个 select 类型的 toolbar action
  title: '儿童节送什么?',
  description: '儿童节送什么?',
  // 绑定 do-select command
  command: 'do-select',
  id: 'common-select',
  iconMaskMode: false,
  // select 下拉值列表
  options: [
    {
      iconPath: '/icons/gift.svg',
      label: '礼物',
      value: 'gift'
    },
    {
      iconPath: '/icons/book.svg',
      label: '五年高考',
      value: 'book'
    }
  ],
  states: {
    // 默认 state
    default: {
      labelForegroundColor: '#FF004F'
    },
    clicked: {
      labelForegroundColor: '#CCC'
    }
  }
});
```

## getToolbarActionButtonHandle/getToolbarActionSelectHandle

用法上参考 [Toolbar 贡献点](../contributes/toolbar) 文档中的案例。

## 示例仓库

[OpenSumi Extension Sample - Toolbar](https://github.com/opensumi/opensumi-extension-samples/tree/main/toolbar-sample)
