# 多 Product 构建改造说明

> 更新日期：2026-03-26
> 分支：feature/gitex_sdk

---

## 一、背景与问题

项目当前有 90+ 个 git 分支，每个分支对应一个应用变体（Gitex、DurianBB、Keeta、VisitDubai 等）。每次新增应用需要：

1. 基于某个分支创建新分支
2. 替换 `entry/src/main/resources/rawfile/templateJs.json`
3. 替换签名证书
4. 修改 `build-profile.json5` 中的 bundleName、版本号、签名配置
5. 修改 AppScope 资源（app_name、app_icon）

**痛点**：维护成本高，公共代码更新需要逐分支合并，容易遗漏。

---

## 二、改造方案

利用 HarmonyOS 原生的 **多 Product + 资源目录覆盖（Resource Overlay）** 机制，将所有应用变体统一到一个分支管理。

### 核心原理

1. 根 `build-profile.json5` 定义多个 product，每个 product 有独立的 bundleName、版本和 AppScope 资源目录
2. `entry/build-profile.json5` 为每个 product 定义独立的 target，指定资源覆盖目录
3. 构建时资源覆盖机制自动将变体的 `templateJs.json` 替换默认资源
4. 代码中 `FileUtil.getRawFileContentStrSync("templateJs.json")` **无需任何改动**

### 签名策略

- **Debug（开发测试）**：所有变体**共用一套测试证书**（`keeta_abroad_sign/`），无需为每个应用单独配置
- **Release（上线发布）**：每个变体配置独立的 release 证书，仅在需要发布时配置

### 重要约束（开发中踩坑）

| 约束 | 说明 |
|------|------|
| Product 必须有 `"default"` | HarmonyOS 构建系统强制要求，第一个变体自动命名为 `"default"` |
| `applyToProducts` 位置 | **只能**写在根 `build-profile.json5` 的 modules 中，不能写在模块级配置中 |
| 签名 `material/` 目录 | 必须和 `.p12` 文件在同一目录下，迁移签名时不能遗漏 |

---

## 三、目录结构

### 整体结构

```
项目根目录/
├── keeta_abroad_sign/                   # 📌 共享测试证书（所有变体 debug 通用）
│   ├── newSdkModel.p12
│   ├── material/                        # 密钥材料（必须存在）
│   └── debug/
│       ├── newSdkModelDebugDebug.p7b
│       └── newSdkModeDebug.cer
│
├── variants/                            # 📌 各应用变体目录
│   ├── gitex/
│   │   ├── variant.json5                # 变体元信息
│   │   ├── sign/                        # release 签名（可选，仅上线时需要）
│   │   │   └── release/
│   │   │       ├── gitex.p12
│   │   │       ├── material/
│   │   │       ├── gitexRelease.p7b
│   │   │       └── gitexRelease.cer
│   │   ├── entry_resources/             # entry 资源覆盖
│   │   │   └── rawfile/
│   │   │       └── templateJs.json      # Web 应用配置
│   │   └── appscope_resources/          # AppScope 资源覆盖
│   │       └── base/
│   │           ├── element/
│   │           │   └── string.json      # app_name 等
│   │           └── media/
│   │               ├── app_icon.png     # 应用图标
│   │               └── startIcon.png    # 启动图
│   ├── durianbb/                        # 另一个变体（结构相同）
│   └── keeta/                           # ...
│
├── tools/
│   └── generate_build_profile.ts        # 自动生成构建配置
│
├── build-profile.json5                  # 根构建配置（由脚本生成）
└── entry/build-profile.json5            # entry 模块配置（由脚本生成）
```

### 每个变体只需提供

| 文件 | 必须 | 说明 |
|------|------|------|
| `variant.json5` | 是 | bundleName、版本号等元信息 |
| `entry_resources/rawfile/templateJs.json` | 是 | Web 应用配置 |
| `appscope_resources/base/element/string.json` | 是 | app_name、widget 字符串 |
| `appscope_resources/base/media/app_icon.png` | 是 | 应用图标 |
| `appscope_resources/base/media/startIcon.png` | 是 | 启动图标 |
| `sign/release/` | 否 | release 签名证书（仅上线时需要） |

---

## 四、文件变更清单

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| `variants/gitex/variant.json5` | 新增 | Gitex 变体元信息 |
| `variants/gitex/entry_resources/rawfile/templateJs.json` | 新增 | 从 entry 迁移 |
| `variants/gitex/appscope_resources/` | 新增 | 从 AppScope/templateResources 迁移 |
| `tools/generate_build_profile.ts` | 新增 | 自动化配置生成脚本 |
| `build-profile.json5` | 修改 | 重构为多 Product + 共享 debug 签名 |
| `entry/build-profile.json5` | 修改 | 新增 target_gitex 资源覆盖 |
| `TemplatePage.ets` | 修改 | 修复 2 处硬编码 |
| `WidgetCard.ets` | 修改 | TITLE/SUB_TITLE 改为读资源字符串 |
| `WidgetCard2.ets` | 修改 | TITLE 改为读资源字符串 |
| `entry/.../rawfile/templateJs.json` | 删除 | 已迁移至 variants |

---

## 五、代码变更详情

### 5.1 build-profile.json5（根目录）

**签名配置**：从每个变体独立签名改为共享 debug 签名

```json5
"signingConfigs": [
  {
    "name": "default",                              // 共享测试证书
    "type": "HarmonyOS",
    "material": {
      "storeFile": "./keeta_abroad_sign/newSdkModel.p12",  // 公共路径
      ...
    }
  }
  // release 签名按需添加（由生成脚本根据 variant.json5 自动生成）
]
```

**Product 配置**：所有变体统一使用 `"default"` 签名

```json5
"products": [
  {
    "name": "default",                               // 第一个变体 = default
    "signingConfig": "default",                      // 使用共享测试证书
    "resource": { "directories": ["./variants/gitex/appscope_resources"] },
    "bundleName": "com.atomicservice.6917576733400044433",
    ...
  }
]
```

### 5.2 entry/build-profile.json5

为每个变体定义 target 资源覆盖（**不含** `applyToProducts`，该字段在根配置中）：

```json5
"targets": [
  {
    "name": "target_gitex",
    "resource": {
      "directories": [
        "./src/main/resources",                     // 基础资源
        "../variants/gitex/entry_resources"          // 覆盖 templateJs.json
      ]
    }
  }
]
```

### 5.3 TemplatePage.ets

修复硬编码，使其适配任意变体：

```typescript
// 修改前
.setFrom("durianbb")
this.helper?.getController()?.loadUrl("https://durianbbworld.com/zh")

// 修改后（从 templateJs.json 动态读取）
.setFrom(this.info.title?.toLowerCase() ?? "app")
this.helper?.getController()?.loadUrl(this.info.url)
```

### 5.4 WidgetCard.ets / WidgetCard2.ets

卡片标题从硬编码改为读取资源字符串，自动跟随变体的 `app_name`：

```typescript
// 修改前
readonly TITLE: string = 'Gitex';
readonly SUB_TITLE: string = 'Gitex';

// 修改后（自动读取各变体 string.json 中的 app_name）
readonly TITLE: Resource = $r('app.string.app_name');
readonly SUB_TITLE: Resource = $r('app.string.app_name');
```

卡片中的 `$r("app.media.app_icon")` 同理，会自动使用各变体 `appscope_resources/base/media/app_icon.png`。

---

## 六、variant.json5 字段说明

```json5
{
  "name": "gitex",                             // 变体名称
  "bundleName": "com.atomicservice.xxx",       // 应用包名
  "bundleType": "atomicService",               // 包类型
  "versionCode": 1000100,                      // 版本号
  "versionName": "1.0.1",                      // 版本名
  "compatibleSdkVersion": "5.0.2(14)",         // 最低兼容 SDK

  // release 签名（可选 —— 仅上线构建时需要，开发阶段不配置）
  "releaseSigningConfig": {
    "storeFile": "./variants/gitex/sign/release/gitex.p12",
    "storePassword": "...",
    "keyAlias": "...",
    "keyPassword": "...",
    "signAlg": "SHA256withECDSA",
    "profile": "./variants/gitex/sign/release/gitexRelease.p7b",
    "certpath": "./variants/gitex/sign/release/gitexRelease.cer"
  }
}
```

**开发阶段**：不需要配置 `releaseSigningConfig`，所有变体使用共享测试证书即可调试。
**上线阶段**：填写 `releaseSigningConfig`，在 DevEco Studio 中将签名切换为对应的 release 配置。

---

## 七、自动化脚本

### 功能

`tools/generate_build_profile.ts` 扫描 `variants/*/variant.json5`，自动生成：
- 根 `build-profile.json5`（含共享 debug 签名 + 各变体 release 签名 + 所有 product + 模块映射）
- `entry/build-profile.json5`（含所有 target 和资源覆盖目录）

### 运行

```bash
npx ts-node tools/generate_build_profile.ts
```

### 输出示例

```
=== 多 Product 构建配置生成器 ===

项目根目录: D:\Project\XNHZ\AtomicService_ZenHotel
扫描目录: D:\Project\XNHZ\AtomicService_ZenHotel\variants
共享 Debug 签名: ./keeta_abroad_sign/newSdkModel.p12

  发现变体: gitex (com.atomicservice.6917576733400044433)

共发现 1 个变体，开始生成配置...

  -> 已生成: build-profile.json5
  -> 已生成: entry/build-profile.json5

=== 完成！共生成 1 个 product 配置 ===

签名策略:
  Debug (所有变体): ./keeta_abroad_sign/newSdkModel.p12

构建命令示例:
  注意: 第一个变体 (gitex) 的 product 名称为 "default"

  # gitex (debug)
  hvigorw assembleHap -p product=default -p buildMode=debug
```

---

## 八、构建方式

### Debug 构建（开发测试）

所有变体共用测试证书，直接切换 Product 即可：

```bash
# DevEco Studio: Product 下拉选择对应变体 → Run
# 命令行:
hvigorw assembleHap -p product=default -p buildMode=debug
```

### Release 构建（上线发布）

1. 确保 `variant.json5` 中已配置 `releaseSigningConfig`
2. 运行生成脚本重新生成配置
3. 在 DevEco Studio 中将签名切换为 `xxxRelease`
4. 构建 release 包

```bash
npx ts-node tools/generate_build_profile.ts
hvigorw assembleHap -p product=default -p buildMode=release
```

---

## 九、构建流程对比

| 环节 | 改造前（多分支） | 改造后（多 Product） |
|------|----------------|---------------------|
| 新增应用 | 创建分支 → 改模板 → 改签名 → 改配置 | 添加 variants 目录 → 运行脚本 |
| 公共代码更新 | 逐分支 merge/rebase | 改一次，所有应用生效 |
| 签名管理 | 每个分支各自配置 | debug 共享，release 按需配置 |
| 模板管理 | 同一文件不同分支 | 各自独立目录 |
| 图标/卡片 | 每个分支各自替换 | 资源覆盖自动切换 |
| 构建方式 | 切换分支 → 构建 | 切换 Product → 构建 |
| CI/CD | checkout 不同分支 | `-p product=xxx` |

---

## 十、注意事项

1. **Product 命名**：HarmonyOS 强制要求有 `"default"` product。生成脚本自动将第一个变体（按目录名字母排序）设为 `"default"`。

2. **applyToProducts 位置**：只能在根 `build-profile.json5` → `modules` → `targets` 中使用。写在模块级 `entry/build-profile.json5` 会导致 Schema 校验失败。

3. **签名 material 目录**：`.p12` 文件依赖同目录下的 `material/` 子目录。迁移签名时必须完整复制。

4. **卡片自动适配**：`WidgetCard.ets` 中的标题和图标已改为读取资源引用（`$r('app.string.app_name')`、`$r("app.media.app_icon")`），会自动使用各变体的资源。如需不同的卡片背景图，在变体的 `entry_resources/base/media/` 或 `appscope_resources/base/media/` 中放入同名图片即可。

5. **rawfile overlay 备选**：如果资源覆盖对 rawfile 不生效，可在 `entry/hvigorfile.ts` 中添加构建钩子复制文件。

---

## 附录：新增应用操作指南

以新增 `visitdubai` 为例：

### 步骤 1：创建目录

```bash
mkdir -p variants/visitdubai/{sign/release,entry_resources/rawfile,appscope_resources/base/{element,media}}
```

### 步骤 2：准备文件

**templateJs.json** — 放入 `variants/visitdubai/entry_resources/rawfile/`

**string.json** — 放入 `variants/visitdubai/appscope_resources/base/element/`：

```json
{
  "string": [
    { "name": "app_name", "value": "Visit Dubai" },
    { "name": "widget_desc", "value": "Visit Dubai" },
    { "name": "widget_display_name", "value": "Visit Dubai" },
    { "name": "CAMERA", "value": "获取相机权限，用于应用内服务使用" },
    { "name": "MICROPHONE", "value": "获取麦克风权限，用于应用内服务使用" }
  ]
}
```

**图标** — 放入 `variants/visitdubai/appscope_resources/base/media/`：
- `app_icon.png`（应用图标）
- `startIcon.png`（启动图标）

### 步骤 3：创建 variant.json5

```json5
{
  "name": "visitdubai",
  "bundleName": "com.atomicservice.xxxxxxxxxxxx",
  "bundleType": "atomicService",
  "versionCode": 1000000,
  "versionName": "1.0.0",
  "compatibleSdkVersion": "5.0.2(14)"
  // 开发阶段无需配置 releaseSigningConfig
}
```

### 步骤 4：生成配置

```bash
npx ts-node tools/generate_build_profile.ts
```

### 步骤 5：构建

```bash
# DevEco Studio: Sync → Product 下拉选择 visitdubai → Run
# 命令行:
hvigorw assembleHap -p product=visitdubai -p buildMode=debug
```

### 步骤 6（上线时）：配置 release 签名

在 `variant.json5` 中添加 `releaseSigningConfig`，放入 release 证书到 `sign/release/`，重新运行生成脚本。
