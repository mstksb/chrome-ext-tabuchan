---
lang: zh-CN
---

# 发布记录

[English](releases.md) | [日本語](releases.ja.md) | 简体中文 | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

2026 年 11 月 11 日，现有 README 和公开资料通过 GitHub Pages 发布，来源为 `main` 分支根目录。README 作为主页，GitHub Pages 标准 Jekyll 处理将相对 Markdown 链接转换为 HTML 网址。页面继续以 Markdown 编辑。扩展的 `src/`、`options.html` 和 `manifest.json` 不参与网站生成。

首次发布时，[使用说明](https://mstksb.github.io/chrome-ext-tabuchan/)和[隐私政策草案](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)的标准构建与部署成功，已确认可通过 HTTPS 无需登录访问，并在浏览器中查看了正文。发布者名称、联系方式和生效日期仍未确定，政策尚不是可提交商店的定稿。该历史验证不代表本次新增翻译已部署。

## 0.1.0

公开候选版本包含短按切换最近标签页、长按打开列表、最近使用顺序与标签页顺序切换、分组显示、标题搜索和快捷键／行为设置。

设置和列表支持日语及英语，Chrome 显示语言非日语时使用英语。搜索独立于界面语言，在 Unicode NFC 规范化后进行不区分大小写的子串匹配。文档翻译不会扩展界面的语言支持。

| 项目 | 内容 |
| --- | --- |
| 版本 | SemVer 和清单均为 `0.1.0` |
| 分发 ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip)，包含 20 个运行文件，清单位于根目录 |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| 校验和文件 | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| 运行要求 | 支持 Manifest V3 的 Google Chrome；清单要求最低 Chrome 102 |
| 商店状态 | 此国际化 ZIP 的上传／接收结果、审核／发布状态及商店项目 ID／网址均未验证 |

## 已验证范围

2026 年 11 月 10 日，在 macOS、Chrome `156.0.8078.80` 上验证了日语界面及主要操作：短按／长按、选择／取消、标签页顺序与分组、设置保存、iframe 输入、受限标签页、搜索和输入法组合输入期间的事件转发。在独立目录解压 ZIP 后，也验证了日语界面和 NFC 搜索。

2026 年 11 月 11 日，在 macOS、Chrome `157.0.8103.40`、界面语言 `ja` 下，使用本仓库运行文件验证了 17 组主要操作，包括设置中的版本显示 `0.1.0`。重新加载扩展后的恢复运行尚未验证。

配置和自动化检查覆盖日英翻译键、清单引用、NFC 预组合／组合字符以及多语言和表情符号的子串匹配。英语界面布局使用相同界面代码和英语字典的截图专用配置验证。

[商店资料](store/listing.zh-CN.md#截图)包含日语和英语设置／列表截图。图片均为不透明的 1280×800 PNG；列表使用截图示例标签页。

## 尚未验证或确定

- Windows、Linux、旧版 Chrome 以及操作系统各语言输入法。
- 原始双语言包在实际英语环境中的显示，以及不支持语言环境下的英语回退。
- 普通 Chrome 中重新加载扩展后的恢复运行。
- 发布者／联系信息、许可证、分发范围和目标国家。
- 政策发布者、联系方式、生效日期，以及包含 HTTP 网站图标请求在内的数据处理合规性。
- Dashboard 中商店资料／隐私申报的保存结果及审核／发布状态。

请在提交商店前完成这些事项。当前申报草案和政策草案属于准备资料，不能作为提交条件已满足的证明。
