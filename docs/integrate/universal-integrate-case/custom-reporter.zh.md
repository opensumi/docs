---
id: custom-reporter
title: 自定义埋点上报
slug: custom-reporter
order: 3
---

# 概览

OpenSumi 内置提供了埋点上报，给集成方提供一些关键 IDE 数据的指标、一方核心插件的一些关键性能等数据。集成方可自行将这些数据上报到自己的平台。

# 使用

## 前端模块使用

```typescript
import { IReporterService } from '@opensumi/ide-core-browser';

@Injectable()
class {
  @Autowired(IReporterService)
  reporterService: IReporterService

	async activateExtension() {
  	...
    const timer = reporterService.time(REPORT_NAME.ACTIVE_EXTENSION);
    ...
    timer.timeEnd(extension.extensionId)
  }
}
```

## 后端模块使用

```typescript
import { IReporterService } from '@opensumi/ide-core-node';

@Injectable()
class {
  @Autowired(IReporterService)
  reporterService: IReporterService

	async activateExtension() {
  	...
    reporterService.point(REPORT_NAME.ACTIVE_EXTENSION, extension.extensionId);
  }
}
```

## 插件中使用

```typescript
import { reporter } from 'sumi';

activate() {
  ...
  const reporterTimer = reporter.time(`ts-load`);
  func();
  reporterTimer.timeEnd(`ts-load`);
}

function deactivate() {
   reporter.dispose();
}
```

# 上报

集成方通过替换内置 Provider 实现

```typescript
import {
  PointData,
  PerformanceData,
  IReporter
} from '@opensumi/ide-core-browser';

@Injectable()
class Reporter implements IReporter {
  performance(name: string, data: PerformanceData) {}

  point(name: string, data: PointData) {}
}

injector.addProviders({
  token: IReporter,
  useClass: Reporter
});
```

# 附录

## 框架内打点记录

| name                                              | 类型        | msg                  | 备注                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ----------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activateExtension                                 | performance | extensionId          | 插件激活时间埋点                                                                                                                                                                                                                                                                                                                        |
| loadExtensionMain                                 | performance | extensionId          | 加载插件 main js 时间埋点                                                                                                                                                                                                                                                                                                               |
| provideCompletionItems                            | performance | model.uri.toString() | 获取 completion 时间埋点                                                                                                                                                                                                                                                                                                                |
| data.extra.extDuration 可以获取在插件进程中的耗时 |
| channelReconnect                                  | point       | 无                   | 重连埋点                                                                                                                                                                                                                                                                                                                                |
| measure                                           | performance | 阶段名               | 启动各个阶段生命周期执行的时间，其中 msg 格式主要包括：1. 各模块生命周期时长: ${ModuleConstructName}.(initialize &#124; onStart &#124; onDidStart) 2. 所有模块生命周期时长：Contributions.(initialize &#124; onStart &#124; start)3. 框架状态ready耗时：Framework.ready 4. 各个类内方法执行的时长：${ClassConstructName}.\${methodName} |
|  |
| provideHover                                      | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideDefinition                                 | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideTypeDefinition                             | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideFoldingRanges                              | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideDocumentColors                             | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideColorPresentations                         | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideDocumentHighlights                         | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideLinks                                      | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideReferences                                 | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideDocumentSymbols                            | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideImplementation                             | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideCodeActions                                | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideRenameEdits                                | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideSignatureHelp                              | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideCodeLenses                                 | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| resolveCodeLens                                   | point       | 无                   | 调用次数                                                                                                                                                                                                                                                                                                                                |
| provideOnTypeFormattingEdits                      | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
| provideSelectionRanges                            | performance | uri extname          | 调用耗时埋点                                                                                                                                                                                                                                                                                                                            |
