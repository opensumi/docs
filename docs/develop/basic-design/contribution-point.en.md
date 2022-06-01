---
id: contribution-point
title: Contribution Point Mechanism
slug: contribution-point
order: 5
---

The concept of contribution point comes from a design philosophy in VS Code. By defining a basic contribution point, we can fully implement a capability and spread out the contribution point files for each submodule.  

## Samples

<<<<<<< HEAD
Due to plenty of hot keys in IDE, if a module wants to register a shortcut, it can depend on the shortcut module directly. While if the shortcut module wants to register a command, it will depend on the command module and other logical modules, which in turn makes the connection of these modules difficult to sustain. 

With the `contribution point` mechanism, you can just execute the logic of the `contribution point` mechanism in the public module, and don't need to concern about the implementation details of specific shortcut keys, as shown in the figure:
=======
Since there are plenty of hot keys in IDE, if a module wants to register a shortcut, it can depend on the shortcut module directly, but if the shortcut module wants to register a command, it will depend on the command module and other logical modules, which in turn makes these modules' connection difficult to sustain. 

With the `contribution point` mechanism, we can just execute the logic of the `contribution point` mechanism in the public module, and don't need to pay attention to the implementation details of specific shortcut keys, as shown in the figure:
>>>>>>> origin/main

![Example](https://img.alicdn.com/imgextra/i1/O1CN0106jNQW1fyOfEae2Hd_!!6000000004075-2-tps-2146-1048.png)

## Frequently-used Contribution Points

<<<<<<< HEAD
Usually when using contribution points to run corresponding functions, you need to declare them inside the module and bring them into the integration side to take effect. The following is a basic declaration.  
=======
Usually when we use contribution points to run corresponding functions, we need to declare them inside the module and bring them into the integration side to take effect. The basic declaration is as follows:  
>>>>>>> origin/main

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

<<<<<<< HEAD
Following cases will not repeat the way to introduce a contribution point file. 

### Lifecyle

To perform some given logic during the lanuch of application [Lifecyle](./lifecycle), you can use the `ClientAppContribution` contribution point to mount different "hook" functions during the applicationlifecycle to perform specific logic operations, just as follows:  
=======
The method of introducing a contribution point file will not be repeatly stated in following cases.

### Lifecyle

If you want to perform some given logic during the lanuch of application's [Lifecyle](./lifecycle), you can use the `ClientAppContribution` contribution point to mount different "hook" functions during the application's lifecycle to perform specific logic operations, just as follows:  
>>>>>>> origin/main

```ts
import { Domain, ClientAppContribution } from '@opensumi/ide-core-browser';

@Domain(ClientAppContribution)
export class DemoContribution implements ClientAppContribution {
  initialize() {
    // This function is executed during initialization phase
  }

  onStart() {
    // This function is executed during application startup phase
  }

  onDidStart() {
    // This function is executed during most module startup completion phases
  }

  onWillStop() {
    // This function is executed just before the application is to shut down. If returned "true", the shutdown will be interrupted  
  }

  onStop() {
    // This function is executed in shutdown phase
  }

  onDisposeSideEffects() {
    // Different from onStop, the latter is only suitable for non-obstructive work  
<<<<<<< HEAD
    // onDisposeEffect is suitable for some long, obstructive tasks, targeting at scenarios where the IDE is gracefully unloaded as a large component  
    // But the onDisposeEffect may block window close under Electron (for example, it takes more than 1s to close)   
=======
    // onDisposeEffect is suitable for some long, obstructive tasks, for scenarios where the IDE is gracefully unloaded as a large component  
    // But the onDisposeEffect may block window closing under Electron (e.g. it takes more than 1s to close)   
>>>>>>> origin/main
  }

  onReconnect() {
    // This function is executed during extension process restart
  }
}
```

### Command Register

<<<<<<< HEAD
The contribution point of command registration is `KeybindingContribution`, through which you can register `Command` as follows:  
=======
The contribution point of command registration is `KeybindingContribution`, through which we can register `Command` as follows:  
>>>>>>> origin/main

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
        label: 'test command'
      },
      {
        execute: () => {
          console.log('test command');
        }
      }
    );
  }
}
```

### Preference Register

The contribution point for preference registration is `PreferenceContribution`, through which we can register `Preference`, just as follows: 

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

<<<<<<< HEAD
For more detailed preference and usage, see [Preference Module](../module-apis/preference)  

### Keybinding Registration

The contribution point of the Keybinding registration is `KeybindingContribution`, through which you can register `Keybinding`, using the following method:  
=======
For more detailed preference and usage, please refer to [Preference Module](../module-apis/preference)  

### Keybinding Register

The contribution point of the Keybinding registration is`KeybindingContribution`, through which we can register `Keybinding`, using the following method:  
>>>>>>> origin/main

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

<<<<<<< HEAD
The contribution point of right click registration is `MenuContribution`. you can register `Menu` through this contribution point as follows: 
=======
The contribution point of right click registration is `MenuContribution`. We can register `Menu` through this contribution point as follows: 
>>>>>>> origin/main

```ts
import {
  Domain,
  MenuContribution,
  IMenuRegistry
} from '@opensumi/ide-core-browser';

@Domain(MenuContribution)
export class DemoContribution implements MenuContribution {
  registerMenus(menus: IMenuRegistry): void {
    // register a first level menu
    menus.registerMenubarItem(MenuId.DebugBreakpointsContext, {
      label: 'Debug',
      order: 999
    });
    // register an item under the menu
    menuRegistry.registerMenuItem(MenuId.DebugBreakpointsContext, {
      command: 'debug.breakpoint.delete',
      label: 'Delete Breakpoint',
      group: '1_has_breakpoint',
      order: 1
    });

    // Register submenu
    const menuId = 'more';
    const subMenuId = 'more/items';
    // Bind the second-level menu to a first-level menu item
    menuRegistry.registerMenuItem(menuId, {
      submenu: subMenuId,
      label: 'More Settings',
      iconClass: '',
      group: 'more'
    });
    // register submenu contents
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

<<<<<<< HEAD
By default, the framework enrolls totally 53 registered locations in the right menu, as can be seen in the definition of `MenuId` in `@opensumi/ide-core-browser`.  
=======
The framework enrolls a total of 53 registered locations in the right menu by default, as can be seen in the definition of `MenuId` in `@opensumi/ide-core-browser`.  
>>>>>>> origin/main

### User-defined Protocol Files

In OpenSumi, we obtain the corresponding file service through the DI Token of `IFileServiceClient` for file reading and writting. In terms of some scenarioalized file content, we usually employ user-defined protocol header to read such content, for example:  

<<<<<<< HEAD
- To read user configuration files, please use `user_stroage://settings.json` .  
- To read virtual files in Debugging process, please use `debug://{filename}` .  
=======
- To read user configuration files, we use `user_stroage://settings.json` .  
- To read virtual files in Debugging process, we use `debug://{filename}` .  
>>>>>>> origin/main

We have made this function possible by the contribution point of `FsProviderContribution`, just as follows:  

```ts
import {
  Domain,
  FsProviderContribution,
  CommandRegistry
} from '@opensumi/ide-core-browser';

export interface IUserStorageService extends FileSystemProvider {}

export class UserStorageProvider implements IUserStorageService {
  // implement the protocol
}

@Domain(FsProviderContribution)
export class DemoContribution implements FsProviderContribution {
  registerProvider(registry): void {
    registry.registerProvider('user_storage', new UserStorageProvider());
  }
}
```
