---
id: preference
title: 配置模块
slug: preference
---

Preferences 模块主要用于处理整个 IDE 配置的读取逻辑，常见的配置常见有：颜色主题、图标主题、自动保存等。

## 存储路径

配置文件的目录位置可通过在配置 `AppConfig` 时传入 `userPreferenceDirName` 及 `workspacePreferenceDirName` 分别配置`全局配置`和`工作区配置`的 `settings.json`读取路径。

> 下面我们统一将 `.kaitian` 作为我们默认的配置文件读取路径

对于全局配置，我们一般是从 `~/.kaitian/settings.json` 文件中读取；

针对工作区的配置文件，我们一般是从 `${工作区路径}/.kaitian/settings.json` 文件中读取，但在存在多个工作区存在的`多工作区` 项目，我们则是从 `${工作区名称}.kaitian-workspace` 文件中读取；

## 使用

### 注册新配置

#### 方式一

通过 `VS Code Configuration Contribution` 进行配置注册及声明，见：[Configuration Contribution](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration)。

#### 方式二

通过在模块内进行额外的配置声明，代码如下：

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

将上述的 `DemoContribution` 类在模块声明时引入，便可以在 IDE 环境中注册上新的配置，参考代码：[common.contribution.ts](https://gitlab.alibaba-inc.com/kaitian/ide-framework/blob/336132bd2a867b1c4af0b96e15886dcf7e1073dc/packages/core-browser/src/common/common.contribution.ts)。

### 配置值操作

你可以简单的通过 `PreferenceService` 来进行配置文件的获取及修改，同时监听其变化：

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

## 拓展内容

设置面板模块 `Keymap` 与 `Preference` 模块之间存在一定的依赖及关联关系。

如果你需要让你通过模块引入定义的配置出现在设置面板中，你可以通过 `SettingContribution` 贡献点来定义。

### 案例

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

同时，你也可以通过 `SettingContribution` 配置某个配置值不出现在某个配置环境下，如：

我希望语言配置应该只存在`全局设置`，而不应该在`工作区配置`中出现，则我可以如下编写我的贡献点文件：

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

更多配置说明及拓展，可进一步查看 OpenSumi 源码。
