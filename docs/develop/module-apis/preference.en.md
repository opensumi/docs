---
id: preference
title: Prefernce Module
slug: preference
---

The Preferences module is used to process the reading logic of the entire IDE configuration, including color theme, icon theme, automatic save, and so on.  

## Storage Paths

The directory location of the configuration file can be read by passing `userPreferenceDirName` and `workspacePreferenceDirName` to `settings.json` when configuring `AppConfig` for `global configuration` and `workspace configuration`, respectively.

> We will use `.sumi` as our default path to read the configuration file 

For global preference, we generally read from the `~/.sumi/settings.json` file.

For workspace configuration files, we generally read them from the `${工作区路径}/.sumi/settings.json` file, but for `multi-workspace` projects where multiple workspaces exist, we read them from the  `${工作区名称}.sumi-workspace` file;

## User Guide

### Register a new configuration  

#### Mode 1

Set configuration registration and declaration via `VS Code Configuration Contribution`, please refer to[Configuration Contribution](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration)。

#### Mode 2

By making additional configuration declarations within the module, the code is as follows:  

```ts
import { PreferenceContribution } from '@opensumi/ide-core-browser';
import { Domain, PreferenceSchema } from '@opensumi/ide-core-common';

export const demoPreferenceSchema: PreferenceSchema = {
  type: 'object',
  properties: {
    'demo.language': {
      type: 'string',
      default: 'typescript',
      description: 'demo language type',
    },
  },
};

@Domain(PreferenceContribution)
export class DemoContribution implements PreferenceContribution {
  public schema: PreferenceSchema = demoPreferenceSchema;
}
```

By introducing the above `DemoContribution` class in the module declaration, you can register the new configuration in the IDE environment, refer to the code: [common.contribution.ts](https://github.com/opensumi/core/blob/v2.13.10/ packages/core-browser/src/common/common.contribution.ts).

### Configuration Value Operation

You can simply get and modify the configuration file via the  `PreferenceService` and listen for changes:

```ts

@Injectable()
export class Demo {

  @Autowired(PreferenceService)
  private preferenceService: PreferenceService;
  ...

  // 监听配置变化事件，记得在界面卸载时调用这里的 `disposable.dispose()` 清理监听函数
  const disposable = this.preferenceService.onPreferencesChanged((changes) => {
    console.log('Preferences Changes: ', changes);
  });

  // 获取全局配置
  this.preferenceService.get('demo.config', PreferenceScope.User);
  // 设置工作区配置
  this.preferenceService.get('demo.config', PreferenceScope.Workspace);

  // 设置全局配置
  this.preferenceService.set('demo.config', true, PreferenceScope.User);
  // 设置工作区配置
  this.preferenceService.set('demo.config', true, PreferenceScope.Workspace);

  ...
}
```

## Content Extended

Setting panel module `Keymap` and`Preference` module have certain dependence and association relationship.  

If you need to have the configuration defined by  introducing a module appeared in the Settings panel, you can define the `SettingContribution` contribution point. 

### Cases

```ts
// 在 `general`  面板追加一个 `demo.language` 配置项的展示
@Domain(SettingContribution)
export class DemoSettingContribution implements SettingContribution {
  handleSettingSections(settingSections: { [key: string]: ISettingSection[] }) {
    return {
      ...settingSections,
      general: [
        {
          preferences: [
            // 原有配置项
            { id: 'general.theme', localized: 'preference.general.theme' },
            { id: 'general.icon', localized: 'preference.general.icon' },
            {
              id: 'general.language',
              localized: 'preference.general.language'
            },
            // 追加配置项
            { id: 'demo.language', localized: 'preference.demo.language' }
          ]
        }
      ]
    };
  }
}
```

At the same time, You can also use a `SettingContribution` to make a configuration value that does not appear in a configuration environment, for example:

I expect the language configuration only exists in `Gobal Settings`and not in`Workspace configuration`, so I can write my contribution point file as follows:

```ts
@Domain(SettingContribution)
export class DemoSettingContribution implements SettingContribution {
  handleSettingSections(settingSections: { [key: string]: ISettingSection[] }) {
    return {
      ...settingSections,
      general: [
        {
          preferences: [
            // 原有配置项
            { id: 'general.theme', localized: 'preference.general.theme' },
            { id: 'general.icon', localized: 'preference.general.icon' },
            {
              id: 'general.language',
              localized: 'preference.general.language',
              hiddenInScope: [PreferenceScope.Workspace]
            }
          ]
        }
      ]
    };
  }
}
```

For more configuration details and extensions, please refer to the OpenSumi source code.
