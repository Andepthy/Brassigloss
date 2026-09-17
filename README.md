<div align="center">
<img src="https://raw.githubusercontent.com/Andepthy/Brassigloss/main/public/favicon.svg" width="128" alt="Brassigloss icon">

---

# Brassigloss

![GitHub License](https://img.shields.io/github/license/Andepthy/Brassigloss)
[![GitHub stars](https://img.shields.io/github/stars/Andepthy/Brassigloss)](https://github.com/Andepthy/Brassigloss/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Andepthy/Brassigloss)](https://github.com/Andepthy/Brassigloss/issues)
</div>

Brassigloss 是一个用于浏览、搜索和对照游戏及模组翻译文本的 Vue 3 单页应用。

项目当前包含 Create、Create Aeronautics、Simulated、Offroad 和《Chants of Sennaar》的翻译数据，可按项目、语言和文本分类筛选，并在表格中并排查看原文与译文。

> 本项目的 Apache-2.0 许可证仅适用于自主编写的软件代码。游戏、模组、发行商及其本地化贡献者提供的名称、原文、译文和其他第三方内容不适用该许可证。详细信息请参阅 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 来源与 AI 披露

- 本项目借鉴自 [Verdigloss](https://github.com/SkyEye-FAST/verdigloss)，并在其应用架构、产品设计、交互方式和功能范围的基础上针对当前翻译数据进行了调整。本项目不是 Verdigloss 的官方分支、续作或认可版本。
- 本项目在开发过程中借助 AI 编码工具辅助编写、重构和整理代码、文档及测试相关内容。AI 生成或修改的内容由项目维护者审阅、调整并负责。

## 在线演示

Brassigloss 通过 GitHub Pages 发布：

- <https://andepthy.github.io/Brassigloss/>

## 功能

- [x] 按翻译键或任意已选语言文本搜索
- [x] 按项目、语言和文本分类进行多选筛选
- [x] 根据所选项目动态显示可用语言列
- [x] 分页浏览大量翻译条目
- [x] 深色与浅色主题切换
- [x] 衬线字体与无衬线字体切换
- [x] 响应式翻译对照表

## 技术栈

- Vue 3
- Vite 6
- pnpm

## 架构

- `src/app/` 配置应用启动与挂载。
- `src/components/` 包含应用标题、查询控件、分页和翻译对照表。
- `src/composables/` 管理主题、字体和紧凑布局偏好。
- `src/features/` 包含筛选、项目编目和分页等业务逻辑。
- `src/services/` 加载运行时翻译数据。
- `scripts/preprocess.mjs` 负责发现数据源并生成应用使用的统一 JSON。
- `scripts/lib/` 提供 CSV 解析和数据源发现等预处理模块。
- `scripts/windows/` 提供 Windows 下的便捷启动与数据更新脚本。

主要目录结构如下：

```text
.
|-- data/
|   |-- create/                         # Create 翻译数据
|   |-- create-aeronautics/             # Create Aeronautics、Simulated 和 Offroad 数据
|   `-- ChantsOfSennaar/                # Chants of Sennaar CSV 数据
|-- public/data/translations.json       # 应用运行时读取的生成文件
|-- scripts/                            # 数据预处理与便捷脚本
|-- src/                                # Vue 应用源码
|-- index.html
|-- package.json
|-- pnpm-lock.yaml
|-- vite.config.js
|-- LICENSE
|-- README.md
`-- THIRD_PARTY_NOTICES.md
```

## 开发

Brassigloss 需要 Node.js 20 或更高版本，并使用 pnpm 管理依赖。

1. 安装依赖：

   ```shell
   pnpm install
   ```

2. 从 `data/` 生成应用使用的翻译数据：

   ```shell
   pnpm preprocess
   ```

3. 启动开发服务器：

   ```shell
   pnpm dev
   ```

4. 在浏览器中打开 <http://localhost:5173/>。

常用命令如下：

```shell
pnpm dev          # 启动 Vite 开发服务器
pnpm preprocess   # 重新生成 public/data/translations.json
pnpm test         # 运行数据处理和前端逻辑测试
pnpm build        # 创建生产构建
pnpm preview      # 本地预览生产构建
```

`pnpm preprocess` 会读取 `data/` 下的 JSON 和 CSV 文件，并覆盖生成 `public/data/translations.json`。首次运行或更新数据后，应先执行该命令。

## 翻译数据

预处理脚本会递归发现 `data/` 中包含 `en_us.json` 和 `zh_cn.json` 的目录，并将它们作为一组语言对处理。Create 及其附属项目使用 Minecraft 风格的翻译键；《Chants of Sennaar》的数据来自 CSV，目前包含英语、法语、简体中文和繁体中文。

所有数据最终统一写入 `public/data/translations.json`。该文件由脚本生成，不应手动修改。

## 部署

`.github/workflows/deploy-pages.yml` 会在推送到 `main` 或手动触发时执行依赖安装、翻译数据生成和生产构建，并将 `dist/` 发布到 GitHub Pages。

## 第三方内容

以下内容属于各自的游戏、模组、发行商、开发者或本地化贡献者，不属于本项目代码许可证的授权范围：

- `data/create/**`
- `data/create-aeronautics/**`
- `data/ChantsOfSennaar/**`
- `public/data/translations.json` 中由上述数据生成的内容

本仓库为翻译研究、对照和非商业参考用途收录这些文本。项目维护者不主张拥有第三方游戏名称、原文、译文、商标或其他知识产权的所有权。若相关权利方希望更正署名或移除内容，请通过仓库 Issue 联系维护者。

本项目借鉴自 Verdigloss：

- 项目：<https://github.com/SkyEye-FAST/verdigloss>
- 作者：SkyEye_FAST
- 许可证：Apache License 2.0

本项目与 Mojang Studios、Microsoft、Create 模组团队、相关附属模组作者及《Chants of Sennaar》的权利方不存在隶属、赞助或官方认可关系。所有产品名称和商标归其各自权利人所有。

## 许可证

除明确标注为第三方内容的部分外，本项目自主编写的软件代码采用 [Apache License 2.0](LICENSE) 授权。

```text
    Brassigloss
    Copyright (c) 2026 Brassigloss contributors

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

第三方软件依赖仍受其各自许可证约束；完整依赖关系记录在 `pnpm-lock.yaml` 中。第三方声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 反馈

如遇到问题或有功能建议，欢迎提交 Issue。也欢迎提交 Pull Request。
