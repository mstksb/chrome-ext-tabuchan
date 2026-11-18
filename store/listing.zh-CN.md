---
lang: zh-CN
---

# Chrome 应用商店资料草案

[English](listing.md) | [日本語](listing.ja.md) | 简体中文 | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | [Deutsch](listing.de.md)

此软件包的版本为 `0.1.0`。提交版本号将在核对 Dashboard 的上传记录后确定。分发文件、已验证环境以及审核和发布状态见[发布记录](../releases.zh-CN.md)。

## 基本信息

| 字段 | 草案／当前状态 |
| --- | --- |
| 名称 | tabuchan |
| 版本 | `0.1.0` |
| 文档／商店文案语言 | 英语、日语、简体中文、繁体中文、巴西葡萄牙语、西班牙语、德语；以英语为基础。Dashboard 保存值尚未验证 |
| 扩展界面语言 | Chrome 显示语言为日语时用日语，否则用英语；文档语言不代表界面支持 |
| 建议类别 | Functionality & UI，依据包含标签页和快捷键管理的现行官方分类；Dashboard 保存值尚未验证 |
| 简介 | 短按切换最近标签页，长按浏览、搜索并选择当前窗口中的标签页。|
| 主页／支持 | [使用说明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-CN.html)；支持渠道由发布者确定 |
| 分发范围／国家 | 由发布者确定 |
| 隐私政策网址 | [公开网址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-CN.html)，发布者信息和生效日期待定，提交前须定稿 |

## 详细说明

tabuchan 通过快捷键切换当前窗口中的标签页。

短按后退或前进快捷键，按固定的最近使用顺序移动。默认跳过无法使用快捷键的标签页。

长按整个快捷键组合可打开列表。上下方向键选择，Enter 切换，Esc 取消。松开快捷键后列表仍显示。

按左方向键在最近使用顺序和实际标签页顺序之间切换。按标签页顺序显示的列表会保留分组，可独立于界面语言搜索标题。用空格分隔搜索词。部分匹配（默认）要求标题包含所有搜索词，顺序不限。前缀匹配要求第一个词出现在标题开头，其余词按输入顺序出现，词间可以有其他字符。两种方式都采用 Unicode NFC 规范化，且不区分大小写。

每个操作可设置多个快捷键。长按时间可设为 0.2–2.0 秒，步长为 0.1 秒，默认为 0.5 秒。历史记录保留 10–30 个过去的标签页，默认为 10 个。无法使用快捷键的标签页在列表中显示为灰色，行高不变，仍可按 Enter 选择。

macOS 默认后退键为 Control + Shift + J，前进键为 Control + Shift + K；其他平台使用 Alt + Shift + J／K。可在设置中实际按下组合来修改。

快捷键从普通 HTTP(S) 网页及 iframe 内触发，无法从 Chrome 内部页面、Chrome 应用商店、其他扩展页面、本地文件或地址栏触发。仍可从普通网页打开列表并选择受限标签页。

历史记录和设置在本地处理并保存。显示网站图标可能向图片提供者发送请求，详情见隐私政策。

## 截图

| 素材 | 内容／准备状态 |
| --- | --- |
| 商店图标 | [tab-128.png](../icons/tab-128.png)，由现有标签页图案转换成 128×128 PNG |
| 英语设置 | [options-en-1280x800.png](images/options-en-1280x800.png)，1280×800，默认长按时间 0.5 秒和搜索匹配设置 |
| 英语列表 | [picker-en-1280x800.png](images/picker-en-1280x800.png), 1280×800, 带分组的英语标签页顺序列表 |
| 日语设置 | [options-1280x800.png](images/options-1280x800.png)，1280×800，默认长按时间 0.5 秒和搜索匹配设置 |
| 日语列表 | [picker-1280x800.png](images/picker-1280x800.png), 1280×800, 带分组的日语标签页顺序列表 |

四张截图均为 1280×800，使用同一个双语软件包在 Linux arm64 的 Chrome for Testing Stable `158.0.8127.36` 上拍摄。Chrome 分别使用日语和英语界面，列表使用示例标签页。

## 审核人员测试说明

无需账户或登录。在同一窗口打开并依次访问多个普通 HTTP(S) 标签页，使用上述默认快捷键检查短按切换；长按整个组合至少 0.5 秒，再用上下、Enter、Esc 检查选择和取消。按左方向键切换列表，在标签页顺序模式输入标题查询。通过工具栏图标打开设置，确认版本 `0.1.0`。

## 草案依据

候选版本在 Linux arm64 的 Chrome for Testing Stable `158.0.8127.36` 上通过了 21 组端到端测试。另有 3 组测试验证了日语和英语界面，以及 Chrome 使用法语时回退到英语的行为，并覆盖 Unicode 标题搜索。

商店字段及图片要求于 2026 年 11 月 9 日对照官方资料检查；提交前须再次确认 Dashboard 必填字段：[Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)、[Supplying Images](https://developer.chrome.com/docs/webstore/images)。
