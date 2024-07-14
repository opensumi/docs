---
id: ai-native-module
title: AI Native Module
slug: ai-native-module
order: 0
---

## Overview

Starting from OpenSumi 3.0, it supports customizing AI capabilities through the integration of AI Native Module, including but not limited to:

- Built-in AI Chat assistant
- Providing Agent open capabilities and quick command capabilities registration and expansion
- Inline Chat capability is open, allowing for rich interaction and AI capabilities to generate or understand code within the editor
- Code completion capability is open, including block completion, inline completion, and other basic capabilities
- Problem diagnosis capability is open, providing detection capabilities for program runtime errors or static syntax issues
- Intelligent terminal capability is open
- Intelligent conflict resolution capability is open
- Intelligent renaming capability is open
- ...

More IDE functionalities' AI capabilities will continue to be opened up in the future.

## How to Use

#### Step 1: Import the Module

Firstly, import the AI Native module in both the browser and server layers. It is recommended to use it together with the DesignModule!

```typescript
// Browser layer
import { AINativeModule } from '@opensumi/ide-ai-native/lib/browser';
import { DesignModule } from '@opensumi/ide-design/lib/browser';

renderApp({
  modules: [...CommonBrowserModules, DesignModule, AINativeModule]
});

// Server layer
import { AINativeModule } from '@opensumi/ide-ai-native/lib/node';

startServer({
  modules: [...CommonNodeModules, AINativeModule]
});
```

#### Step 2: Contribution

The purpose of this step is to register various AI capabilities.

1. Create a new contribution file and implement the AINativeCoreContribution interface.

```typescript
import { AINativeCoreContribution } from '@opensumi/ide-ai-native/lib/browser/types';

@Domain(AINativeCoreContribution)
export class AiNativeContribution implements AINativeCoreContribution {
  // Register various AI capabilities here
}
```

2. Inject it into the DI's Providers list or the providers configuration of a custom module.

```typescript
const injector = new Injector();
injector.addProviders(AiNativeContribution);

opts.injector = injector;
const app = new ClientApp(opts);
```

#### Step 3: Register Backend Service

The purpose of this step is to enable the front-end AI interactions to request services from the backend interface.

Complete example code can be found in ai.back.service.ts.

1. Create a new backend service file and inherit from the BaseAIBackService service.

```typescript
@Injectable()
export class AiBackService extends BaseAIBackService implements IAIBackService {
  // Here you can interact with any large model API interface
}
```

2. Dependency injection of AIBackSerivceToken.

Provide the newly created AiBackService file to the Provider through dependency injection.

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

Now that the module introduction phase is complete, the AI capabilities are missing (for example, inline chat is not triggered, etc.).

So, it is necessary to provide various provider capabilities in AiNativeContribution.

**Contribution**

Taking inline chat as an example, implement the registerInlineChatFeature method in AiNativeContribution.

```typescript
@Domain(AINativeCoreContribution)
export class AiNativeContribution implements AINativeCoreContribution {
  // Obtain the registered backend service through AIBackSerivcePath
  // At this point, you can directly RPC call the functions provided by the backend service
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
          // Handle any interaction after the inline chat button is clicked here
        }
      }
    );
  }
}
```

At this point, selecting a piece of code in the editor will display the just registered inline chat button in the appropriate area.

Other capabilities' Provider API documentation is as follows:

> For more detailed and complete interface definitions, see: [types.ts](https://github.com/opensumi/core/blob/main/packages/ai-native/src/browser/types.ts#L140)

| Method Name                    | Description                                                         | Parameter Type                    | Return Type |
| ------------------------------ | ------------------------------------------------------------------- | --------------------------------- | ----------- |
| middleware                     | Provides middleware to extend some AI capabilities                  | IAIMiddleware                     | void        |
| registerInlineChatFeature      | Registers inline chat related features                              | IInlineChatFeatureRegistry        | void        |
| registerChatFeature            | Registers chat panel related features                               | IChatFeatureRegistry              | void        |
| registerChatRender             | Registers chat panel related rendering layers, can customize render | IChatRenderRegistry               | void        |
| registerResolveConflictFeature | Registers intelligent conflict resolution related features          | IResolveConflictRegistry          | void        |
| registerRenameProvider         | Registers intelligent renaming related features                     | IRenameCandidatesProviderRegistry | void        |

#### IAIMiddleware

| Method Name                       | Description                            | Parameter Type                                                                                                                                                                          | Return Type |
| --------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| language.provideInlineCompletions | Extends inline completion capabilities | (model: ITextModel, position: Position, token: CancellationToken, next: (reqBean: CompletionRequestBean) => MaybePromise, completionRequestBean: CompletionRequestBean) => MaybePromise | void        |

Example:

```typescript
middleware: IAIMiddleware = {
  language: {
    provideInlineCompletions: async (
      model: ITextModel,
      position: Position,
      token: CancellationToken,
      next: (reqBean: CompletionRequestBean) => MaybePromise,
      completionRequestBean: CompletionRequestBean
    ) => {
      // Custom logic based on parameter information to alter the code completion results
      // For example
      return {
        sessionId: completionRequestBean.sessionId,
        codeModelList: [
          {
            content: 'Hello OpenSumi!'
          }
        ]
      };
    }
  }
};
```

#### IInlineChatFeatureRegistry

| Method Name                | Description                                         | Parameter Type                           | Return Type |
| -------------------------- | --------------------------------------------------- | ---------------------------------------- | ----------- |
| registerEditorInlineChat   | Registers inline chat functionality in the editor   | AIActionItem, IEditorInlineChatHandler   | IDisposable |
| registerTerminalInlineChat | Registers inline chat functionality in the terminal | AIActionItem, ITerminalInlineChatHandler | IDisposable |

**IEditorInlineChatHandler**

| Method Name                 | Description                                                                             | Parameter Type                 | Return Type                |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ | -------------------------- |
| execute                     | Directly executes the action's operation, and the inline chat disappears after clicking | ICodeEditor, ...any[]          | void                       |
| providerDiffPreviewStrategy | Provides a preview strategy for the diff editor                                         | ICodeEditor, CancellationToken | MaybePromise<ChatResponse> |

**ITerminalInlineChatHandler**

| Method Name  | Description                     | Parameter Type                                                            | Return Type |
| ------------ | ------------------------------- | ------------------------------------------------------------------------- | ----------- |
| triggerRules | Defines trigger rules           | 'selection' or BaseTerminalDetectionLineMatcher[]                         | void        |
| execute      | Executes the action's operation | string (stdout), string (stdin), BaseTerminalDetectionLineMatcher? (rule) | void        |

> **MaybePromise** is a type alias indicating that the method may return a Promise or directly return a value of the corresponding type.

> **ChatResponse** is a union type, indicating that the response can be any of ReplyResponse, ErrorResponse, or CancelResponse.

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

Example:

```typescript
// Register inline chat in the editor
registerInlineChatFeature(registry: IInlineChatFeatureRegistry) {
  registry.registerEditorInlineChat(
    {
      id: 'comments',
      name: 'Comments',
    },
    {
      providerDiffPreviewStrategy: async (editor: ICodeEditor, token) => {
        const crossCode = this.getCrossCode(editor);
        const prompt = `Comment the code: \`\`\`${crossCode}\`\`\`. It is required to return only the code results without explanation.`;
      },
    },
  );
}

// Register inline chat in the terminal area
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

| Method Name          | Description                                      | Parameter Type                                                              | Return Type |
| -------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- | ----------- |
| registerWelcome      | Registers the welcome message for the Chat panel | IChatWelcomeMessageContent or React.ReactNode, ISampleQuestions[](optional) | void        |
| registerSlashCommand | Registers the quick command for the Chat panel   | IChatSlashCommandItem, IChatSlashCommandHandler                             | void        |

Example:

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
        return `Explain code: \`\`\`\n ${value}\`\`\``;
      },
      execute: (value: string, send: TChatSlashCommandSend, editor: ICodeEditor) => {
        send(value);
      },
    },
  );
}
```

#### IChatRenderRegistry

| Method Name            | Description                                          | Parameter Type     | Return Type |
| ---------------------- | ---------------------------------------------------- | ------------------ | ----------- |
| registerWelcomeRender  | Customizes the rendering of the welcome message view | ChatWelcomeRender  | void        |
| registerAIRoleRender   | Customizes the rendering of the AI session view      | ChatAIRoleRender   | void        |
| registerUserRoleRender | Customizes the rendering of the user session view    | ChatUserRoleRender | void        |
| registerThinkingRender | Customizes the rendering of the loading view         | ChatThinkingRender | void        |
| registerInputRender    | Customizes the rendering of the input box view       | ChatInputRender    | void        |

Example:

```typescript
registerChatRender(registry: IChatRenderRegistry): void {
  // Directly inject React components
  registry.registerWelcomeRender(CustomWelcomeComponents);
}
```

#### IResolveConflictRegistry

| Method Name                     | Description                                              | Parameter Type                                                | Return Type |
| ------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------- | ----------- |
| registerResolveConflictProvider | Registers the model-问答 service for resolving conflicts | keyof typeof MergeConflictEditorMode, IResolveConflictHandler | void        |

Example:

```typescript
registerResolveConflictFeature(registry: IResolveConflictRegistry): void {
  registry.registerResolveConflictProvider('traditional', {
    providerRequest: async (contentMetadata, options, token) => {
      return new ReplyResponse('Resolved successfully!');
    },
  });
}
```

#### IRenameCandidatesProviderRegistry

| Method Name                       | Description                                     | Parameter Type           | Return Type |
| --------------------------------- | ----------------------------------------------- | ------------------------ | ----------- |
| registerRenameSuggestionsProvider | Registers the provider for renaming suggestions | NewSymbolNamesProviderFn | void        |

Example:

```typescript
registerRenameProvider(registry: IRenameCandidatesProviderRegistry): void {
  registry.registerRenameSuggestionsProvider(async (model, range, token): Promise<NewSymbolName[] | undefined> => {
    return {
      newSymbolName: 'ai rename',
      tags: [NewSymbolNameTag.AIGenerated],
    };
  });
}
```

**Complete example code can be found in [ai-native.contribution.ts](https://github.com/opensumi/core/blob/main/packages/startup/entry/sample-modules/ai-native/ai-native.contribution.ts).**

## Related Configuration

The AI Native Config-related configuration parameters can control the on/off state of all AI capabilities.

### IAINativeConfig

| Property Name | Type                  | Description                                |
| ------------- | --------------------- | ------------------------------------------ |
| capabilities  | IAINativeCapabilities | Configuration items for AI functionalities |
| layout        | IDesignLayoutConfig   | Configuration items for layout design      |

### IAINativeCapabilities

> All the following capabilities are enabled by default.

| Property Name                  | Type    | Description                                                      |
| ------------------------------ | ------- | ---------------------------------------------------------------- |
| supportsMarkers                | boolean | Whether to enable AI capabilities to handle the problem panel    |
| supportsChatAssistant          | boolean | Whether to enable the AI chat assistant feature                  |
| supportsInlineChat             | boolean | Whether to enable the Inline Chat feature                        |
| supportsInlineCompletion       | boolean | Whether to enable the code intelligent completion feature        |
| supportsConflictResolve        | boolean | Whether to enable the AI intelligent conflict resolution feature |
| supportsRenameSuggestions      | boolean | Whether to enable the AI to provide renaming suggestions feature |
| supportsTerminalDetection      | boolean | Whether to enable the AI terminal detection feature              |
| supportsTerminalCommandSuggest | boolean | Whether to enable the AI terminal command suggestion feature     |

### IDesignLayoutConfig

| Property Name              | Type    | Description                                                     |
| -------------------------- | ------- | --------------------------------------------------------------- |
| useMergeRightWithLeftPanel | boolean | Whether to merge the right panel with the left panel            |
| useMenubarView             | boolean | Whether to use the new menu bar view                            |
| menubarLogo                | string  | Sets the icon for the menu bar, which can be a path to an image |
