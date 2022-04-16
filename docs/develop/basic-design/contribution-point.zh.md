---
id: contribution-point
title: 贡献点机制
slug: contribution-point
order: 5
---

贡献点这一概念源自 VS Code 中的一个设计理念，即通过一个基础的贡献点定义，可以让一个能力的完整实现，分散到各个子模块的贡献点文件之中。

## 举个例子

整个 IDE 内的快捷键是十分多的，如果某个模块希望注册快捷键，直接去依赖快捷键模块，而如果快捷键模块又希望注册命令，又要直接依赖命令模块以及其他逻辑模块，这样一来就会让这些模块之间的关系难以维护。

而通过 `贡献点` 机制，我们就可以在公共模块中只进行 `贡献点` 机制下逻辑的执行，而不需要关注具体快捷键的实现细节。如图所示：

![例子](https://img.alicdn.com/imgextra/i1/O1CN0106jNQW1fyOfEae2Hd_!!6000000004075-2-tps-2146-1048.png)

## 常用贡献点

通常我们在使用贡献点实现相应功能后，需要通过在模块内进行声明，同时在集成侧引入才能生效，基础的声明如下：

```ts
@Injectable()
export class DemoModule extends BrowserModule {
  providers: Provider[] = [
    ...
    DemoContribution,
    ...
  ];

}
```

后续案例不再赘述贡献点文件的引入的方法。

### 生命周期

如果你想在应用启动的 [生命周期](./lifecycle) 阶段执行一些特定逻辑，你可以通过 `ClientAppContribution` 贡献点，在应用的生命周期阶段挂载不同的“钩子”函数进行特定的逻辑操作，使用方法如下：

```ts
import { Domain, ClientAppContribution } from '@opensumi/ide-core-browser';

@Domain(ClientAppContribution)
export class DemoContribution implements ClientAppContribution {
  initialize() {
    // 在初始化阶段执行该函数
  }

  onStart() {
    // 在应用启动阶段执行该函数
  }

  onDidStart() {
    // 在大部分模块启动完成阶段执行该函数
  }

  onWillStop() {
    // 在应用即将关闭前执行该函数，如果返回内容为 true，则关闭的行为将会被中断
  }

  onStop() {
    // 关闭阶段执行
  }

  onDisposeSideEffects() {
    // 与 onStop 不同的是，onStop 仅适用于非阻塞性的工作
    // onDisposeEffect 适用于一些耗时较长的阻塞性任务，适用于将 IDE 作为大组件优雅卸载的场景
    // 但 onDisposeEffect 在 Electron 下可能会阻塞窗口关闭(例如需要1s以上时间关闭)
  }

  onReconnect() {
    // 插件进程重启阶段执行该函数
  }
}
```

### 命令注册

命令注册的贡献点为 `KeybindingContribution` ，我们可以通过该贡献点进行框架 `Command（命令）`的注册，使用方法如下：

```ts
import {
  Domain,
  CommandContribution,
  CommandRegistry
} from '@opensumi/ide-core-browser';

@Domain(CommandContribution)
export class DemoContribution implements CommandContribution {
  registerKeybindings(keybindings: CommandRegistry): void {
    registry.registerCommand(
      {
        id: 'demo.command.test',
        label: '测试命令'
      },
      {
        execute: () => {
          console.log('测试命令');
        }
      }
    );
  }
}
```

### 配置注册

配置注册的贡献点为 `PreferenceContribution` ，我们可以通过该贡献点进行框架 `Preference（配置项）`的注册，使用方法如下：

```ts
import { PreferenceContribution } from '@opensumi/ide-core-browser';
import { Domain, PreferenceSchema } from '@opensumi/ide-core-common';

export const demoPreferenceSchema: PreferenceSchema = {
  type: 'object',
  properties: {
    'demo.language': {
      type: 'string',
      default: 'typescript',
      description: 'demo language type'
    }
  }
};

@Domain(PreferenceContribution)
export class DemoContribution implements PreferenceContribution {
  public schema: PreferenceSchema = demoPreferenceSchema;
}
```

更多详细配置及用法，可参考 [配置模块](../module-apis/preference)

### 快捷键注册

快捷键注册的贡献点为 `KeybindingContribution` ，我们可以通过该贡献点进行框架 `Keybinding（快捷键）`的注册，使用方法如下：

```ts
import {
  Domain,
  KeybindingContribution,
  KeybindingRegistry
} from '@opensumi/ide-core-browser';

@Domain(KeybindingContribution)
export class DemoContribution implements KeybindingContribution {
  registerKeybindings(keybindings: KeybindingRegistry): void {
    keybindings.registerKeybinding({
      command: quickFileOpen.id,
      keybinding: 'ctrlcmd+p'
    });
  }
}
```

### 右键菜单注册

右键注册的贡献点为 `MenuContribution` ，我们可以通过该贡献点进行框架 `Menu（菜单）`的注册，使用方法如下：

```ts
import {
  Domain,
  MenuContribution,
  IMenuRegistry
} from '@opensumi/ide-core-browser';

@Domain(MenuContribution)
export class DemoContribution implements MenuContribution {
  registerMenus(menus: IMenuRegistry): void {
    // 注册一个一级菜单
    menus.registerMenubarItem(MenuId.DebugBreakpointsContext, {
      label: '断点调试',
      order: 999
    });
    // 注册菜单下的一个选项
    menuRegistry.registerMenuItem(MenuId.DebugBreakpointsContext, {
      command: 'debug.breakpoint.delete',
      label: '删除断点',
      group: '1_has_breakpoint',
      order: 1
    });

    // 注册二级菜单
    const menuId = 'more';
    const subMenuId = 'more/items';
    // 绑定二级菜单到一个一级菜单的菜单项中
    menuRegistry.registerMenuItem(menuId, {
      submenu: subMenuId,
      label: '更多设置',
      iconClass: '',
      group: 'more'
    });
    // 注册二级菜单内容
    menuRegistry.registerMenuItems(subMenuId, [
      {
        command: {
          id: 'more.setting',
          label: ''
        }
      }
    ]);
  }
}
```

框架默认注册了共计 53 个右键菜单的注册区位，详细可见 `@opensumi/ide-core-browser` 中的 `MenuId` 定义。

### 自定义协议文件

OpenSumi 中，我们通过 `IFileServiceClient` 的 DI Token 获取到对应的文件服务进行文件读写，在面对一些场景化的文件内容，我们通常会采取自定义协议头的方式，来实现对这类内容的读取，如：

- 用户配置文件，我们使用 `user_stroage://settings.json` 进行读取。
- 调试过程的虚拟文件，我们使用 `debug://{filename}` 进行读取。

实现这块功能，我们便是通过 `FsProviderContribution` 的贡献点去实现的，使用方法如下：

```ts
import {
  Domain,
  FsProviderContribution,
  CommandRegistry
} from '@opensumi/ide-core-browser';

export interface IUserStorageService extends FileSystemProvider {}

export class UserStorageProvider implements IUserStorageService {
  // 实现协议
}

@Domain(FsProviderContribution)
export class DemoContribution implements FsProviderContribution {
  registerProvider(registry): void {
    registry.registerProvider('user_storage', new UserStorageProvider());
  }
}
```
