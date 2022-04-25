---
id: overlay
title: Overlay Module
slug: overlay
---

Overlay modules are covering modules on the IDE, such as Dialog and Message modules. You can use this module when you need to notify the user of a message from the IDE or when you need a modal dialog box to interact with the user.  

# Message

Message will pop up a prompt in the lower right corner of the IDE.

![message](https://img.alicdn.com/imgextra/i1/O1CN010VHpDr1NuaK6IMhar_!!6000000001630-2-tps-1196-376.png)

## 接口

```ts
export interface IMessageService {
  info(
    message: string | React.ReactNode,
    buttons?: string[],
    closable?: boolean
  ): Promise<string | undefined>;
  warning(
    message: string | React.ReactNode,
    buttons?: string[],
    closable?: boolean
  ): Promise<string | undefined>;
  error(
    message: string | React.ReactNode,
    buttons?: string[],
    closable?: boolean
  ): Promise<string | undefined>;
  open<T = string>(
    message: string | React.ReactNode,
    type: MessageType,
    buttons?: string[],
    closable?: boolean,
    from?: string
  ): Promise<T | undefined>;
  hide<T = string>(value?: T): void;
}
```

## Parameter Description 

The following parameters take info as an example

### message

Message specifies the body of the message, which can be a plain text message or a React component

##### Example

```ts
import { IMessageService } from '@opensumi/ide-overlay';

@Injectable()
export class MessageDemo {
  @Autowired(IMessageService)
  messageService: IMessageService;

  private showMessage() {
    this.messageService.info('复制成功');
  }
}
```

### buttons

Buttons are buttons in the lower right corner of the popup. They are rendered from left to right. After the user selects them, the results are returned  

##### Example

```ts
import { IMessageService } from '@opensumi/ide-overlay';

@Injectable()
export class MessageDemo {
  @Autowired(IMessageService)
  messageService: IMessageService;

  private async showMessage() {
    const res = await this.messageService.info('是否要更新插件', [
      '确定',
      '取消'
    ]);

    if (res === '确定') {
      //...
    }
  }
}
```

### closable

Whether to display the close button. The default is true

## FAQ 

### How long does it take for the message to pop up

- info: 15 秒
- warning: 18 秒
- error: 20 秒

### How do I customize message components

If you don't want to use the default message icon, you can customize the message component by the `open` interface

#### Example

```tsx
export const CustomMessage = () => {
  const messageService = useInjectable(IMessageService);
  return (
    <div>
      <div>这是一个自定义消息</div>
      <button onClick={() => messageService.hide('确定')}>确定</button>
    </div>
  );
};
```

```ts
const res = await this.messageService.open(
  <CustomMessage />,
  MessageType.EMPTY
);

if (res === '确定') {
  //...
}
```

# Dialog

The Dialog interface is consistent with the message, but the popup is modal

![dialog](https://img.alicdn.com/imgextra/i2/O1CN01iiAS2T1DzwnvXSD8C_!!6000000000288-2-tps-1078-390.png)

## Example

```ts
import { IDialogService } from '@opensumi/ide-overlay';

@Injectable()
export class MessageDemo {
  @Autowired(IDialogService)
  dialogService: IDialogService;

  private async showMessage() {
    const res = await this.dialogService.info('这是一个模态弹窗', ['取消', '确定’]);

    if (res === '确定') {
      //...
    }
  }
}
```
