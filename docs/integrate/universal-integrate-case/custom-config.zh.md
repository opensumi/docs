---
id: custom-config
title: 自定义配置
slug: custom-config
order: 1
---

## 注册自定义配置

常用的注册自定义配置主要有如下两种方式：

1. 在集成侧通过模块贡献点注册
2. 通过插件的`Configurations`贡献点注册

OpenSumi 提供了自定义配置能力，基于 OpenSumi 的 [Contribution Point](../../develop/basic-design/contribution-point) 机制，只需要实现 `PreferenceContribution` 即可进行配置注册。

通过创建DemoPreference -> 举个例子，我们通过创建 DemoPreference 可以在项目中注册运行时配置，伪代码如下：
```
import { PreferenceContribution } from '@opensumi/ide-core-browser';
import { Domain, PreferenceSchema } from '@opensumi/ide-core-common';

export const DemoPreferenceSchema: PreferenceSchema = {
    type: 'object',
    properties: {
        'testValue': {
        type: 'string',
        default: 'test',
        description: 'test'
        }
    }
};

@Domain(PreferenceContribution)
export class DemoPreferenceContribution implements PreferenceContribution {
  public schema: PreferenceSchema = DemoPreferenceSchema;
}
```

在其他任意位置即可读取 -> 通过将 DemoPreferenceContribution 引入到模块中的 Providers 声明后，便可以在其他模块通过下面方式使用
```
@Autowired(PreferenceService)
protected readonly preferenceService: PreferenceService;

...
this.preferenceService.get('testValue')
```

另一种注册方式则是通过插件的 [configuration 贡献点](https://code.visualstudio.com/api/references/contribution-points#contributes.configuration) 在插件中进行注册。

## 自定义集成参数

在集成 OpenSumi 框架的时候，我们往往需要进行独立的配置，下面列举了一些可在集成阶段通过传入配置项进行配置的参数：

在ide-electron中，找到src\index.ts的renderApp初始化方法添加如下：
```
renderApp({
  // 追加配置
  appName: 'OpenSumi',
  // 原有内容
  modules: [
```
完整配置文件可以参考实时代码：
https://github.com/opensumi/core/blob/9e931275bd5bb74af8309e8bf54ad0d27baf165a/packages/core-browser/src/react-providers/config-provider.tsx#L14~#L245

### Browser 配置

定义可见 `@opensumi/ide-core-browser` 中的 `AppConfig` 定义。

| 参数                                    | 参数说明                                                                                                                                                                                                                                                  | 默认值                                                                                                                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appName                                 | 客户端的唯一名称，一般在客户端启动时的标题展示使用，同时也作为插件进程输出的客户端名称                                                                                                                                                                    | OpenSumi                                                                                                                                                                |
| uriScheme                               | 主要用于注册 Electron 版本中的客户端协议，便于实现协议唤起                                                                                                                                                                                                | sumi                                                                                                                                                                    |
| workspaceDir                            | 工作区路径，一般为一个文件夹或是 `*.sumi-workspace` 的工作区文件，当传入值为空时，编辑器左侧文件树将会展示打开文件夹的按钮。                                                                                                                              | 无                                                                                                                                                                      |
| didRendered                             | 当 DOM 首次渲染完成后调用，此时表示 IDE 界面已经完成渲染并可以操作，可以在此处传入函数处理界面 Loading，参考：[DidRendered](https://yuque.antfin.com/ide-framework/integration/features#Zs82P)                                                            | 无                                                                                                                                                                      |
| extensionDir                            | 插件目录路径                                                                                                                                                                                                                                              | 无                                                                                                                                                                      |
| extensionCandidate                      | 额外指定的插件路径，一般用于内置插件                                                                                                                                                                                                                      | 无                                                                                                                                                                      |
| storageDirName                          | 设置全局存储的文件夹名称，主要针对使用了 `Storage` 模块相关存储服务时进行文件夹名称配置                                                                                                                                                                   | .sumi                                                                                                                                                                   |
| preferenceDirName                       | 设置工作区配置文件的文件夹名称，对于集成环境，我们更推荐使用 `workspacePreferenceDirName` 和 `userPreferenceDirName` 进行更加精细的配置存储文件夹名称配置                                                                                                 | .sumi                                                                                                                                                                   |
| workspacePreferenceDirName              | 更精细的项目工作区配置存储位置，即当 preferenceDirName = '.sumi' ， workspacePreferenceDirName = '.kt'时，对应全局配置为 ~/.sumi/settings.json , 工作区配置为 {workspaceDir}/.kt/settings.json                                                            | .sumi                                                                                                                                                                   |
| userPreferenceDirName                   | 更精细的项目用户配置存储位置，即当 preferenceDirName = '.sumi' ， userPreferenceDirName = '.kt'时，对应全局配置为 ~/.sumi/settings.json , 工作区配置为 {userDir}/.kt/settings.json                                                                        | .sumi                                                                                                                                                                   |
| extensionStorageDirName                 | 全局插件数据存储目录名称，默认 .sumi，存储数据位置在 {userDir}/.sumi                                                                                                                                                                                      | .sumi                                                                                                                                                                   |
| defaultPreferences                      | 对客户端的整体配置进行初始化定义，常见的自定义参数如：颜色主题：`general.theme`、图标主题：`general.icon`、语言：`general.language`、排除文件选项：`filesExclude`、排除文件监听选项：`watchExclude` 等等，理论上可针对所有 IDE 中定义的配置进行默认值设置 | 无                                                                                                                                                                      |
| injector                                | 初始化的 DI 实例，一般可在外部进行 DI 初始化之后传入，便于提前进行一些依赖的初始化                                                                                                                                                                        | 无                                                                                                                                                                      |
| wsPath                                  | 默认 WebScoket 通信路径                                                                                                                                                                                                                                   | 无                                                                                                                                                                      |
| layoutConfig                            | 定义 IDE 各个布局区块默认加载的模块，可针对性对模块进行增删改。                                                                                                                                                                                           | 见：[default-config.tsx](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/main-layout/src/browser/default-config.ts)             |
| layoutConponent                         | 定义 IDE 的整体布局，可以通过传入自定义布局的方式定义各个区块的默认大小及缩放选项等                                                                                                                                                                       | 见：[default-layout.tsx](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/core-browser/src/components/layout/default-layout.tsx) |
| panelSizes                              | 可基于 `layoutComponent` 配置的基础上，定义面板大小，宽度/高度                                                                                                                                                                                            | 无                                                                                                                                                                      |
| defaultPanels                           | 定义各个区块的默认面板如 `defaultPanels: { [SlotLocation.bottom]: '@opensumi/ide-terminal-next' }`                                                                                                                                                        | 无                                                                                                                                                                      |
| webviewEndpoint                         | 用于挂载 webview 的 iframe 地址                                                                                                                                                                                                                           | `http://${deviceIp}:${port}/webview`                                                                                                                                    |
| extWorkerHost                           | Worker 插件的默认启动路径                                                                                                                                                                                                                                 | https://dev.g.alicdn.com/tao-ide/ide-lite/${version}/worker-host.js                                                                                                     |
| staticServicePath                       | 定义静态资源路径，框架内默认加载路径为 `http://127.0.0.1:8000/assets/${path}`                                                                                                                                                                             | http://127.0.0.1:8000/assets/${path}                                                                                                                                    |
| extensionDevelopmentHost                | 定义是否以插件开发模式启动                                                                                                                                                                                                                                | false                                                                                                                                                                   |
| editorBackgroundImage                   | 定义编辑器界面的背景图片                                                                                                                                                                                                                                  |                                                                                                                                                                         |
| useExperimentalShadowDom                | 定义是否在插件环境中启用 ShadowDom 模式，建议打开，打开后，视图插件的样式将会与全局环境隔离                                                                                                                                                               | false                                                                                                                                                                   |
| useIframeWrapWorkerHost                 | 加载 workerHost 时使用 iframe 包装，对于跨域的场景，加载 workerHost 时会使用 base64 编码后通过 importScripts 引入(importScripts 不受跨域限制)，但这会导致 workerHost 的 origin 为 null，使某些请求失败                                                    | false                                                                                                                                                                   |
| clientId                                | 自定义客户端 id，是 websocket 服务的唯一标识，也是传给声明了 backServices 的后端 Service 的唯一标识，注意保持这个 id 的唯一性                                                                                                                             | 无                                                                                                                                                                      |
| noExtHost                               | 是否禁用插件进程                                                                                                                                                                                                                                          | false                                                                                                                                                                   |
| extraContextProvider                    | 额外的 ConfigProvider，可以让 OpenSumi 内部的 ReactDOM.render 调用时，都被其包裹一层，以达到额外的 Context 传递效果                                                                                                                                       | 无                                                                                                                                                                      |
| allowSetDocumentTitleFollowWorkspaceDir | 允许按照工作区路径去动态设置 document#title,                                                                                                                                                                                                              | true                                                                                                                                                                    |
| remoteHostname                          | 远程访问地址，可以通过该地址访问当容器服务                                                                                                                                                                                                                | window.location.hostname                                                                                                                                                |
| enableDebugExtensionHost                | 开启插件进程的调试能力                                                                                                                                                                                                                                    | false                                                                                                                                                                   |
| inspectExtensionHost                    | 调试插件进程时的 ip 地址                                                                                                                                                                                                                                    | 无                                                                                                                                                                   |
| extensionFetchCredentials               | 加载插件前端资源时的 fetch credentials 选项，可选项为 "include"                                                                                                                                                                                           | "omit"                                                                                                                                                                  | "same-origin" | 无 |
| extensionConnectOption                  | 参考：[ExtensionConnectOption](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/core-common/src/types/extension.ts#L18)                                                                                            | 无                                                                                                                                                                      |

### Node 配置

定义可见 `@opensumi/ide-core-node` 中的 `AppConfig` 定义。

| 参数                      | 参数说明                                                                                                                                              | 默认值        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| injector                  | 初始化的 DI 实例，一般可在外部进行 DI 初始化之后传入，便于提前进行一些依赖的初始化                                                                    |               |
| marketplace               | 参考：[MarketplaceConfig](https://github.com/opensumi/core/blob/58b998d9e1f721928f576579f16ded46b7505e84/packages/core-node/src/bootstrap/app.ts#L28) |               |
| logLevel                  | 设置落盘日志级别，默认为 Info 级别的 log 落盘                                                                                                         | LogLevel.Info |
| logDir                    | 定义日志落盘路径                                                                                                                                      | ~/.sumi/logs  |
| LogServiceClass           | 待废弃，外部设置的 ILogService，替换默认的 logService，可通过在传入的 `injector` 初始化 `ILogService` 进行实现替换                                    | 无            |
| maxExtProcessCount        | 定义启用插件进程的最大个数                                                                                                                            | 无            |
| extLogServiceClassPath    | 定义插件日志自定义实现路径                                                                                                                            | 无            |
| processCloseExitThreshold | 定义插件进程关闭时间                                                                                                                                  | 无            |
| terminalPtyCloseThreshold | 定义终端 pty 进程退出时间                                                                                                                             | 无            |
| staticAllowOrigin         | 访问静态资源允许的 origin                                                                                                                             | 无            |
| staticAllowPath           | 访问静态资源允许的路径，用于配置静态资源的白名单规则                                                                                                  | 无            |
| blockPatterns             | 文件服务禁止访问的路径，使用 glob 匹配                                                                                                                | 无            |
| extHost                   | 插件 Node 进程入口文件                                                                                                                                | 无            |
| extHostIPCSockPath        | 插件进程存放用于通信的 sock 地址                                                                                                                      | /tmp          |
| extHostForkOptions        | 插件进程 fork 配置                                                                                                                                    | 无            |

更多配置，可查看 OpenSumi 源码。
