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

For workspace configuration files, we generally read them from the `${Workspace name}/.sumi/settings.json` file, but for `multi-workspace` projects where multiple workspaces exist, we read them from the  `${Workspace name}.sumi-workspace` file;

## User Guide

### Register a New Configuration  

#### Mode 1

Set configuration registration and declaration by using `VS Code Configuration Contribution`, please see [Configuration Contribution](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration)。

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

By introducing the above `DemoContribution` class in the module declaration, you can register the new configuration in the IDE environment, see the code: [common.contribution.ts](https://github.com/opensumi/core/blob/v2.13.10/ packages/core-browser/src/common/common.contribution.ts).

### Configuration Value Operation

You can simply get and modify the configuration file via the  `PreferenceService` and listen for changes:

```ts

@Injectable()
export class Demo {

  @Autowired(PreferenceService)
  private preferenceService: PreferenceService;
  ...

  // Listen for configuration change events and remember to call `disposable.dispose()` here to clear the listener function when the interface is unloaded
  const disposable = this.preferenceService.onPreferencesChanged((changes) => {
    console.log('Preferences Changes: ', changes);
  });

  // Obtain global preference
  this.preferenceService.get('demo.config', PreferenceScope.User);
  // Set workspace preference
  this.preferenceService.get('demo.config', PreferenceScope.Workspace);

  // Set global preference
  this.preferenceService.set('demo.config', true, PreferenceScope.User);
  // Set workspace Cpreference
  this.preferenceService.set('demo.config', true, PreferenceScope.Workspace);

  ...
}
```

## Content Extended

Setting panel module `Keymap` and`Preference` module have certain dependence and association relationship.  

If you need to have the configuration defined by introducing a module appeared in the Settings panel, you can define the `SettingContribution` contribution point. 

### Cases

```ts
// Append a display of 'demo.language' configuration items to the 'General' panel  
@Domain(SettingContribution)
export class DemoSettingContribution implements SettingContribution {
  handleSettingSections(settingSections: { [key: string]: ISettingSection[] }) {
    return {
      ...settingSections,
      general: [
        {
          preferences: [
            // Original Preference Items
            { id: 'general.theme', localized: 'preference.general.theme' },
            { id: 'general.icon', localized: 'preference.general.icon' },
            {
              id: 'general.language',
              localized: 'preference.general.language'
            },
            // Add configuration item
            { id: 'demo.language', localized: 'preference.demo.language' }
          ]
        }
      ]
    };
  }
}
```

At the same time, You can also use a `SettingContribution` to make a configuration value that does not appear in a configuration environment, for example:

We expect the language configuration only exists in `Gobal Settings`and not in`Workspace configuration`, so we can write my contribution point file as follows:

```ts
@Domain(SettingContribution)
export class DemoSettingContribution implements SettingContribution {
  handleSettingSections(settingSections: { [key: string]: ISettingSection[] }) {
    return {
      ...settingSections,
      general: [
        {
          preferences: [
            // Original Preference 
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

For more configuration details and extensions, please see the OpenSumi source code.
