---
id: ai-native-module
title: AI Native 模块
slug: ai-native-module
order: 0
---

## 概览

从 OpenSumi 3.0 开始，支持通过集成 AI Native Module 的方式来定制 AI 能力，包括但不限于

1. 内置的 AI Chat 助手，并提供 Agent 开放能力与快捷指令能力的注册和扩展
2. Inline Chat 能力开放，在编辑器内通过丰富的交互与 AI 能力来生成或理解代码
3. 代码补全能力开放，包含块补全、行内补全等基础能力
4. 问题诊断能力开放，提供程序运行错误或静态语法问题时的检测能力
5. 智能终端能力开放
6. 智能解决冲突能力开放
7. 智能重命名能力开放
8. ...

未来将持续开放更多 IDE 功能的 AI 开放能力

## 如何使用

#### 第一步：引模块

首先在 `browser` 层和 `server` 层都引入 AI Native 模块。建议搭配 `DesignModule` 一起使用！

```typescript
// browser 层
import { AINativeModule } from '@opensumi/ide-ai-native/lib/browser';
import { DesignModule } from '@opensumi/ide-design/lib/browser';

renderApp({
  modules: [...CommonBrowserModules, DesignModule, AINativeModule]
});

// server 层
import { AINativeModule } from '@opensumi/ide-ai-native/lib/node';

startServer({
  modules: [...CommonNodeModules, AINativeModule]
});
```

#### 第二步：贡献 Contribution

这一步的目的是为了注册各种 AI 能力

**1. 新建一个 `contribution` 文件，并实现 `AiNativeCoreContribution` 接口**

```typescript
import { AiNativeCoreContribution } from '@opensumi/ide-ai-native/lib/browser/types';

@Domain(AiNativeCoreContribution)
export class AiNativeContribution implements AiNativeCoreContribution {
  // 在这里注册各种 AI 能力
}
```

**2. 将其注入到 DI 的 Providers 列表或自定义 module 的 providers 的配置里**

```typescript
const injector = new Injector();
injector.addProviders(AiNativeContribution);

opts.injector = injector;
const app = new ClientApp(opts);
```

#### 第三部：注册后端服务

这一步的目的是为了让前端的 AI 交互能请求到后端接口的服务

> 完整示例代码见 [ai.back.service.ts](https://github.com/opensumi/core/blob/main/packages/startup/entry/sample-modules/ai-native/ai.back.service.ts)

**1. 新建一个后端 service 文件，并继承 BaseAIBackService 服务**

```typescript
@Injectable()
export class AiBackService extends BaseAIBackService
  implements IAIBackService<ReqeustResponse, ChatReadableStream> {
  // 在这里可以跟任何的大模型 API 做接口交互

  // 例如 request 可以一次性返回大模型的返回结果
  async request(
    input: string,
    options: IAIBackServiceOption,
    cancelToken?: CancellationToken
  ) {
    // TODO
  }

  // requestStream 需要返回一个 ChatReadableStream，以便前端可以流式读取模型的回答
  async requestStream(
    input: string,
    options: IAIBackServiceOption,
    cancelToken?: CancellationToken
  ) {
    const chatReadableStream = new ChatReadableStream();
    cancelToken?.onCancellationRequested(() => {
      chatReadableStream.end();
    });

    setTimeout(() => {
      chatReadableStream.emitData({ kind: 'content', content: 'Hello' });
      await sleep(10);
      chatReadableStream.emitData({ kind: 'content', content: 'OpenSumi!' });
    }, 1000);

    return chatReadableStream;
  }
}
```

**2. 依赖注入 AIBackSerivceToken**
将新建好的 AiBackService 文件通过依赖注入的方式提供给 Provider

```typescript
import { AIBackSerivceToken } from '@opensumi/ide-core-common';

const injector = new Injector();
injector.addProviders({
  token: AIBackSerivceToken,
  useClass: AiBackService
});

opts.injector = injector;
const serverApp = new ServerApp(opts);
```

---

自此，模块的引入阶段已经完成，不过这时候 AI 能力是缺失的（比如 inline chat 不触发等）

所以就需要在 AiNativeContribution 里提供各种 provider 的能力

## 贡献 Contribution

我们以 inline chat 为例，在 AiNativeContribution 中实现 `registerInlineChatFeature` 方法

```typescript
@Domain(AiNativeCoreContribution)
export class AiNativeContribution implements AiNativeCoreContribution {
  // 通过 AIBackSerivcePath 拿到注册好的后端服务
  // 此时就能直接 RPC 调用后端服务提供的函数
  @Autowired(AIBackSerivcePath)
  private readonly aiBackService: IAIBackService;

  registerInlineChatFeature(registry: IInlineChatFeatureRegistry) {
    registry.registerEditorInlineChat(
      {
        id: 'ai-comments',
        name: 'Comments',
        title: 'add comments',
        renderType: 'button',
        codeAction: {}
      },
      {
        execute: async (editor: IEditor) => {
          // 在这里处理 inline chat 按钮点击之后的任何交互
        }
      }
    );

    registry.registerEditorInlineChat(
      {
        id: 'ai-optimize',
        name: 'Optimize',
        renderType: 'dropdown',
        codeAction: {}
      },
      {
        // 提供 diff 预览策略
        providerDiffPreviewStrategy: async (editor: ICodeEditor, token) => {
          const crossCode = this.getCrossCode(editor);
          const prompt = `Optimize the code:\n\`\`\`\n ${crossCode}\`\`\``;

          // 在这里通过调用后端服务的 request 方法拿到大模型返回的结果
          const result = await this.aiBackService.request(prompt, {}, token);

          if (result.isCancel) {
            return new CancelResponse();
          }

          if (result.errorCode !== 0) {
            return new ErrorResponse('');
          }

          return new ReplyResponse(result.data!);
        }
      }
    );
  }
}
```

此时选中编辑器内的某段代码，就会在合适的区域展示刚刚注册上去的 inline chat 按钮

**其他能力的 Provider API 文档如下:**

> 更详细完整的接口定义见：[types.ts](https://github.com/opensumi/core/blob/main/packages/ai-native/src/browser/types.ts#L140)

| 方法名                         | 描述                                        | 参数类型                          | 返回类型 |
| ------------------------------ | ------------------------------------------- | --------------------------------- | -------- |
| middleware                     | 提供中间件来扩展部分 AI 能力                | IAIMiddleware                     | void     |
| registerInlineChatFeature      | 注册 inline chat 相关功能                   | IInlineChatFeatureRegistry        | void     |
| registerChatFeature            | 注册 chat 面板相关功能                      | IChatFeatureRegistry              | void     |
| registerChatRender             | 注册 chat 面板相关渲染层，可以自定义 render | IChatRenderRegistry               | void     |
| registerResolveConflictFeature | 注册智能解决冲突相关功能                    | IResolveConflictRegistry          | void     |
| registerRenameProvider         | 注册智能重命名相关功能                      | IRenameCandidatesProviderRegistry | void     |

#### IAIMiddleware

| 方法名                            | 描述             | 参数类型                                                                                                                                          | 返回类型                                                                                      |
| --------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| language.provideInlineCompletions | 扩展内联补全能力 | (model: ITextModel, position: Position, token: CancellationToken, next: (reqBean: CompletionRequestBean) => MaybePromise<IAICompletionResultModel | null>, completionRequestBean: CompletionRequestBean) => MaybePromise<IAICompletionResultModel | null> | void |

用例：

```typescript
middleware: IAIMiddleware = {
  language: {
    provideInlineCompletions: async (
      model: ITextModel,
      position: Position,
      token: CancellationToken,
      next: (
        reqBean: CompletionRequestBean
      ) => MaybePromise<IAICompletionResultModel>,
      completionRequestBean: CompletionRequestBean
    ) => {
      // 在这里可以根据参数信息做一些自定义逻辑，来改变代码补全返回的结果
      // 例如
      return {
        sessionId: completionRequestBean.sessionId,
        codeModelList: [
          {
            content: 'Hello OpenSumi!'
          }
        ]
      };

      // 当然也可以直接返回原始的代码补全结果（该结果会直接请求 back service 后端服务的 requestCompletion 方法）
      return next(completionRequestBean);
    }
  }
};
```

#### IInlineChatFeatureRegistry

| 方法名                     | 描述                            | 参数类型                                 | 返回类型    |
| -------------------------- | ------------------------------- | ---------------------------------------- | ----------- |
| registerEditorInlineChat   | 注册编辑器中的 inline chat 功能 | AIActionItem, IEditorInlineChatHandler   | IDisposable |
| registerTerminalInlineChat | 注册终端中的 inline chat 功能   | AIActionItem, ITerminalInlineChatHandler | IDisposable |

**IEditorInlineChatHandler**

| 方法名                      | 描述                                            | 参数类型                       | 返回类型                     |
| --------------------------- | ----------------------------------------------- | ------------------------------ | ---------------------------- |
| execute                     | 直接执行 action 的操作，点击后 inline chat 消失 | ICodeEditor, ...any[]          | void                         |
| providerDiffPreviewStrategy | 提供 diff editor 的预览策略                     | ICodeEditor, CancellationToken | MaybePromise\<ChatResponse\> |

**ITerminalInlineChatHandler**

| 方法名       | 描述               | 参数类型                                                                  | 返回类型 |
| ------------ | ------------------ | ------------------------------------------------------------------------- | -------- |
| triggerRules | 定义触发规则       | 'selection' 或 BaseTerminalDetectionLineMatcher[]                         | void     |
| execute      | 执行 action 的操作 | string (stdout), string (stdin), BaseTerminalDetectionLineMatcher? (rule) | void     |

> `MaybePromise` 是一个类型别名，表示方法可能返回一个 `Promise` 或者直接返回相应类型的值。

> `ChatResponse` 是一个联合类型，表示响应可以是 `ReplyResponse`、`ErrorResponse` 或 `CancelResponse` 中的任何一种。

```typescript
export class ReplyResponse {
  constructor(readonly message: string) {}

  static is(response: any): boolean {
    return (
      response instanceof ReplyResponse ||
      (typeof response === 'object' && response.message !== undefined)
    );
  }
}

export class ErrorResponse {
  constructor(readonly error: any, readonly message?: string) {}

  static is(response: any): boolean {
    return (
      response instanceof ErrorResponse ||
      (typeof response === 'object' && response.error !== undefined)
    );
  }
}

export class CancelResponse {
  readonly cancellation: boolean = true;

  constructor(readonly message?: string) {}

  static is(response: any): boolean {
    return (
      response instanceof CancelResponse ||
      (typeof response === 'object' && response.cancellation !== undefined)
    );
  }
}

export type ChatResponse = ReplyResponse | ErrorResponse | CancelResponse;
```

用例：

```typescript
// 注册编辑器内的 inline chat
registerInlineChatFeature(registry: IInlineChatFeatureRegistry) {
 registry.registerEditorInlineChat(
   {
     id: 'comments',
     name: 'Comments',
   },
   {
     providerDiffPreviewStrategy: async (editor: ICodeEditor, token) => {
       const crossCode = this.getCrossCode(editor);
       const prompt = `Comment the code: \`\`\`\n ${crossCode}\`\`\`. It is required to return only the code results without explanation.`;

       const result = await this.aiBackService.request(prompt, {}, token);

       if (result.isCancel) {
         return new CancelResponse();
       }

       if (result.errorCode !== 0) {
         return new ErrorResponse('');
       }

       return new ReplyResponse(result.data!);
     },
   },
 );
}

// 注册终端区域的 inline chat
registry.registerTerminalInlineChat(
   {
     id: 'terminal',
     name: 'terminal',
   },
   {
     triggerRules: 'selection',
     execute: async (stdout: string) => {},
   },
);
```

#### IChatFeatureRegistry

| 方法名               | 描述                     | 参数类型                                                                | 返回类型 |
| -------------------- | ------------------------ | ----------------------------------------------------------------------- | -------- |
| registerWelcome      | 注册 Chat 面板的欢迎信息 | IChatWelcomeMessageContent 或 React.ReactNode, ISampleQuestions[](可选) | void     |
| registerSlashCommand | 注册 Chat 面板的快捷指令 | IChatSlashCommandItem, IChatSlashCommandHandler                         | void     |

用例:

```typescript
registerChatFeature(registry: IChatFeatureRegistry): void {
 registry.registerWelcome(
   new MarkdownString(`Hello, I am your dedicated AI assistant, here to answer questions about code and help you think. You can ask me some questions about code.`),
   [
     {
       icon: getIcon('send-hollow'),
       title: 'Generate a Java Quicksort Algorithm',
       message: 'Generate a Java Quicksort Algorithm',
     },
   ],
 );

 registry.registerSlashCommand(
   {
     name: 'Explain',
     description: 'Explain',
     isShortcut: true,
     tooltip: 'Explain',
   },
   {
     providerRender: CustomSlashCommand,
     providerInputPlaceholder(value, editor) {
       return 'Please enter or paste the code.';
     },
     providerPrompt(value, editor) {
       return `Explain code: \`\`\`\n${value}\n\`\`\``;
     },
     execute: (value: string, send: TChatSlashCommandSend, editor: ICodeEditor) => {
       send(value);
     },
   },
 );
}
```

#### IChatRenderRegistry

| 方法名                 | 描述                        | 参数类型           | 返回类型 |
| ---------------------- | --------------------------- | ------------------ | -------- |
| registerWelcomeRender  | 自定义欢迎信息的视图渲染    | ChatWelcomeRender  | void     |
| registerAIRoleRender   | 自定义 AI 会话的视图渲染    | ChatAIRoleRender   | void     |
| registerUserRoleRender | 自定义用户会话的视图渲染    | ChatUserRoleRender | void     |
| registerThinkingRender | 自定义 loading 时的视图渲染 | ChatThinkingRender | void     |
| registerInputRender    | 自定义输入框的视图渲染      | ChatInputRender    | void     |

用例:

```typescript
registerChatRender(registry: IChatRenderRegistry): void {
   // 直接注入 React 组件即可
   registry.registerWelcomeRender(CustomWelcomeComponents)
}
```

#### IResolveConflictRegistry

| 方法名                          | 描述                       | 参数类型                                                      | 返回类型 |
| ------------------------------- | -------------------------- | ------------------------------------------------------------- | -------- |
| registerResolveConflictProvider | 注册解决冲突的模型问答服务 | keyof typeof MergeConflictEditorMode, IResolveConflictHandler | void     |

用例:

```typescript
registerResolveConflictFeature(registry: IResolveConflictRegistry): void {
 registry.registerResolveConflictProvider('traditional', {
   providerRequest: async (contentMetadata, options, token) => {
    return new ReplyResponse('Resolved successfully!')
   },
 });
}
```

#### IRenameCandidatesProviderRegistry

| 方法名                            | 描述                   | 参数类型                 | 返回类型 |
| --------------------------------- | ---------------------- | ------------------------ | -------- |
| registerRenameSuggestionsProvider | 注册重命名建议的提供者 | NewSymbolNamesProviderFn | void     |

用例:

```typescript
registerRenameProvider(registry: IRenameCandidatesProviderRegistry): void {
  registry.registerRenameSuggestionsProvider(async (model, range, token): Promise<NewSymbolName[] | undefined> => {
    return {
     newSymbolName: 'ai rename',
     tags: [NewSymbolNameTag.AIGenerated],
    }
  });
}
```

**完整示例代码见 [ai-native.contribution.ts](https://github.com/opensumi/core/blob/main/packages/startup/entry/sample-modules/ai-native/ai-native.contribution.ts)**

## 相关配置

AI Native Config 相关的配置参数可以控制所有 AI 能力的开关

### IAINativeConfig

| 属性名       | 类型                  | 描述             |
| ------------ | --------------------- | ---------------- |
| capabilities | IAINativeCapabilities | AI 功能的配置项  |
| layout       | IDesignLayoutConfig   | 布局设计的配置项 |

### IAINativeCapabilities

> 以下所有 capabilities 能力默认开启

| 属性名                         | 类型    | 描述                             |
| ------------------------------ | ------- | -------------------------------- |
| supportsMarkers                | boolean | 是否开启 AI 能力处理问题面板     |
| supportsChatAssistant          | boolean | 是否开启 AI 聊天助手功能         |
| supportsInlineChat             | boolean | 是否开启 Inline Chat 功能        |
| supportsInlineCompletion       | boolean | 是否开启代码智能补全功能         |
| supportsConflictResolve        | boolean | 是否开启 AI 智能解决冲突的功能   |
| supportsRenameSuggestions      | boolean | 是否开启 AI 提供重命名建议的功能 |
| supportsTerminalDetection      | boolean | 是否开启 AI 终端检测功能         |
| supportsTerminalCommandSuggest | boolean | 是否开启 AI 终端命令建议功能     |

### IDesignLayoutConfig

| 属性名                     | 类型    | 描述                             |
| -------------------------- | ------- | -------------------------------- |
| useMergeRightWithLeftPanel | boolean | 是否将右侧面板与左侧面板合并     |
| useMenubarView             | boolean | 是否使用新的菜单栏视图           |
| menubarLogo                | string  | 设置菜单栏的图标，可以是图片路径 |
