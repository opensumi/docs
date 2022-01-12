---
id: decoration
title: 装饰器模块
slug: decoration
---

FileDecoration 模块主要用来注册/管理/分发跟文件名相关 `Decoration` 服务。

## 基础概念

Decoration —— 装饰器，主要是用来 “装饰” 文件树样式的一种手段，常见的场景如：Git 项目的特殊装饰：

![git-sample](https://img.alicdn.com/imgextra/i4/O1CN0102WFi9267ik1JKMeC_!!6000000007615-2-tps-1038-824.png)

## 使用

### 注册装饰器

#### `registerDecorationsProvider`

```ts
  registerDecorationsProvider(provider: IDecorationsProvider): IDisposable;
```

注册 DecorationsProvider 的基础数据结构如下：

```ts
interface IDecorationData {
  /**
   * 权重
   */
  readonly weight?: number;
  /**
   * Decoration 颜色
   */
  readonly color?: ColorIdentifier;
  /**
   * Decoration 字符
   */
  readonly letter?: string;
  /**
   * Decoration tooltip
   */
  readonly tooltip?: string;
  /**
   * Decoration 是否冒泡，类似文件的 Decoration 是否传给文件夹
   */
  readonly bubble?: boolean;
}
```

##### 案例

```ts
class SampleDecorationsProvider implements IDecorationsProvider {
  readonly label = 'sample';

  readonly onDidChangeEmitter: Emitter<Uri[]> = new Emitter();

  get onDidChange() {
    return this.onDidChangeEmitter.event;
  }

  provideDecorations(resource: Uri): IDecorationData | undefined {
    if (file.scheme !== 'file') {
      return undefined;
    }

    return {
      letter: '😸',
      color: 'cat.smileForeground',
      tooltip: localize('cat.smile'),
      weight: -1,
      bubble: false
    } as IDecorationData;
  }
}
```

### 监听装饰器变化

#### `onDidChangeDecorations`

```ts
  readonly onDidChangeDecorations: Event<IResourceDecorationChangeEvent>;
```

针对文件名的 Decoration 变更事件进行事件分发

##### 案例

```ts
this.decorationsService.onDidChangeDecorations(() => {
  // some listener
});
```

### 获取文件装饰器

#### `getDecoration`

```ts
getDecoration(uri: Uri, includeChildren: boolean, overwrite?: IDecorationData): IDecoration | undefined;
```

获取 uri 的方式获取当前文件的 Decoration 结果，如果没有获取到则返回 undefined

##### 案例

```ts
this.decorationsService.getDecoration(uri, true);
```
