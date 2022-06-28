---
id: dependence-injector
title: 依赖注入
slug: dependence-injector
order: 4
---

为了让模块开发者能够专注于自己的模块，无需关注其他模块的实现细节，我们使用 [@opensumi/di](https://www.npmjs.com/package/@opensumi/di) 来实现依赖的解耦。

## 使用

在依赖注入的编码模式下，我们如果想使用一个模块内的服务，不再需要依赖其具体实现，而只需要依赖其显示声明的 `Token` 即可。

以在模块中使用弹窗服务能力 `IDialogService` 为例：

```ts
import { IDialogService } from '@opensumi/ide-overlay';

@Injectable()
class DemoService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  run() {
    this.dialogService.info('Hello OpenSumi');
  }
}
```

进一步的，我们还可以通过将部分 `Token` 显示的声明在 `@opensumi/ide-core-browser`、 `@opensumi/ide-core-common`、 `@opensumi/ide-core-node` 中，来实现对服务能力的非直接依赖，减少循环依赖问题。

## 注册自定义服务

在 OpenSumi 框架中，针对 `Browser` 及 `Node` 我们设计了各自的模块定义形式，分别为：

- BrowserModule
- NodeModule

我们在模块导出时便可以随时在上面挂载自定义服务，前端与后端模块的代码在导出内容上基本是一致的，下面以前端模块为例，注册一个自定义服务的代码如下所示：

```ts
import { Injectable } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';

export interface IDemoService {
  run(): void;
}

export const IDemoService = Symbol('IDemoService');

@Injectable()
export class DemoService {
  run() {
    console.log('Hello OpenSumi');
  }
}

@Injectable()
export class DemoModule extends BrowserModule {
  providers = [
    {
      token: IDemoService,
      useClass: DemoService
    }
  ];
}
```

除了 `useClass` 的定义语法，常用的语法还有 `useFactory`, `useValue` 使用方法如下所示：

```ts
export class DemoModule extends BrowserModule {
  providers = [
    {
      token: IDemo2Service,
      useValue: {
        run: () => {
          console.log('Hello OpenSumi');
        }
      }
    },
    {
      token: IDemoService,
      useFactory: (injector: Injector) => {
        // 这里可以直接获取到 injector 实例
        // 通过这种方式，我们可以为多个 Token 挂载同个实现来做到服务职责的分离
        return injector.get(IDemo2Service);
      }
    }
  ];
}
```

## 进一步能力

### 实现多例

在声明模块时，我们可以通过在模块的依赖注入配置中传入 `{ multiple: true }` 来让服务的实现变为多例，即每次通过 DI 获取到的服务都是重新初始化出来的实例，实例代码如下：

```ts
@Injectable({ multiple: true })
class DemoService {
  @Autowired(IDialogService)
  private readonly dialogService: IDialogService;

  run() {
    this.dialogService.info('Hello OpenSumi');
  }
}
```

### 创建子容器

通过 [@opensumi/di](https://www.npmjs.com/package/@opensumi/di) 创建子容器的能力，我们还可以通过直接获取 `Injector` 示例来实现自定义多例等丰富多彩的功能。

```ts
import { Injectable, Autowired, INJECTOR_TOKEN, Injector } from '@opensumi/di';
export const IDemoService = Symbol('IDemoService');
@Injectable()
class DemoService {
  static createContainer(injector: Injector, message: string): Injector {
    const child = injector.createChild([
      {
        token: IDemoService,
        useValue: () => {
          console.log(`Hello ${message}`);
        }
      }
    ]);
    return child;
  }
  @Autowired(INJECTOR_TOKEN)
  private readonly injector: Injector;

  @Autowired(IDemoService)
  private readonly demoService: IDemoService;

  createChild() {
    return DemoService.createContainer(this.injector, 'OpenSumi');
  }
}
```

### 分类服务

通过在创建 DI 子容器中为服务注册声明 `tag`，我们就可以通过 `tag` 参数来实现对不同分类下服务的调用，通常我们用于一些需要有特定分类的服务调用上，如在配置模块中，通过 `tag` 对同一个 `Token` 注册了三个不同的实现：

```ts
export function injectFolderPreferenceProvider(inject: Injector): void {
  inject.addProviders({
    token: FolderPreferenceProviderFactory,
    useFactory: () => {
      return (options: FolderPreferenceProviderOptions) => {
        const configurations = inject.get(PreferenceConfigurations);
        const sectionName = configurations.getName(options.configUri);
        const child = inject.createChild(
          [
            {
              token: FolderPreferenceProviderOptions,
              useValue: options
            }
          ],
          {
            dropdownForTag: true,
            tag: sectionName
          }
        );
        // 当传入为配置文件时，如settings.json, 获取Setting
        if (configurations.isConfigUri(options.configUri)) {
          child.addProviders({
            token: FolderPreferenceProvider,
            useClass: FolderPreferenceProvider
          });
          return child.get(FolderPreferenceProvider);
        }
        // 当传入为其他文件时，如launch.json
        // 需设置对应的FolderPreferenceProvider 及其对应的 FolderPreferenceProviderOptions 依赖
        // 这里的FolderPreferenceProvider获取必须为多例，因为工作区模式下可能存在多个配置文件
        return child.get(FolderPreferenceProvider, {
          tag: sectionName,
          multiple: true
        });
      };
    }
  });
}
```

详细实现见：[preferences/src/browser/index.ts](https://github.com/opensumi/core/blob/develop/packages/preferences/src/browser/index.ts)

更多能力，请自行查阅 [@opensumi/di](https://www.npmjs.com/package/@opensumi/di) 文档。
