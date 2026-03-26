# 鸿蒙（HarmonyOS）开发学习指南

> 基于 HarmonyOS NEXT（API 12+）及 AtomicService_ZenHotel 项目实战

---

## 目录

- [第一章 鸿蒙开发概述](#第一章-鸿蒙开发概述)
- [第二章 开发环境搭建](#第二章-开发环境搭建)
- [第三章 ArkTS 语言基础](#第三章-arkts-语言基础)
- [第四章 ArkUI 声明式 UI 开发](#第四章-arkui-声明式-ui-开发)
- [第五章 应用架构与生命周期](#第五章-应用架构与生命周期)
- [第六章 状态管理](#第六章-状态管理)
- [第七章 页面路由与导航](#第七章-页面路由与导航)
- [第八章 网络请求与数据处理](#第八章-网络请求与数据处理)
- [第九章 数据持久化](#第九章-数据持久化)
- [第十章 华为账号与认证](#第十章-华为账号与认证)
- [第十一章 元服务（Atomic Service）开发](#第十一章-元服务atomic-service开发)
- [第十二章 卡片（Widget）开发](#第十二章-卡片widget开发)
- [第十三章 Web 组件集成](#第十三章-web-组件集成)
- [第十四章 多产品构建与变体管理](#第十四章-多产品构建与变体管理)
- [第十五章 项目架构实战解析](#第十五章-项目架构实战解析)
- [附录 常用 Kit 速查表](#附录-常用-kit-速查表)

---

## 第一章 鸿蒙开发概述

### 1.1 HarmonyOS NEXT 简介

HarmonyOS NEXT 是华为推出的全新一代操作系统，完全基于自研内核，摆脱了对 Android 的依赖。核心特点：

- **纯鸿蒙架构**：不再兼容 Android APK，采用全新的应用模型
- **分布式能力**：天然支持多设备协同，一次开发多端部署
- **ArkTS 开发语言**：基于 TypeScript 扩展的声明式开发语言
- **ArkUI 框架**：声明式 UI 框架，提供高性能渲染引擎
- **元服务（Atomic Service）**：免安装、轻量化的服务形态

### 1.2 技术栈全景

```
┌─────────────────────────────────────────────────┐
│                 应用层 (Application)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ ArkTS    │ │ ArkUI    │ │ Atomic Service   │ │
│  │ 开发语言  │ │ UI框架   │ │ 元服务           │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────┤
│                 框架层 (Framework)                │
│  AbilityKit · NetworkKit · ArkWeb · AccountKit  │
│  BasicServicesKit · FormKit · LocalizationKit   │
├─────────────────────────────────────────────────┤
│                 系统服务层 (System Services)       │
│  分布式数据管理 · 安全子系统 · 多媒体子系统       │
├─────────────────────────────────────────────────┤
│                 内核层 (Kernel)                   │
│  HarmonyOS 微内核                                │
└─────────────────────────────────────────────────┘
```

### 1.3 本项目技术栈概览

**AtomicService_ZenHotel** 是一个元服务（Atomic Service）项目，技术选型如下：

| 技术领域 | 选型 |
|---------|------|
| 开发语言 | ArkTS (基于 TypeScript) |
| UI 框架 | ArkUI 声明式 (@ComponentV2) |
| 路由框架 | HMRouter (@hadss/hmrouter) |
| 网络请求 | @kit.NetworkKit (HTTP) |
| 状态管理 | @ObservedV2 + @Trace + AppStorage |
| 数据持久化 | @ohos.data.preferences |
| 账号认证 | @kit.AccountKit (华为 ID) |
| Web 集成 | @kit.ArkWeb |
| 卡片服务 | @kit.FormKit |
| 构建系统 | Hvigor + 多 Product 变体 |

---

## 第二章 开发环境搭建

### 2.1 DevEco Studio 安装

1. 下载 [DevEco Studio](https://developer.huawei.com/consumer/cn/deveco-studio/) 最新版本（推荐 5.0+）
2. 安装 HarmonyOS SDK（API 12 及以上）
3. 配置 Node.js 环境（DevEco Studio 自带）

### 2.2 项目结构认识

以本项目为例，标准的鸿蒙项目结构如下：

```
AtomicService_ZenHotel/
├── AppScope/                    # 应用全局配置
│   ├── app.json5                # 应用配置（bundleName、版本等）
│   └── resources/               # 全局资源
├── entry/                       # 主模块（入口）
│   ├── src/main/
│   │   ├── ets/                 # ArkTS 源码
│   │   │   ├── entryability/    # UIAbility 入口
│   │   │   ├── pages/           # 页面组件
│   │   │   └── widget/          # 卡片组件
│   │   ├── resources/           # 模块资源
│   │   └── module.json5         # 模块配置
│   ├── build-profile.json5      # 模块构建配置
│   └── oh-package.json5         # 模块依赖
├── dz_common/                   # 共享库模块
│   └── src/main/ets/            # 公共工具/组件/基类
├── features/                    # 特性模块
│   └── TemplateApp/             # Web 模板模块
├── variants/                    # 产品变体资源
│   ├── dodopizza/               # dodopizza 变体
│   └── gitex/                   # gitex 变体
├── build-profile.json5          # 应用级构建配置
├── oh-package.json5             # 应用级依赖
└── hvigorfile.ts                # Hvigor 构建脚本
```

### 2.3 核心配置文件说明

**app.json5** — 应用级配置：
```json5
{
  "app": {
    "bundleName": "com.atomicservice.xxx",
    "bundleType": "atomicService",   // 元服务类型
    "versionCode": 1000100,
    "versionName": "1.0.1"
  }
}
```

**module.json5** — 模块配置，声明 Ability、权限等：
```json5
{
  "module": {
    "name": "entry",
    "type": "entry",
    "abilities": [{ ... }],
    "requestPermissions": [
      { "name": "ohos.permission.INTERNET" }
    ]
  }
}
```

**oh-package.json5** — 依赖管理（类似 package.json）：
```json5
{
  "dependencies": {
    "@hadss/hmrouter": "^1.0.0-rc.11",
    "dz_common": "file:./dz_common"
  }
}
```

---

## 第三章 ArkTS 语言基础

### 3.1 ArkTS 与 TypeScript 的关系

ArkTS 是在 TypeScript 基础上针对鸿蒙平台扩展的开发语言：

- **继承** TypeScript 的类型系统、接口、泛型等特性
- **扩展** 了声明式 UI 的装饰器语法（@Component、@State 等）
- **限制** 了部分动态特性以保证运行时性能（如不支持 any 滥用）

### 3.2 基础语法

```typescript
// 变量声明
let name: string = 'ZenHotel'
const VERSION: number = 1

// 接口定义
interface UserInfo {
  openId: string
  nickname: string
  mobile?: string  // 可选属性
}

// 类定义
class BaseHelper {
  protected tag: string = 'BaseHelper'

  log(message: string): void {
    console.log(`[${this.tag}] ${message}`)
  }
}

// 泛型
class BaseController<T extends BaseViewModel> {
  protected viewModel: T | undefined

  aboutToAppear(): void { }
  onPageShow(): void { }
}
```

### 3.3 本项目中的 ArkTS 实践

**泛型基类模式**（`dz_common/src/main/ets/base/`）：

```typescript
// 基础控制器 - 泛型约束 ViewModel 类型
export abstract class BaseController<T extends BaseViewModel> {
  protected viewModel: T | undefined

  aboutToAppear(): void { }
  onPageShow(): void { }
  onPageHide(): void { }
  aboutToDisappear(): void { }
}

// 基础 ViewModel - 可观察状态基类
@ObservedV2
export class BaseViewModel {
  // 子类通过 @Trace 标记响应式属性
}
```

**工具类命名空间模式**（`dz_common/src/main/ets/utils/`）：

```typescript
// 字符串工具 - 使用 namespace 组织静态方法
export namespace StrHelper {
  export function isBlank(str: string | undefined | null): boolean {
    return str === undefined || str === null || str.trim().length === 0
  }

  export function isNotBlank(str: string | undefined | null): boolean {
    return !isBlank(str)
  }

  export function queryString(params: Record<string, string>): string {
    // 将 Record 转为 URL 查询字符串
  }
}
```

---

## 第四章 ArkUI 声明式 UI 开发

### 4.1 声明式 UI 核心概念

ArkUI 采用声明式编程范式，与 SwiftUI/Jetpack Compose 类似。核心理念：**UI = f(State)**

```
状态变化 → 框架检测 → 差量更新 UI → 重新渲染
```

### 4.2 组件装饰器

| 装饰器 | 用途 | 本项目使用 |
|--------|------|-----------|
| `@Entry` | 页面入口组件 | MainPage |
| `@Component` | 自定义组件（V1） | - |
| `@ComponentV2` | 自定义组件（V2，推荐） | 全面使用 |
| `@Builder` | 轻量级 UI 构建函数 | 各页面 |
| `@Styles` | 样式复用 | - |
| `@Extend` | 组件扩展 | - |

> **注意**：本项目全面采用 `@ComponentV2`（V2 组件模型），这是 HarmonyOS NEXT 推荐的新组件范式。

### 4.3 基础组件与布局

```typescript
@Entry
@ComponentV2
struct MyPage {
  build() {
    // 垂直布局
    Column() {
      // 文本组件
      Text('Hello HarmonyOS')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .fontColor('#333333')

      // 水平布局
      Row() {
        Image($r('app.media.icon'))
          .width(40)
          .height(40)

        Text('描述文本')
          .fontSize(14)
          .margin({ left: 8 })
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)

      // 按钮
      Button('点击操作')
        .width('80%')
        .height(48)
        .onClick(() => {
          // 点击处理
        })
    }
    .width('100%')
    .height('100%')
    .padding(16)
  }
}
```

### 4.4 常用布局容器

```typescript
// Stack 堆叠布局 - 子组件叠加
Stack({ alignContent: Alignment.Bottom }) {
  Image(src).width('100%')
  Text('覆盖文字').fontColor(Color.White)
}

// RelativeContainer 相对布局 - 复杂定位
RelativeContainer() {
  Text('左侧').id('left')
    .alignRules({
      left: { anchor: '__container__', align: HorizontalAlign.Start }
    })
  Text('右侧')
    .alignRules({
      right: { anchor: '__container__', align: HorizontalAlign.End }
    })
}

// List 列表
List() {
  ForEach(this.dataList, (item: DataItem) => {
    ListItem() {
      Text(item.name)
    }
  })
}
```

### 4.5 本项目的 UI 实践

**通用标题栏组件**（`dz_common` 模块）：

```typescript
@ComponentV2
export struct CommonTitleBar {
  @Param title: string = ''
  @Param showBack: boolean = true
  @Event onBackClick: () => void = () => {}

  build() {
    RelativeContainer() {
      if (this.showBack) {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .onClick(() => this.onBackClick())
      }
      Text(this.title)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
    }
    .width('100%')
    .height(56)
  }
}
```

**@Param 与 @Event 的使用**：
- `@Param`：父组件向子组件传递数据（单向数据流）
- `@Event`：子组件向父组件发送事件回调

---

## 第五章 应用架构与生命周期

### 5.1 应用模型（Stage 模型）

HarmonyOS NEXT 使用 **Stage 模型**，核心概念：

```
Application
  └── AbilityStage（模块级）
        └── UIAbility（页面级 Ability）
              └── WindowStage
                    └── Page（UI 页面）
```

### 5.2 UIAbility 生命周期

```
Create → Foreground ↔ Background → Destroy
            ↑                ↓
        WindowStage    WindowStage
        onConnect      onDisconnect
```

**本项目的 EntryAbility**（`entry/src/main/ets/entryability/EntryAbility.ets`）：

```typescript
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    // 应用创建时：初始化 HMRouter、保存上下文
    HMRouterMgr.init({
      context: this.context
    })
    AppUtil.setContext(this.context)
  }

  onWindowStageCreate(windowStage: window.WindowStage): void {
    // 窗口创建：加载主页面
    windowStage.loadContent('pages/MainPage', (err) => {
      if (err) {
        hilog.error(0x0000, 'EntryAbility', 'Failed to load content')
        return
      }
    })
    // 设置沉浸式状态栏
    AppUtil.setWindowStage(windowStage)
  }

  onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    // 热启动时：处理新的 want 参数
    // 捕获父应用 bundleName 等信息
    const parentFrom = want?.parameters?.['ohos.extra.param.key.hostPkg'] as string
    AppStorage.setOrCreate('SDK_PARENT_FROM', parentFrom)
  }
}
```

### 5.3 页面生命周期

```typescript
@Entry
@ComponentV2
struct MainPage {
  // 页面即将显示
  aboutToAppear(): void {
    // 初始化数据
  }

  // 页面显示完成
  onPageShow(): void {
    // 恢复状态、刷新数据
  }

  // 页面隐藏
  onPageHide(): void {
    // 保存状态
  }

  // 页面即将销毁
  aboutToDisappear(): void {
    // 清理资源
  }

  build() { ... }
}
```

---

## 第六章 状态管理

### 6.1 状态管理体系

HarmonyOS 提供分层状态管理方案：

```
┌────────────────────────────────────┐
│  AppStorage（应用全局状态）          │ ← 跨页面共享
├────────────────────────────────────┤
│  LocalStorage（页面级状态）          │ ← 页面内共享
├────────────────────────────────────┤
│  组件级状态                         │
│  @Local / @Param / @Provider       │ ← 组件内/父子共享
│  @ObservedV2 + @Trace              │ ← ViewModel 响应式
└────────────────────────────────────┘
```

### 6.2 V2 装饰器详解（本项目采用）

**@Local** — 组件内部状态：
```typescript
@ComponentV2
struct Counter {
  @Local count: number = 0   // 组件私有状态

  build() {
    Column() {
      Text(`计数: ${this.count}`)
      Button('+1').onClick(() => { this.count++ })
    }
  }
}
```

**@Param 与 @Event** — 父子组件通信：
```typescript
// 父组件
@ComponentV2
struct Parent {
  @Local title: string = '标题'

  build() {
    Child({
      title: this.title,                     // 传入数据
      onTitleChange: (val: string) => {       // 接收事件
        this.title = val
      }
    })
  }
}

// 子组件
@ComponentV2
struct Child {
  @Param title: string = ''
  @Event onTitleChange: (val: string) => void = () => {}

  build() {
    Text(this.title)
      .onClick(() => this.onTitleChange('新标题'))
  }
}
```

**@ObservedV2 + @Trace** — ViewModel 响应式（本项目核心模式）：
```typescript
// ViewModel 定义
@ObservedV2
class CommonLoginViewModel extends BaseViewModel {
  @Trace isLoading: boolean = false
  @Trace userInfo: UserInfo | undefined = undefined
  @Trace errorMessage: string = ''
}

// 在组件中使用
@ComponentV2
struct LoginPage {
  private viewModel: CommonLoginViewModel = new CommonLoginViewModel()

  build() {
    Column() {
      if (this.viewModel.isLoading) {
        LoadingProgress().width(48)
      }
      if (this.viewModel.userInfo) {
        Text(this.viewModel.userInfo.nickname)
      }
    }
  }
}
```

> **@Trace 的作用**：标记 @ObservedV2 类中需要被 UI 追踪的属性。当 @Trace 属性变化时，使用该属性的 UI 组件会自动刷新。

### 6.3 AppStorage — 应用全局状态

```typescript
// 存储全局状态
AppStorage.setOrCreate('SDK_PARENT_FROM', bundleName)
AppStorage.setOrCreate('USER_OPENID', openId)

// 读取全局状态
const parentFrom = AppStorage.get<string>('SDK_PARENT_FROM')

// 在组件中双向绑定
@ComponentV2
struct MyComponent {
  @Local openId: string = AppStorage.get<string>('USER_OPENID') ?? ''
}
```

**本项目使用 AppStorage 存储的全局数据**：
- `SDK_PARENT_FROM` — 父应用来源标识
- `USER_OPENID` — 用户 OpenID
- `SDK_ENTRY_URL` — 入口 URL

### 6.4 @Provider 与 @Consumer — 跨层级数据共享

```typescript
// 祖先组件提供数据
@ComponentV2
struct Ancestor {
  @Provider('theme') theme: string = 'light'

  build() {
    Column() {
      MiddleComponent()  // 中间层不需要感知 theme
    }
  }
}

// 后代组件消费数据（可跨多层）
@ComponentV2
struct Descendant {
  @Consumer('theme') theme: string = 'light'

  build() {
    Text('当前主题: ' + this.theme)
  }
}
```

---

## 第七章 页面路由与导航

### 7.1 原生 Navigation vs HMRouter

HarmonyOS 提供原生 `Navigation` 组件进行导航，但本项目选择了更强大的 **HMRouter** 第三方路由框架。

| 特性 | Navigation (原生) | HMRouter (本项目) |
|------|-------------------|-------------------|
| 路由注册 | 手动配置 | @HMRouter 装饰器自动注册 |
| 路由跳转 | NavPathStack | HMRouterMgr.push/replace |
| 动画支持 | 基础 | 丰富的内置动画 |
| 生命周期 | 基础 | 完整的页面生命周期观察 |
| 路由拦截 | 手动实现 | 内置拦截器机制 |

### 7.2 HMRouter 配置与使用

**第一步：安装依赖**

```json5
// oh-package.json5
{
  "dependencies": {
    "@hadss/hmrouter": "^1.0.0-rc.11"
  }
}
```

**第二步：配置 Hvigor 插件**

```typescript
// entry/hvigorfile.ts
import { hmRouterPlugin } from '@hadss/hmrouter-plugin'
import { harTasks } from '@ohos/hvigor-ohos-plugin'

export default {
  plugins: [hmRouterPlugin()]  // 自动扫描 @HMRouter 装饰器
}
```

**第三步：初始化 HMRouter**

```typescript
// EntryAbility.ets
onCreate(want: Want): void {
  HMRouterMgr.init({
    context: this.context
  })
}
```

**第四步：定义路由页面**

```typescript
// 使用 @HMRouter 装饰器注册页面路由
@HMRouter({ pageUrl: 'page://LoginContainerPage' })
@ComponentV2
struct LoginContainerPage {
  build() {
    Column() {
      Text('登录页面')
    }
  }
}

@HMRouter({ pageUrl: 'page://TemplatePage' })
@ComponentV2
struct TemplatePage {
  build() {
    // 模板页面
  }
}
```

**第五步：导航容器与跳转**

```typescript
// MainPage.ets - 导航容器
@Entry
@ComponentV2
struct MainPage {
  build() {
    // HMNavigation 是路由的根容器
    HMNavigation({
      navigationId: 'mainNavigation',
      homePageUrl: 'page://PlaceholderPage',     // 首页路由
      options: {
        standardAnimator: HMDefaultGlobalAnimator.STANDARD_ANIMATOR,
        dialogAnimator: HMDefaultGlobalAnimator.DIALOG_ANIMATOR
      }
    })
  }
}

// 页面跳转
HMRouterMgr.push({
  navigationId: 'mainNavigation',
  pageUrl: 'page://LoginContainerPage',
  param: { from: 'home' }
})

// 页面替换（不保留当前页面在栈中）
HMRouterMgr.replace({
  navigationId: 'mainNavigation',
  pageUrl: 'page://TemplatePage'
})

// 返回
HMRouterMgr.pop({
  navigationId: 'mainNavigation'
})
```

### 7.3 本项目路由结构

```
MainPage (HMNavigation 根容器)
  ├── page://PlaceholderPage          ← 占位首页（判断登录状态后跳转）
  ├── page://LoginContainerPage       ← 登录容器页
  │     └── CommonLoginComponent      ← 登录组件（嵌套 HMNavigation）
  │           └── LoginPrivacyAgreement  ← 隐私协议页
  └── page://TemplatePage             ← Web 模板主页面
```

---

## 第八章 网络请求与数据处理

### 8.1 @kit.NetworkKit 基础

鸿蒙网络请求使用 `@kit.NetworkKit` 中的 `http` 模块：

```typescript
import { http } from '@kit.NetworkKit'

// 创建 HTTP 请求实例
const httpRequest = http.createHttp()

// 发起 GET 请求
const response = await httpRequest.request(
  'https://api.example.com/data',
  {
    method: http.RequestMethod.GET,
    header: {
      'Content-Type': 'application/json'
    },
    connectTimeout: 10000,   // 连接超时 10s
    readTimeout: 10000       // 读取超时 10s
  }
)

// 处理响应
if (response.responseCode === 200) {
  const data = JSON.parse(response.result as string)
}

// 销毁请求实例（重要！避免内存泄漏）
httpRequest.destroy()
```

### 8.2 本项目的 HTTP 封装

**HttpUtil** — 通用 HTTP 工具（`dz_common/src/main/ets/utils/HttpUtil.ets`）：

```typescript
export class HttpUtil {
  static async request(url: string, method: string,
                       params?: Record<string, Object>): Promise<string> {
    const httpRequest = http.createHttp()
    try {
      const response = await httpRequest.request(url, {
        method: method === 'GET' ? http.RequestMethod.GET : http.RequestMethod.POST,
        header: {
          'Content-Type': 'application/json'
        },
        extraData: params ? JSON.stringify(params) : undefined
      })

      if (response.responseCode === 200) {
        return response.result as string
      }
      throw new Error(`HTTP Error: ${response.responseCode}`)
    } finally {
      httpRequest.destroy()  // 确保释放资源
    }
  }
}
```

**AtomicLoginHttpUtil** — 登录专用 HTTP 工具：

```typescript
// 专门处理华为 OAuth 登录流程的网络请求
export class AtomicLoginHttpUtil {
  // 通过授权码换取 Access Token
  static async exchangeToken(code: string): Promise<TokenResponse> {
    const response = await httpRequest.request(
      'https://oauth-login.cloud.huawei.com/oauth2/v3/token',
      {
        method: http.RequestMethod.POST,
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        extraData: `grant_type=authorization_code&code=${code}&...`
      }
    )
    return JSON.parse(response.result as string) as TokenResponse
  }

  // 通过 Token 获取用户信息
  static async getUserInfo(token: string): Promise<UserInfo> {
    const response = await httpRequest.request(
      'https://account.cloud.huawei.com/rest.php?nsp_svc=GOpen.User.getInfo',
      { /* ... */ }
    )
    return JSON.parse(response.result as string) as UserInfo
  }
}
```

### 8.3 网络状态检测

```typescript
import { connection } from '@kit.NetworkKit'

// 检查网络是否可用
const netHandle = await connection.getDefaultNet()
const netCapabilities = await connection.getNetCapabilities(netHandle)
const isConnected = netCapabilities.bearerTypes.length > 0

// 监听网络状态变化
const netConnection = connection.createNetConnection()
netConnection.on('netAvailable', () => {
  console.log('网络已连接')
})
netConnection.on('netUnavailable', () => {
  console.log('网络不可用')
})
netConnection.register()
```

### 8.4 权限配置

网络请求需要在 `module.json5` 中声明权限：

```json5
{
  "module": {
    "requestPermissions": [
      { "name": "ohos.permission.INTERNET" },
      { "name": "ohos.permission.GET_NETWORK_INFO" }
    ]
  }
}
```

---

## 第九章 数据持久化

### 9.1 Preferences 轻量级存储

鸿蒙提供 `@ohos.data.preferences` 作为轻量键值对存储，适合保存配置信息和少量数据。

### 9.2 本项目的 SPUtils 封装

项目中 `SPUtils`（`dz_common/src/main/ets/utils/SPUtils.ets`）提供了完整的持久化封装：

```typescript
import { preferences } from '@ohos.data.preferences'

export class SPUtils {
  private static instances: Map<string, preferences.Preferences> = new Map()

  // 初始化（在 Ability 创建时调用）
  static async init(context: common.Context, name: string = 'default'): Promise<void> {
    const pref = await preferences.getPreferences(context, name)
    SPUtils.instances.set(name, pref)
  }

  // 存储字符串
  static async putString(key: string, value: string,
                          name: string = 'default'): Promise<void> {
    const pref = SPUtils.instances.get(name)
    await pref?.put(key, value)
    await pref?.flush()   // 持久化到磁盘
  }

  // 获取字符串
  static async getString(key: string, defaultValue: string = '',
                          name: string = 'default'): Promise<string> {
    const pref = SPUtils.instances.get(name)
    return (await pref?.get(key, defaultValue)) as string
  }

  // 存储布尔值
  static async putBoolean(key: string, value: boolean): Promise<void> { ... }

  // 存储数组（序列化为 JSON）
  static async putArray<T>(key: string, value: T[]): Promise<void> {
    await SPUtils.putString(key, JSON.stringify(value))
  }

  // 获取数组
  static async getArray<T>(key: string): Promise<T[]> {
    const str = await SPUtils.getString(key)
    return str ? JSON.parse(str) as T[] : []
  }
}
```

### 9.3 使用场景

```typescript
// 保存用户登录信息
await SPUtils.putString('user_openid', openId)
await SPUtils.putBoolean('is_logged_in', true)

// 读取用户登录信息
const openId = await SPUtils.getString('user_openid')
const isLoggedIn = await SPUtils.getBoolean('is_logged_in', false)

// 保存复杂数据
await SPUtils.putArray('recent_hotels', hotelList)
```

---

## 第十章 华为账号与认证

### 10.1 华为账号登录体系

本项目集成了完整的华为账号登录系统，提供两种登录方式：

```
┌─────────────────────────────────┐
│         用户触发登录              │
├────────────┬────────────────────┤
│ 方式一      │ 方式二              │
│ 华为ID静默  │ 一键手机号获取       │
│ 登录        │ (functionalButton)  │
├────────────┴────────────────────┤
│    授权码 (Authorization Code)   │
├─────────────────────────────────┤
│    换取 Access Token             │
│    (OAuth2 /oauth2/v3/token)    │
├─────────────────────────────────┤
│    获取用户信息                   │
│    (GOpen.User.getInfo)         │
├─────────────────────────────────┤
│    返回: openID / unionID /      │
│    mobileNumber / nickname      │
└─────────────────────────────────┘
```

### 10.2 华为 ID 静默登录

```typescript
import { authentication } from '@kit.AccountKit'

// 创建华为 ID 登录请求
const request = new authentication.HuaweiIDProvider().createLoginWithHuaweiIDRequest()
request.forceLogin = false  // 非强制登录（静默尝试）
request.state = generateRandomState()

// 执行登录
const controller = new authentication.AuthenticationController(context)
const response = await controller.executeRequest(request)
const loginResponse = response as authentication.LoginWithHuaweiIDResponse

// 获取授权码
const authCode = loginResponse.data?.authorizationCode
```

### 10.3 一键获取手机号

```typescript
import { functionalButtonComponentManager } from '@kit.ScenarioFusionKit'

// 在 UI 中使用一键授权按钮
@ComponentV2
struct PhoneLoginButton {
  build() {
    Column() {
      // 系统提供的授权按钮组件
      FunctionalButton({
        params: {
          openType: functionalButtonComponentManager.OpenType.GET_PHONE_NUMBER,
          label: '手机号一键登录'
        },
        controller: new functionalButtonComponentManager.FunctionalButtonController(),
        onGetPhoneNumber: (err, data) => {
          if (!err && data) {
            // data 中包含加密的手机号信息
            // 需要服务端解密获取真实手机号
            this.handlePhoneLogin(data)
          }
        }
      })
    }
  }
}
```

### 10.4 完整登录流程（本项目实现）

```typescript
// CommonLoginImp.ets - 登录实现类
export class CommonLoginImp {

  // 步骤1: 使用授权码换取 Token
  async getAccessToken(code: string): Promise<string> {
    const response = await AtomicLoginHttpUtil.post(
      'https://oauth-login.cloud.huawei.com/oauth2/v3/token',
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }
    )
    return response.access_token
  }

  // 步骤2: 使用 Token 获取用户信息
  async getUserInfo(token: string): Promise<UserInfo> {
    const response = await AtomicLoginHttpUtil.post(
      'https://account.cloud.huawei.com/rest.php?nsp_svc=GOpen.User.getInfo',
      {
        access_token: token,
        getNickName: 1
      }
    )
    return {
      openId: response.openID,
      unionId: response.unionID,
      mobile: response.mobileNumber,
      nickname: response.displayName
    }
  }
}
```

---

## 第十一章 元服务（Atomic Service）开发

### 11.1 什么是元服务

元服务是 HarmonyOS 的轻量级应用形态，核心特征：

- **免安装**：用户无需下载安装，即点即用
- **轻量化**：包体积有严格限制（10MB 以内）
- **卡片呈现**：支持桌面卡片，随时展示信息
- **跨设备流转**：支持在不同设备间无缝流转

### 11.2 元服务 vs 传统应用

| 特性 | 元服务 | 传统应用 |
|------|--------|---------|
| bundleType | `atomicService` | `app` |
| 安装方式 | 免安装 | 需下载安装 |
| 包大小限制 | ≤ 10MB | 无硬性限制 |
| 桌面卡片 | 原生支持 | 可选 |
| 分享传播 | 易于分享 | 需应用市场 |
| 调起方式 | deeplink/卡片/分享 | 桌面图标 |

### 11.3 本项目的元服务配置

```json5
// app.json5
{
  "app": {
    "bundleName": "com.atomicservice.6917576733400044433",
    "bundleType": "atomicService",  // 声明为元服务
    "versionCode": 1000100,
    "versionName": "1.0.1"
  }
}
```

### 11.4 元服务被拉起与参数传递

元服务可以被其他应用/服务拉起，通过 `Want` 传递参数：

```typescript
// EntryAbility.ets
onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam): void {
  // 获取拉起方的信息
  const parentBundle = want?.parameters?.['ohos.extra.param.key.hostPkg'] as string
  AppStorage.setOrCreate('SDK_PARENT_FROM', parentBundle)

  // 获取传入的业务参数
  const entryUrl = want?.parameters?.['url'] as string
  if (entryUrl) {
    AppStorage.setOrCreate('SDK_ENTRY_URL', entryUrl)
  }
}
```

---

## 第十二章 卡片（Widget）开发

### 12.1 卡片概念

卡片（Widget）是元服务/应用在桌面上的信息展示窗口，用户无需打开应用即可获取信息。

### 12.2 卡片开发流程

**第一步：声明卡片配置**

```json5
// module.json5
{
  "module": {
    "extensionAbilities": [
      {
        "name": "WidgetEntryAbility",
        "type": "form",                           // 卡片类型
        "srcEntry": "./ets/widget/WidgetEntryAbility.ets",
        "metadata": [
          {
            "name": "ohos.extension.form",
            "resource": "$profile:form_config"     // 卡片配置文件
          }
        ]
      }
    ]
  }
}
```

**第二步：卡片配置文件**

```json5
// resources/base/profile/form_config.json
{
  "forms": [
    {
      "name": "WidgetCard",
      "description": "酒店信息卡片",
      "src": "./ets/widget/pages/WidgetCard.ets",
      "window": {
        "designWidth": 720,
        "autoDesignWidth": true
      },
      "isDefault": true,
      "colorMode": "auto",
      "supportDimensions": ["2*2"],     // 卡片尺寸
      "defaultDimension": "2*2",
      "updateEnabled": true,
      "scheduledUpdateTime": "10:30",
      "updateDuration": 1
    },
    {
      "name": "WidgetCard2",
      "supportDimensions": ["1*2"],      // 另一种尺寸
      "defaultDimension": "1*2"
    }
  ]
}
```

**第三步：卡片 Ability**

```typescript
// widget/WidgetEntryAbility.ets
import { FormExtensionAbility, formBindingData, formInfo } from '@kit.FormKit'

export default class WidgetEntryAbility extends FormExtensionAbility {
  // 卡片创建时
  onAddForm(want: Want): formBindingData.FormBindingData {
    const data: Record<string, Object> = {
      'hotelName': 'ZenHotel',
      'rating': 4.8
    }
    return formBindingData.createFormBindingData(data)
  }

  // 卡片更新时
  onUpdateForm(formId: string): void {
    // 刷新卡片数据
    const data = formBindingData.createFormBindingData({
      'hotelName': 'ZenHotel Updated'
    })
    formProvider.updateForm(formId, data)
  }

  // 卡片删除时
  onRemoveForm(formId: string): void {
    // 清理资源
  }
}
```

**第四步：卡片 UI**

```typescript
// widget/pages/WidgetCard.ets
@Entry
@ComponentV2
struct WidgetCard {
  @Local hotelName: string = 'ZenHotel'
  @Local rating: number = 0

  build() {
    Column() {
      Text(this.hotelName)
        .fontSize(16)
        .fontWeight(FontWeight.Bold)

      Row() {
        Image($r('app.media.star'))
          .width(16).height(16)
        Text(`${this.rating}`)
          .fontSize(14)
      }
    }
    .width('100%')
    .height('100%')
    .padding(12)
    .onClick(() => {
      // 点击卡片打开元服务
      postCardAction(this, {
        action: 'router',
        abilityName: 'EntryAbility'
      })
    })
  }
}
```

---

## 第十三章 Web 组件集成

### 13.1 ArkWeb 组件

鸿蒙通过 `@kit.ArkWeb` 提供 Web 组件，可以在原生页面中嵌入 H5 内容。

### 13.2 基本使用

```typescript
import { webview } from '@kit.ArkWeb'

@ComponentV2
struct WebPage {
  private controller: webview.WebviewController = new webview.WebviewController()

  build() {
    Column() {
      Web({ src: 'https://example.com', controller: this.controller })
        .javaScriptAccess(true)           // 允许 JS 执行
        .domStorageAccess(true)           // 允许 DOM 存储
        .mixedMode(MixedMode.All)         // 混合内容模式
        .onPageBegin((event) => {
          console.log('页面开始加载: ' + event.url)
        })
        .onPageEnd((event) => {
          console.log('页面加载完成: ' + event.url)
        })
        .onErrorReceive((event) => {
          console.error('加载错误: ' + event.error.getErrorInfo())
        })
    }
  }
}
```

### 13.3 原生与 H5 交互（JSBridge）

```typescript
// 原生调用 H5
this.controller.runJavaScript('window.onNativeMessage("hello")')

// H5 调用原生 - 注册消息端口
Web({ src: url, controller: this.controller })
  .javaScriptProxy({
    object: {
      // 暴露给 H5 的方法
      getToken: () => {
        return 'native-token-xxx'
      },
      showToast: (message: string) => {
        promptAction.showToast({ message })
      }
    },
    name: 'NativeBridge',    // H5 通过 window.NativeBridge 调用
    methodList: ['getToken', 'showToast'],
    controller: this.controller
  })
```

### 13.4 本项目的 Web 集成

本项目通过 `fatomicwebsdk`（Atomic Web SDK）集成 Web 内容：

```typescript
// TemplatePage.ets
@HMRouter({ pageUrl: 'page://TemplatePage' })
@ComponentV2
struct TemplatePage {
  build() {
    Column() {
      // 使用 SDK 提供的 Web 入口组件
      AtomicSDKEntryComponent({
        url: AppStorage.get<string>('SDK_ENTRY_URL') ?? DEFAULT_URL,
        onReady: () => {
          // Web 内容加载就绪
        }
      })
    }
  }
}
```

> 该模式常用于元服务中加载 H5 页面，实现"原生壳 + Web 内容"的混合架构。

---

## 第十四章 多产品构建与变体管理

### 14.1 多 Product 构建概念

鸿蒙支持通过 **Product** 配置实现一套代码构建多个产品版本（类似 Android 的 Build Variants）。

### 14.2 本项目的多产品配置

```json5
// build-profile.json5（应用级）
{
  "app": {
    "products": [
      {
        "name": "default",          // 默认产品（dodopizza）
        "signingConfig": "default",
        "compatibleSdkVersion": "5.0.0(12)",
        "runtimeOS": "HarmonyOS",
        "buildOption": {
          "strictMode": {
            "caseSensitiveCheck": true,
            "useNormalizedOHMUrl": true
          }
        }
      },
      {
        "name": "gitex",            // gitex 变体
        "signingConfig": "gitex_sign",
        "compatibleSdkVersion": "5.0.0(12)",
        "runtimeOS": "HarmonyOS"
      }
    ]
  }
}
```

### 14.3 变体资源覆盖

通过 `variants/` 目录为不同产品提供差异化资源：

```
variants/
├── dodopizza/
│   └── appscope_resources/       # dodopizza 的应用图标、名称等
│       ├── base/
│       │   ├── element/string.json    # 应用名称
│       │   └── media/app_icon.png     # 应用图标
│       └── ...
└── gitex/
    └── appscope_resources/       # gitex 的应用图标、名称等
        ├── base/
        │   ├── element/string.json
        │   └── media/app_icon.png
        └── ...
```

### 14.4 模块级 Target 配置

```json5
// entry/build-profile.json5
{
  "targets": [
    {
      "name": "target_dodopizza",
      "source": {
        "pages": ["src/main/ets/pages/MainPage"]
      }
    },
    {
      "name": "target_gitex",
      "source": {
        "pages": ["src/main/ets/pages/MainPage"]
      }
    }
  ]
}
```

### 14.5 构建产品

```bash
# 在 DevEco Studio 中选择 Product
# Build → Select Product → default / gitex

# 或使用命令行
hvigorw assembleHap --mode module -p product=default
hvigorw assembleHap --mode module -p product=gitex
```

---

## 第十五章 项目架构实战解析

### 15.1 整体架构

本项目采用 **分层模块化架构**：

```
┌─────────────────────────────────────────────┐
│              entry (入口模块)                 │
│  ┌─────────────────────────────────────────┐│
│  │ EntryAbility → MainPage (HMNavigation)  ││
│  │   ├── PlaceholderPage                   ││
│  │   ├── LoginContainerPage                ││
│  │   └── TemplatePage                      ││
│  └─────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────┐│
│  │ Widget (卡片)                            ││
│  │   ├── WidgetCard (2×2)                  ││
│  │   └── WidgetCard2 (1×2)                 ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│         features (特性模块)                   │
│  ┌─────────────────────────────────────────┐│
│  │ TemplateApp                             ││
│  │   └── AtomicSDKEntryComponent (Web)     ││
│  └─────────────────────────────────────────┘│
├─────────────────────────────────────────────┤
│         dz_common (公共库模块)                │
│  ┌──────────┐┌──────────┐┌────────────────┐│
│  │ base/    ││ utils/   ││ module/login/  ││
│  │ 基类     ││ 工具类   ││ 登录模块       ││
│  └──────────┘└──────────┘└────────────────┘│
└─────────────────────────────────────────────┘
```

### 15.2 代码分层模式

项目采用 **Controller-ViewModel-Biz** 分层：

```
┌──────────┐    ┌──────────────┐    ┌─────────┐    ┌──────────┐
│  Page    │───→│  Controller  │───→│   Biz   │───→│  HTTP    │
│  (UI)    │    │  (逻辑控制)   │    │(业务逻辑)│    │  (网络)  │
└──────────┘    └──────┬───────┘    └─────────┘    └──────────┘
                       │
                ┌──────▼───────┐
                │  ViewModel   │
                │ (@ObservedV2)│ ← UI 通过 @Trace 自动响应变化
                └──────────────┘
```

**实际示例**：

```typescript
// 1. Page 层 - 纯 UI 渲染
@HMRouter({ pageUrl: 'page://LoginContainerPage' })
@ComponentV2
struct LoginContainerPage {
  private controller = new LoginController()

  aboutToAppear() {
    this.controller.aboutToAppear()
  }

  build() {
    Column() {
      CommonLoginComponent({
        viewModel: this.controller.viewModel
      })
    }
  }
}

// 2. Controller 层 - 协调逻辑
class LoginController extends BaseController<CommonLoginViewModel> {
  private biz = new LoginBiz()

  aboutToAppear() {
    this.viewModel = new CommonLoginViewModel()
    this.tryAutoLogin()
  }

  async tryAutoLogin() {
    this.viewModel!.isLoading = true
    const result = await this.biz.silentLogin()
    this.viewModel!.isLoading = false
    if (result.success) {
      this.navigateToMain()
    }
  }
}

// 3. ViewModel 层 - 响应式数据
@ObservedV2
class CommonLoginViewModel extends BaseViewModel {
  @Trace isLoading: boolean = false
  @Trace isLoggedIn: boolean = false
  @Trace errorMsg: string = ''
}

// 4. Biz 层 - 纯业务逻辑
class LoginBiz extends BaseBiz {
  async silentLogin(): Promise<LoginResult> {
    const authCode = await UserUtil.loginWithHuaweiID()
    const token = await CommonLoginImp.exchangeToken(authCode)
    const userInfo = await CommonLoginImp.getUserInfo(token)
    return { success: true, userInfo }
  }
}
```

### 15.3 模块依赖关系

```
entry ──────→ dz_common (公共库)
  │               │
  │               ├── base/          BaseController, BaseViewModel, BaseBiz
  │               ├── utils/         AppUtil, SPUtils, LogUtil, HttpUtil, etc.
  │               └── module/login/  登录完整实现
  │
  ├────→ features/TemplateApp (Web 模板)
  │
  ├────→ @hadss/hmrouter (路由库)
  │
  └────→ fatomicwebsdk (Web SDK)
```

### 15.4 关键流程图

**应用启动 → 登录 → 进入主页**：

```
App Launch
  │
  ▼
EntryAbility.onCreate()
  │  初始化 HMRouter、AppUtil
  ▼
EntryAbility.onWindowStageCreate()
  │  加载 MainPage
  ▼
MainPage (HMNavigation)
  │  homePageUrl = PlaceholderPage
  ▼
PlaceholderPage
  │  检查登录状态
  ├─── 已登录 ──→ HMRouterMgr.replace('page://TemplatePage')
  │                  │
  │                  ▼
  │              TemplatePage (加载 Web 内容)
  │
  └─── 未登录 ──→ HMRouterMgr.push('page://LoginContainerPage')
                     │
                     ▼
                 LoginContainerPage
                     │
                     ├── 华为ID静默登录
                     │     │
                     │     ▼
                     │   授权码 → Token → 用户信息 → 登录成功
                     │
                     └── 手机号一键登录
                           │
                           ▼
                         FunctionalButton → 手机号 → 登录成功
                                              │
                                              ▼
                                   HMRouterMgr.replace('page://TemplatePage')
```

---

## 附录 常用 Kit 速查表

| Kit 名称 | 导入方式 | 核心功能 | 本项目使用 |
|----------|---------|---------|-----------|
| **AbilityKit** | `@kit.AbilityKit` | UIAbility、Want、上下文管理 | EntryAbility |
| **ArkUI** | `@kit.ArkUI` | UI 组件、窗口管理、弹窗 | 全局 |
| **ArkWeb** | `@kit.ArkWeb` | Web 组件、WebviewController | TemplatePage |
| **ArkTS** | `@kit.ArkTS` | HashMap、Buffer、工具类 | DataUtils |
| **NetworkKit** | `@kit.NetworkKit` | HTTP 请求、网络状态检测 | HttpUtil |
| **AccountKit** | `@kit.AccountKit` | 华为 ID 登录认证 | UserUtil |
| **BasicServicesKit** | `@kit.BasicServicesKit` | 错误处理、事件管理 | 全局 |
| **FormKit** | `@kit.FormKit` | 卡片开发 | WidgetEntryAbility |
| **ScenarioFusionKit** | `@kit.ScenarioFusionKit` | 一键登录按钮 | LoginPage |
| **PerformanceAnalysisKit** | `@kit.PerformanceAnalysisKit` | HiLog 日志 | LogUtil |
| **LocalizationKit** | `@kit.LocalizationKit` | 资源管理、国际化 | AppUtil |
| **StoreKit** | `@kit.StoreKit` | 隐私管理 | 隐私协议 |

### 常用 ArkUI 组件速查

| 组件 | 用途 | 示例 |
|------|------|------|
| `Text` | 文本显示 | `Text('Hello').fontSize(16)` |
| `Image` | 图片显示 | `Image($r('app.media.icon')).width(40)` |
| `Button` | 按钮 | `Button('确定').onClick(() => {})` |
| `TextInput` | 输入框 | `TextInput({ placeholder: '请输入' })` |
| `Column` | 垂直布局 | `Column() { ... }.width('100%')` |
| `Row` | 水平布局 | `Row() { ... }.justifyContent(FlexAlign.SpaceBetween)` |
| `Stack` | 堆叠布局 | `Stack() { ... }.alignContent(Alignment.Center)` |
| `List` | 列表 | `List() { ForEach(...) { ListItem() {} } }` |
| `Scroll` | 滚动容器 | `Scroll() { Column() { ... } }` |
| `Web` | Web 视图 | `Web({ src: url, controller: ctrl })` |
| `Navigation` | 导航容器 | `Navigation() { ... }` |
| `LoadingProgress` | 加载指示器 | `LoadingProgress().width(48)` |

### 常用装饰器速查

| 装饰器 | 版本 | 用途 |
|--------|------|------|
| `@Entry` | V1/V2 | 标记页面入口组件 |
| `@ComponentV2` | V2 | 声明自定义组件 |
| `@Local` | V2 | 组件内部状态 |
| `@Param` | V2 | 父组件传入的只读属性 |
| `@Event` | V2 | 子组件向父组件发送事件 |
| `@Provider` | V2 | 跨层级向下提供数据 |
| `@Consumer` | V2 | 跨层级消费祖先提供的数据 |
| `@ObservedV2` | V2 | 标记类为可观察对象 |
| `@Trace` | V2 | 标记属性为可追踪（响应式） |
| `@Builder` | V1/V2 | 轻量 UI 构建函数 |
| `@HMRouter` | 第三方 | HMRouter 页面路由注册 |

---

> **文档版本**：1.0
> **适用 SDK**：HarmonyOS NEXT API 12+
> **项目参考**：AtomicService_ZenHotel
> **最后更新**：2026-03-26
