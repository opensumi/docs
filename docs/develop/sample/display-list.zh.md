---
id: display-list
title: 展示一个列表
slug: display-list
order: 3
---

为了实现一个高性能的列表，我们通常可能需要一些三方库进行实现，而在 OpenSumi 中，我们在 `@opensumi/ide-components` 中内置实现了诸多通用组件，接下来便展示一下如何通过这些组件渲染我们的 TodoList 列表。

## 数据结构

在通过 `IMainLayoutService` 服务注册的面板中，组件渲染时会默认接收一个 `viewState` 属性，你可以从中获取到整个面板的宽高信息。

```ts
export interface ITodo {
  description: string;
  isChecked: boolean;
}

export const Todo = ({
  viewState
}: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;
  const [todos, setTodos] = React.useState<ITodo[]>([
    {
      description: 'First Todo',
      isChecked: true
    }
  ]);
};
```

## 渲染列表

我们分别从 `@opensumi/ide-components` 中引入 `RecycleList` 和 `CheckBox` 组件，组合后完整代码如下：

```ts
import * as React from 'react';
import { ViewState } from '@opensumi/ide-core-browser';
import * as styles from './todo.module.less';
import { RecycleList, CheckBox } from '@opensumi/ide-components';

export interface ITodo {
  description: string;
  isChecked: boolean;
}

export const Todo = ({
  viewState
}: React.PropsWithChildren<{ viewState: ViewState }>) => {
  const { width, height } = viewState;
  const [todos, setTodos] = React.useState<ITodo[]>([
    {
      description: 'First Todo',
      isChecked: true
    }
  ]);

  const template = ({ data, index }: { data: ITodo; index: number }) => {
    const handlerChange = () => {
      const newTodos = todos.slice(0);
      newTodos.splice(index, 1, {
        description: data.description,
        isChecked: !data.isChecked
      });
      setTodos(newTodos);
    };
    return (
      <div className={styles.todo_item} key={`${data.description + index}`}>
        <CheckBox
          checked={data.isChecked}
          onChange={handlerChange}
          label={data.description}
        />
      </div>
    );
  };

  return (
    <RecycleList
      height={height}
      width={width}
      itemHeight={24}
      data={todos}
      template={template}
    />
  );
};
```

## 效果展示

![List](https://img.alicdn.com/imgextra/i2/O1CN011vAfYR1PVVpp1V4WI_!!6000000001846-2-tps-2738-1810.png)

下一节，我们将进一步学习如何使用 DI 来使用丰富的框架服务。
