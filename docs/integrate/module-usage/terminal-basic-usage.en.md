---
id: terminal-basic-usage
title: Basic Terminal Usage
slug: terminal-basic-usage
order: 3
---

When implementing certain functions, we need to use the terminal module, such as automatically installing node_modules for users when opening a workspace.

OpenSumi internally encapsulates the ability to operate the terminal through `@opensumi/ide-terminal-next`.

Now we will use some examples to show you how to use the terminal-related capabilities.

## Outputting "Hello World" in the Terminal

In the `browser` layer, we can operate the terminal through `ITerminalController`.

For example, if we want to open a new terminal and display it on the user interface, we can do it like this:

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

Here, `createTerminalWithWidget` is used to create a terminal and display it on the user interface.

After executing `echo Hello World`, the bash will exit directly.

## Executing `npm install` in the Terminal

In addition, we can also start a live terminal and then send commands through `ITerminalClient.sendText`:

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
    // Unlike `createTerminalWithWidget` in the first example,
    // this command will not display the terminal on the user interface by default,
    // and there will be fewer configurations available compared to `createTerminalWithWidget`.
    const client = await this.terminalController.createTerminal({ config: { name: 'Install Dependencies' }})

    await this.terminalController.showTerminalPanel();

    await client.attached.promise;
    const returnChar = isWindows ? '\r\n' : '\n';
    const command = 'npm install' + returnChar;

    await client.sendText(command);
  }
}
```

## Summary

In the above examples, we demonstrated how to create a terminal and display it on the user interface, as well as how to execute commands in the terminal.

We can use `ITerminalClient.onOutput` to listen for the output of the terminal and use `ITerminalClient.onExit` to listen for the exit of the terminal. In addition, `ITerminalClient` has many other capabilities, such as searching for content in the terminal, getting the user's selected content, and so on.

You can also use `ITerminalClient.term` to get the xTerm instance and use the xTerm API to operate the terminal.

The above code can be found at <https://github.com/opensumi/opensumi-module-samples/tree/main/modules/terminal-usage/browser>.
