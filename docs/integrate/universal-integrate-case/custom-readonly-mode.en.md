---
id: custom-readonly-mode
title: Custom Read-only Mode
slug: custom-readonly-mode
order: 7
---

## Overview

In some special scenarios, the integrator wants to be able to run in read-only mode. For example, `sharing` functions enable the receiver read but cannot write, cannot use certain commands, or create and delete files, or other such requirements.

Then we can use OpenSumi custom module capability to enable read-only mode by disabling certain functions and `Command` commands in the module.

## Custom a Readonly Module

First, custom a `ReadonlyModule` module:

```typescript
@Injectable()
export class ReadonlyModule extends BrowserModule {
  providers = [
    // ... more contribution
    ReadOnlyContribution
  ];
}
```

Then, implement `ReadOnlyContribution` and import it into the `ReadonlyModule`'s providers:

```typescript
@Domain(MenuContribution, CommandContribution, TabBarToolbarContribution)
export class ReadOnlyContribution
  implements MenuContribution, CommandContribution, TabBarToolbarContribution {
  @Autowired(IMenuRegistry)
  protected menuRegistry: IMenuRegistry;

  static UNREGISTER_COMMAND = new Set([
    // Disabling file saving
    EDITOR_COMMANDS.SAVE_CURRENT,
    EDITOR_COMMANDS.SAVE_URI,
    EDITOR_COMMANDS.SAVE_ALL,
    // Disabling file operations
    EDITOR_COMMANDS.NEW_UNTITLED_FILE,
    FILE_COMMANDS.DELETE_FILE,
    FILE_COMMANDS.RENAME_FILE,
    FILE_COMMANDS.NEW_FILE,
    FILE_COMMANDS.NEW_FOLDER,
    FILE_COMMANDS.COPY_FILE,
    FILE_COMMANDS.CUT_FILE,
    FILE_COMMANDS.PASTE_FILE
  ]);

  registerCommands(commands: CommandRegistry) {
    // unload command logic
    for (const command of ReadOnlyContribution.UNREGISTER_COMMAND) {
      const cmd = typeof command === 'string' ? { id: command } : command;
      commands.unregisterCommand(cmd);
    }
  }

  registerMenus(menuRegistry: IMenuRegistry) {
    // read-only mode to remove "file" and "edit" two menus
    menuRegistry.removeMenubarItem(MenuId.MenubarFileMenu);
    menuRegistry.removeMenubarItem(MenuId.MenubarEditMenu);
  }

  registerToolbarItems(registry: ToolbarRegistry) {
    registry.menuRegistry.removeMenubarItem(FILE_COMMANDS.NEW_FILE.id);
    registry.menuRegistry.removeMenubarItem(FILE_COMMANDS.NEW_FOLDER.id);
  }
}
```

More [`Command`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/common/common.command.ts) and [`MenuId`](https://github.com/opensumi/core/blob/08cfc13779d0830fcd8663ca1e9dd4bc92218171/packages/core-browser/src/menu/next/menu-id.ts#L2) are available in the source code. You can simply uninstall Command or Menu as shown in the code.    

## Integration Module

Finally, introduce at integration time. Taking the `opensumi/ide-startup` case as an example, when referring [index.ts#L12](https://github.com/opensumi/ide-startup/blob/a46a78a56b25b17f7f36ddc3f340d1720311559a/src/browser/index.ts#L12) , just import it to the modules field.

```typescript
new ClientApp({
  modules: [
    // other modules
    ReadonlyModule
  ],
  //  You can also set editor.forceReadOnly as true in default configurations 
  defaultPreferences: {
    'editor.forceReadOnly': true
  }
});
```

Here you have done a simple read-only mode support.
