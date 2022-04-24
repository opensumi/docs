---
id: dependence-injector
title: Dependence Injector
slug: dependence-injector
order: 4
---

In order to promote developers to focus on their own modules and less-concern about the implementation details of other modules, we use [@opensumi/di](https://web.npm.alibaba-inc.com/package/@opensumi/di) for dependency decoupling.  

## User Guide

In the dependency injection coding pattern, if we want to use a service within a module, we no longer need to rely on its concrete implementation, but only on the `Token` it displayed and declared.  

For eaxmple,`IDialogService` uses pop-ups services in the module:

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

Furthermore, we can explicitly declare part of`Token` in `@opensumi/ide-core-browser`, `@opensumi/ide-core-common`, and `@opensumi/ide-core-node`, to achieve a non-direct dependency on service capabilities, and reduce the circular dependencies.

## Custom Registry Service

In the OpenSumi framework, for `Browser` and `Node` we have designed respective module definition forms, which are:

- BrowserModule
- NodeModule

We can always mount a customizable service on it when exporting the module is. The code of the front-end and back-end modules is basically the same in terms of exported content. Take a front-end module as an example, registering a custom service is shown below.

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

Apart from the `useClass` definition syntax, the common syntax also includes `useFactory`, `useValue`. which can be used as follows.

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

## Further Capabilities

### Implementing Multiple Instances

When declaring a module, we can make the implementation of the service multi-instantiated by passing `{ multiple: true }` in the module's dependency injection configuration.Namely each time the service is obtained through DI is a re-initialized instance, the example code is as follows:

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

### Creat a Sub container

By creating sub-containers via [@opensumi/di](https://web.npm.alibaba-inc.com/package/@opensumi/di), we can also make colorful features including custom multitons possible with the help of getting `Injector` example directly.

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

### Classes of Service 

By registering a `tag` for the service in the DI subcontainer, we can use the `tag` parameter to implement calls to different classes of services. This parameter is usually used for service calls that require specific classes, such as in configuration modules. Three different implementations of the same `Token`are registered via  `tag`:  

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

For implementation details, please refer to：[preferences/src/browser/index.ts](https://github.com/opensumi/core/blob/develop/packages/preferences/src/browser/index.ts)

For more information, please check for [@opensumi/di](https://web.npm.alibaba-inc.com/package/@opensumi/di) 文档。
