---
id: display-list
title: Display List
slug: display-list
order: 4
---

To achieve a list of high performance, we usually need some three-party library to implement it.  In OpenSumi, however, we have built in a number of common components in `@opensumi/ide-components`, and we will show how to render our TodoList list with these components.

## Data Structure

In panels registered by `IMainLayoutService` service, components render with a default `viewState` property, from which you can get the width and height of the entire panel.  

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

## Rendering List

We bring `RecycleList` and `CheckBox`  from `@opensumi/ide-components`, respectively.

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

## Results Show

![List](https://img.alicdn.com/imgextra/i2/O1CN011vAfYR1PVVpp1V4WI_!!6000000001846-2-tps-2738-1810.png)

In the next section, we will further learn how to use DI to work with rich framework services.
