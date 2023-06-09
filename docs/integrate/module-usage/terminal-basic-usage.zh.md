---
id: terminal-basic-usage
title: 如何使用终端
slug: terminal-basic-usage
order: 3
---

我们在实现某些功能的时候需要用到终端模块，比如打开工作空间时帮用户自动安装 node_modules。

OpenSumi 内部通过 `@opensumi/ide-terminal-next` 封装了操作 Terminal 的能力。

现在我们将通过一些例子来带你了解如何使用 Terminal 相关能力。

## 在终端输出 Hello World

在 `browser` 层，我们可以通过 `ITerminalController` 来操作终端。

比如说我们想打开新的终端并在界面上显示出来，我们可以这样做：

```ts
import { ITerminalController } from '@opensumi/ide-terminal-next';
import { CommandContribution } from '@opensumi/ide-core-browser';

@Domain(CommandContribution)
class TerminalContribution implements CommandContribution {
  @Autowired(ITerminalController)
  protected readonly terminalController: ITerminalController;

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  async echoHelloWorld() {
    const client = await this.terminalController.createTerminalWithWidget({
      config: {
        name: 'Something',
        executable: 'bash',
        args: ['-c', 'echo Hello World'],
      },
    });

    client.onOutput(output => {
      console.log(output);
    });
    client.onExit(exit => {
      this.messageService.info(`Terminal exited with code ${exit.code}`);
      client.term.writeln('Terminal exited with code ' + exit.code);
      client.term.writeln('Hello from the other side.');
    });
  }
}
```

这里使用的 `createTerminalWithWidget` 会创建一个终端并在界面上显示出来。

并且整个 bash 会在执行完 `echo Hello World` 之后直接退出。

## 在终端执行 npm install

此外我们也可以启动一个真正的终端，然后通过 `ITerminalClient.sendText` 来发送命令：

```ts
import { ITerminalController } from '@opensumi/ide-terminal-next';
import {
  CommandContribution,
  isWindows,
} from '@opensumi/ide-core-browser';

@Domain(CommandContribution)
class TerminalContribution implements CommandContribution {
  @Autowired(ITerminalController)
  protected readonly terminalController: ITerminalController;

  @Autowired(IMessageService)
  private readonly messageService: IMessageService;

  async installDeps() {
    // 与第一个例子中的 `createTerminalWithWidget` 不同的是，这个命令不会主动在界面上显示终端，且比 `createTerminalWithWidget` 能配置的东西会少一些。
    const client = await this.terminalController.createTerminal({ config: { name: 'Install Dependencies' }})

    await this.terminalController.showTerminalPanel();

    await client.attached.promise;
    const returnChar = isWindows ? '\r\n' : '\n';
    const command = 'npm install' + returnChar;

    await client.sendText(command);
  }
}
```

## 总结

在上面的例子，我们演示了如何创建一个终端并在界面上显示出来，以及如何在终端中执行命令。

我们可以通过 `ITerminalClient.onOutput` 来监听终端的输出，通过 `ITerminalClient.onExit` 来监听终端的退出。
此外 `ITerminalClient` 还有很多其他能力，比如说在终端中查找内容，获取用户选中的内容等等。

你也可以通过 `ITerminalClient.term` 来获取到 xTerm 实例，然后通过 xTerm 的 API 来操作终端。

以上代码可以在 <https://github.com/opensumi/opensumi-module-samples/tree/main/modules/terminal-usage/browser> 中找到。
