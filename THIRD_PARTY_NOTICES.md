# Third-Party Notices

本文件列出 Brassigloss 使用、参考或随仓库分发的第三方项目、内容与软件。项目根目录的 Apache-2.0 `LICENSE` 仅适用于 Brassigloss 自主编写的软件代码，不应被解释为对下列第三方内容重新授权。

## Verdigloss

本项目在应用架构、产品设计、交互方式和功能范围方面参考了 Verdigloss。

- 项目：<https://github.com/SkyEye-FAST/verdigloss>
- 版权：Copyright (c) 2025-2026 SkyEye_FAST
- 许可证：Apache License 2.0

如果本仓库中的任何文件改编自 Verdigloss，则该文件仍受 Apache License 2.0 约束，并保留适用的版权、许可证和归属声明。Verdigloss 的名称及相关标识归其权利人所有。

## 游戏和模组翻译内容

本仓库包含或生成以下第三方游戏与模组相关的翻译键、原文、译文、名称和其他文本：

- `data/create/**`
- `data/create-aeronautics/**`
- `data/ChantsOfSennaar/**`
- 从上述文件生成的 `public/data/translations.json`

其中涉及但不限于：

- Minecraft Java Edition 及其相关内容和商标
- Create 模组及其附属模组，包括 Create Aeronautics、Simulated 和 Offroad
- 《Chants of Sennaar》及其相关内容和商标
- 上述游戏和模组的开发者、发行商、译者和社区贡献者

这些第三方文本、名称、商标和翻译内容归其各自权利人所有。Brassigloss 的 Apache-2.0 许可证不授予复制、修改、分发、商业化或再许可这些第三方内容的权利。

本仓库收录相关文本的目的限于翻译浏览、对照、研究和非商业参考。使用者应自行确认其使用方式符合相关权利方的许可、社区翻译政策、游戏或模组发行条款以及适用法律。

任何第三方权利方如需更正署名、补充许可证信息或要求移除内容，请通过本仓库的 Issue 联系维护者。

## 开源软件依赖

本项目使用 Vue、Vite、`@vitejs/plugin-vue` 及其传递依赖。这些软件由各自作者和贡献者开发，并依照其随包提供的许可证授权，通常包括 MIT License 或其他兼容的开源许可证。

准确的依赖版本和来源记录在 `pnpm-lock.yaml` 中。重新分发生产构建、源代码包或安装包时，应根据实际打包内容保留相应依赖的版权和许可证声明。各依赖的具体条款以其发布包中的 `LICENSE`、`COPYING`、`NOTICE` 或其他许可证文件为准。

## 商标和隶属关系

Minecraft、Create、Create Aeronautics、Simulated、Offroad、Chants of Sennaar、Verdigloss 及其他名称和标识可能是其各自权利人的商标或注册商标。

Brassigloss 与上述游戏、模组、项目的开发者、发行商或维护者不存在隶属、赞助、认证或官方认可关系。相关名称仅用于说明兼容对象、数据来源或参考关系。

## 项目许可证范围

Brassigloss 自主编写的软件代码采用 Apache License 2.0。该许可证不覆盖：

- 第三方游戏、模组或软件的源代码；
- 第三方原文、译文、术语、名称、图标、图像、音频或其他资源；
- 属于其他权利人的商标、品牌和产品标识；
- 仓库中明确标注为其他许可证的内容。

如本文件与项目根目录 [LICENSE](LICENSE) 存在冲突，就自主编写的软件代码而言，以 Apache License 2.0 为准；就第三方内容而言，以相应权利方的许可证或使用条款为准。
