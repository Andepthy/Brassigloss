# Brassigloss

Brassigloss 是一个用于浏览、搜索和对照游戏及模组翻译文本的 Vue 3 单页应用。

项目当前包含 Create、Create Aeronautics、Simulated、Offroad 和《Chants of Sennaar》的翻译数据，可按项目、语言和文本分类筛选，并在表格中并排查看原文与译文。

> 重要：本项目的 Apache-2.0 许可证仅适用于项目自主编写的软件代码。游戏、模组、发行商及其本地化贡献者提供的名称、原文、译文和其他第三方内容不适用该许可证。详细信息请参阅 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## 功能

- 按翻译键或任意语言文本搜索
- 按项目、语言和文本分类进行多选筛选
- 根据所选项目动态显示可用语言列
- 深色与浅色主题切换
- 衬线字体与无衬线字体切换
- 响应式翻译对照表

## 技术栈

- Vue 3
- Vite 6
- pnpm

## 项目结构

```text
.
|-- data/
|   |-- create/                         # Create 翻译数据
|   |-- create-aeronautics/             # Create Aeronautics 相关数据
|   `-- ChantsOfSennaar/                # Chants of Sennaar CSV 数据
|-- public/data/translations.json       # 应用运行时读取的生成文件
|-- scripts/
|   |-- lib/                            # CSV、数据源发现等预处理模块
|   |-- windows/                        # Windows 便捷启动和维护脚本
|   `-- preprocess.mjs                  # 翻译数据预处理入口
|-- src/
|   |-- app/                            # 应用启动与挂载
|   |-- assets/styles/                  # 全局样式
|   |-- components/                     # 通用、查询和表格组件
|   |-- composables/                    # 页面状态组合式函数
|   |-- data/                           # 静态语言目录
|   |-- features/                       # 筛选、分页等领域功能
|   |-- services/                       # 外部数据访问
|   |-- App.vue                         # 页面编排
|   `-- main.js                         # 浏览器入口
|-- index.html
|-- package.json
|-- pnpm-lock.yaml
|-- vite.config.js
|-- LICENSE
|-- README.md
`-- THIRD_PARTY_NOTICES.md
```

`public/data/translations.json` 由 `scripts/preprocess.mjs` 从根目录的 `data/` 生成。构建和运行应用前，应确保该文件已生成或更新。

## 本地开发

需要 Node.js 20 或更高版本，以及 pnpm。

在仓库根目录执行：

```shell
pnpm install
pnpm preprocess
pnpm dev
```

开发服务器默认运行于：

```text
http://localhost:5173
```

`pnpm preprocess` 会重新读取 `data/` 下的 JSON 和 CSV 文件，并覆盖生成 `public/data/translations.json`。更新数据后需要重新执行该命令。

## 构建与预览

```shell
pnpm build
pnpm preview
```

生产构建输出到 `dist/`。

## 可用命令

在仓库根目录执行：

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm preprocess` | 根据 `data/` 重新生成 `public/data/translations.json` |
| `pnpm test` | 运行数据处理和前端逻辑的单元测试 |
| `pnpm build` | 创建生产构建 |
| `pnpm preview` | 本地预览生产构建 |

## 第三方内容

以下内容属于各自的游戏、模组、发行商、开发者或本地化贡献者，不属于本项目代码许可证的授权范围：

- `data/create/**`
- `data/create-aeronautics/**`
- `data/ChantsOfSennaar/**`
- `public/data/translations.json` 中由上述数据生成的内容

本仓库为翻译研究、对照和非商业参考用途收录这些文本。项目维护者不主张拥有第三方游戏名称、原文、译文、商标或其他知识产权的所有权。若相关权利方希望更正署名或移除内容，请通过仓库 Issue 联系维护者。

Verdigloss 是本项目设计与功能上的重要参考：

- 项目：<https://github.com/SkyEye-FAST/verdigloss>
- 作者：SkyEye_FAST
- 许可证：Apache License 2.0

本项目与 Mojang Studios、Microsoft、Create 模组团队、相关附属模组作者及《Chants of Sennaar》的权利方不存在隶属、赞助或官方认可关系。所有产品名称和商标归其各自权利人所有。

## 许可证

除明确标注为第三方内容的部分外，本项目自主编写的软件代码采用 [Apache License 2.0](LICENSE) 授权。

Copyright (c) 2026 Brassigloss contributors

第三方软件依赖仍受其各自许可证约束；完整依赖关系记录在 `pnpm-lock.yaml` 中。第三方声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
