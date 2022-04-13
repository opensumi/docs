---
id: custom-readonly-mode
title: 自定义只读模式
slug: custom-readonly-mode
order: 5
---

# 概览
在一些特殊场景中，集成方希望可以在只读的模式下运行，例如 `分享` 功能，被分享的人只能看而不能写、不能使用某些命令、不能进行文件的创建和删除等这类需求。

那么我们可以利用 Opensumi 的自定义模块能力，通过在模块当中禁用掉某些功能和 `Command` 命令来达到只读模式的效果

# 自定义一个 readonly module

首先自定义一个 `ReadonlyModule` 模块
```typescript
@Injectable()
export class ReadonlyModule extends BrowserModule {
  providers = [
    // ... more contribution
    ReadOnlyContribution
  ];
}
```

然后实现一个 `ReadOnlyContribution`，并将其导入到 ReadonlyModule 的 providers
```typescript
@Domain(MenuContribution, CommandContribution, TabBarToolbarContribution)
export class ReadOnlyContribution implements MenuContribution, CommandContribution, TabBarToolbarContribution {
  @Autowired(IMenuRegistry)
  protected menuRegistry: IMenuRegistry;

  static UNREGISTER_COMMAND = new Set([
    // 禁用文件保存
    EDITOR_COMMANDS.SAVE_CURRENT,
    EDITOR_COMMANDS.SAVE_URI,
    EDITOR_COMMANDS.SAVE_ALL,
    // 禁用文件操作
    EDITOR_COMMANDS.NEW_UNTITLED_FILE,
    FILE_COMMANDS.DELETE_FILE,
    FILE_COMMANDS.RENAME_FILE,
    FILE_COMMANDS.NEW_FILE,
    FILE_COMMANDS.NEW_FOLDER,
    FILE_COMMANDS.COPY_FILE,
    FILE_COMMANDS.CUT_FILE,
    FILE_COMMANDS.PASTE_FILE,
  ]);

  registerCommands(commands: CommandRegistry) {
    // 卸载 command 逻辑
    for (const command of ReadOnlyContribution.UNREGISTER_COMMAND) {
      const cmd = typeof command === 'string' ? { id: command } : command;
      commands.unregisterCommand(cmd);
    }
  }

  registerMenus(menuRegistry: IMenuRegistry) {
    // 只读模式下去掉 文件 和 编辑 两个 menu 菜单
    menuRegistry.removeMenubarItem(MenuId.MenubarFileMenu);
    menuRegistry.removeMenubarItem(MenuId.MenubarEditMenu);
  }

  registerToolbarItems(registry: ToolbarRegistry) {
    registry.menuRegistry.removeMenubarItem(FILE_COMMANDS.NEW_FILE.id);
    registry.menuRegistry.removeMenubarItem(FILE_COMMANDS.NEW_FOLDER.id);
  }
}
```

更多的 [`Command`](https://github.com/opensumi/core/blob/main/packages/core-browser/src/common/common.command.ts) 和 [`MenuId`](https://github.com/opensumi/core/blob/08cfc13779d0830fcd8663ca1e9dd4bc92218171/packages/core-browser/src/menu/next/menu-id.ts#L2) 可在源码中查看，只需按照代码所示的位置卸载掉 command 或 menu 即可

# 将模块导入到 ClientApp

最后在实例化 [`ClientApp`](https://github.com/opensumi/ide-startup/blob/a46a78a56b25b17f7f36ddc3f340d1720311559a/src/browser/index.ts#L12) 时，导入到 modules 字段即可

```typescript
new ClientApp({
    modules: [
        // more module
        ReadonlyModule
    ],
    // 还可以在默认配置这里设置 editor.forceReadOnly 为 true
    defaultPreferences: {
        'editor.forceReadOnly': true
    }
})
```
