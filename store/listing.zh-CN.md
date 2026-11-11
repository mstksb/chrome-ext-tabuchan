---
lang: zh-CN
---

# Chrome 应用商店资料草案

[English](listing.md) | [日本語](listing.ja.md) | 简体中文 | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | [Deutsch](listing.de.md)

本草案基于公开候选版本 `0.1.0`。已确定信息和待办事项见[发布记录](../releases.zh-CN.md)。

## 基本信息

| 字段 | 草案／当前状态 |
| --- | --- |
| 名称 | tabuchan |
| 版本 | 0.1.0，首次公开候选版本 |
| 文档／商店文案语言 | 英语、日语、简体中文、繁体中文、巴西葡萄牙语、西班牙语、德语；以英语为基础。Dashboard 保存值尚未验证 |
| 扩展界面语言 | Chrome 显示语言为日语时用日语，否则用英语；文档语言不代表界面支持 |
| 建议类别 | Functionality & UI，依据包含标签页和快捷键管理的现行官方分类；Dashboard 保存值尚未验证 |
| 简介 | 短按切换最近标签页，长按浏览、搜索并选择当前窗口中的标签页。 |
| 主页／支持 | [使用说明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-CN.html)；支持渠道由发布者确定 |
| 分发范围／国家 | 由发布者确定 |
| 隐私政策网址 | [公开网址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-CN.html)，发布者信息和生效日期待定，提交前须定稿 |

## 详细说明

tabuchan 通过快捷键切换当前窗口中的标签页。

短按后退或前进快捷键，按固定的最近使用顺序移动。默认跳过无法使用快捷键的标签页。

长按整个快捷键组合可打开列表。上下方向键选择，Enter 切换，Esc 取消。松开快捷键后列表仍显示。

按左方向键切换最近使用顺序和标签页顺序。标签页顺序列表保留分组层级，支持用 Unicode 文本筛选标题，与界面语言无关。搜索采用 NFC 规范化后不区分大小写的子串匹配。

每个操作可设置多个快捷键。长按时间为 0.5–2 秒，历史记录为过去的 10–30 个标签页，默认分别为 1 秒和 10 个。

macOS 默认后退键为 Control + Shift + J，前进键为 Control + Shift + K；其他平台使用 Alt + Shift + J／K。可在设置中实际按下组合来修改。

快捷键从普通 HTTP(S) 网页及 iframe 内触发，无法从 Chrome 内部页面、Chrome 应用商店、其他扩展页面、本地文件或地址栏触发。仍可从普通网页打开列表并选择受限标签页。

历史记录和设置在本地处理并保存。显示网站图标可能向图片提供者发送请求，详情见隐私政策。

## 截图

| 素材 | 内容／准备状态 |
| --- | --- |
| 商店图标 | [tab-128.png](../icons/tab-128.png)，由现有标签页图案转换成 128×128 PNG |
| 英语设置 | [options-en-1280x800.png](images/options-en-1280x800.png)，1280×800 英语设置界面 |
| 英语列表 | [picker-en-1280x800.png](images/picker-en-1280x800.png)，1280×800，实际按键打开的标签页顺序列表和 Work 分组 |
| 日语设置 | [options-1280x800.png](images/options-1280x800.png)，1280×800，实际设置界面中的默认快捷键 |
| 日语列表 | [picker-1280x800.png](images/picker-1280x800.png)，1280×800，实际按键打开的最近使用列表和测试标签页 |

日语图片来自公开版 `0.1.0` 的 Chrome 测试；英语图片来自实际 Chrome 中使用相同界面代码和仅英语字典的截图副本，已检查英语文字和布局。原始双语言包自动选择英语的行为尚未验证。四张图片均为不透明 1280×800 PNG，并已目视检查。列表使用截图示例数据。其他文档语言没有对应截图，界面也尚未翻译为这些语言。

## 审核人员测试说明

无需账户或登录。在同一窗口打开并依次访问多个普通 HTTP(S) 标签页，使用上述默认快捷键检查短按切换；长按整个组合至少 1 秒，再用上下、Enter、Esc 检查选择和取消。按左方向键切换列表，在标签页顺序模式输入标题查询。通过工具栏图标打开设置，确认版本 `0.1.0`。

## 草案依据

文案依据当前实现和公开候选版 Chrome 测试，包括固定 MRU 遍历、短按／长按、分组和标题搜索、设置、iframe 及受限标签页。操作系统原生输入法、其他系统、旧版 Chrome 和实际英语／回退选择尚未验证，见[发布记录](../releases.zh-CN.md)。

商店字段及图片要求于 2026 年 11 月 9 日对照官方资料检查；提交前须再次确认 Dashboard 必填字段：[Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)、[Supplying Images](https://developer.chrome.com/docs/webstore/images)。
