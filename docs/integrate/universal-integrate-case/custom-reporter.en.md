---
id: custom-reporter
title: Custom Tracking Reporter
slug: custom-reporter
order: 6
---

## Overview

OpenSumi provides built-in tracking report, which provides integrators with some key performance data, including key IDE data indicators and one party's core extensions. Integrators can report the data to their own platform.

### Frontend Module Usage

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

### Back-end Module Usage

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

### Extension Usage

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

## Report

The integrator implements this by replacing the built-in Provider

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

## Appendix

### Inner Frame Tracking records

| Name                                              | Type        | msg                  | Note                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------- | ----------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activateExtension                                 | performance | extensionId          | extension activation time tracking                                                                                                                                                                                                                                                                                                                      |
| loadExtensionMain                                 | performance | extensionId          | time to load the main JS extension                                                                                                                                                                                                                                                                                                           |
| provideCompletionItems                            | performance | model.uri.toString() | obtain the completion time tracking                                                                                                                                                                                                                                                                                                             |
| data.extra.extDuration can obtain the duration time in the extension process |
| channelReconnect                                  | point       | null                  | reconnect time tracking                                                                                                                                                                                                                                                                                                                                |
| measure                                           | performance | phase name              | the time to start each phase of life cycle execution, where the msg format mainly includes: 1. each module life cycle duration: ${ModuleConstructName}.(initialize &#124; onStart &#124; onDidStart) 2. length of all module lifecycle: Contributions.(initialize &#124; onStart &#124; start)3.framework state ready duration:：Framework.ready 4. length of execution of methods within each class: ：${ClassConstructName}.\${methodName} |
|                                                   |
| provideHover                                      | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                            |
| provideDefinition                                 | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideTypeDefinition                             | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                      |
| provideFoldingRanges                              | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                           |
| provideDocumentColors                             | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideColorPresentations                         | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                         |
| provideDocumentHighlights                         | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideLinks                                      | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideReferences                                 | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideDocumentSymbols                            | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideImplementation                             | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideCodeActions                                | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideRenameEdits                                | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideSignatureHelp                              | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideCodeLenses                                 | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| resolveCodeLens                                   | point       | null                  | number of calls                                                                                                                                                                                                                                                                                                                                 |
| provideOnTypeFormattingEdits                      | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
| provideSelectionRanges                            | performance | uri extname          | call duration tracking                                                                                                                                                                                                                                                                                                                             |
