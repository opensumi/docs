---
id: contribution-point
title: Contribution Point Mechanism
slug: contribution-point
order: 5
---

The concept of contribution point comes from a design philosophy in VS Code. By defining a basic contribution point, it can implement a full capability and spread out the contribution point files for each submodule.  

## For Instance

Since there are plenty of hot keys in IDE, if a module wants to register a shortcut, it can depend on the shortcut module, but if the shortcut module wants to register a command, it will depend directly on the command module and other logical modules, which in turn make these modules's connection difficult to maintain.

With the `contribution point `mechanism, we can just perform the logic of the `contribution point` mechanism in the public module, and do not need to pay attention to the implementation details of the specific shortcut key. As shown in the figure:  

![Example](https://img.alicdn.com/imgextra/i1/O1CN0106jNQW1fyOfEae2Hd_!!6000000004075-2-tps-2146-1048.png)

## Frequently-used Contribution Points

Usually, when we use contribution points to realize corresponding functions, we need to declare in the module and introduce them into the integration side to take effect. The basic declaration is as follows:  

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

The method of introducing a contribution point file will not be repeatly stated in subsequent cases.

### Lifecyle

If you want to perform some given logic during the lanuch of application's [Lifecyle](./lifecycle), you can use the `ClientAppContribution` contribution point to mount different 'hook' functions during the application's lifecycle to perform specific logic operations, just as follows:  

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

### Command Register

The contribution point of command registration is `KeybindingContribution`, through which we can register 'Command', as follows:  

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

### Preference Register

The contribution point for preference registration is `PreferenceContribution`, through which we can register `Preference (configuration item)`, using the following method: 

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

For more detailed configuration and usage, please refer to [Preference Module](../module-apis/preference)  

### Keybinding Register

The contribution point of the shortcut registration is`KeybindingContribution`, through which we can register 'Keybinding', using the following method:  

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

### Right Menu Contribution

Right-click the contribution point for 'MenuContribution', we can register 'Menu' through this contribution point as follows: 

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

The framework registers a total of 53 registered locations in the right menu by default,, as can be seen in the definition of `MenuId` in  `@opensumi/ide-core-browser`.  

### User-defined Protocol Files

In OpenSumi, we obtain the corresponding file service through the DI Token of  `IFileServiceClient` for file reading and writting. In the face of some scenarioalized file content, we usually adopt the method of user-defined protocol header to realize the reading of such content, for example:  

- To read user configuration files, we use `user_stroage://settings.json` .  
- To read virtual files in Debugging process, we use `debug://{filename}` .  

We have made this function possible by the contribution point of  `FsProviderContribution`, as follows:  

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
