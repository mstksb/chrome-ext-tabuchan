---
lang: zh-CN
---

# 隐私申报草案

[English](privacy.md) | [日本語](privacy.ja.md) | 简体中文 | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

本申报草案依据 tabuchan `0.2.1` 的代码编写。待办事项和验证／提交状态见[发布记录](../releases.zh-CN.md)。

## 单一用途

通过键盘切换到当前窗口中最近使用的标签页，或通过标题搜索找到的标签页。

## 权限用途说明

| 权限 | Dashboard 说明草案 |
| --- | --- |
| `tabs` | 枚举各窗口标签页并获取 ID、标题、网址和网站图标网址，建立各窗口历史记录和列表，判断快捷键可用性，并激活用户选择的标签页。 |
| `tabGroups` | 在标签页顺序列表中显示分组名称和颜色，并保留分组层级。 |
| `storage` | 在本地保存快捷键／行为设置，并在浏览器会话中保留历史记录和遍历状态。 |
| `scripting` | 向已打开的 HTTP(S) 网页注入输入检测和列表显示逻辑，包括安装或更新后准备网页端处理。 |
| `http://*/*` 和 `https://*/*` | 检测 HTTP(S) 网页及其 iframe 中快捷键的按下和松开，并在嵌入顶层网页的扩展程序框架内显示列表。这使快捷键可从普通网页触发。 |

## 数据获取、使用和存储

| 数据 | 用途 | 存储／保留 |
| --- | --- | --- |
| 标签页／窗口 ID、最近使用顺序、遍历状态 | 最近使用切换及历史一致性 | `storage.session.mruState`，浏览器会话期间 |
| 标题、网址、网站图标网址、分组 ID／名称／颜色 | 列表、标题搜索、快捷键可用性判断 | 从 Chrome API 获取，在内存／列表状态中使用 |
| 按键按下／松开事件、设置中记录的组合 | 快捷键识别、长按／列表操作、设置 | 按键状态在内存；确定的组合在 `storage.local.mruShortcuts` |
| 长按时间、历史记录上限、短按时跳过无法使用快捷键的标签页、搜索匹配方式 | 实现用户选择的行为 | `storage.local.mruSettings` |
| 列表中的标题搜索文本 | 筛选标签页 | 列表打开时保存在内存，切换模式或关闭时丢弃 |

标题和分组名称以纯文本显示在扩展程序的框架内。搜索文本由同一框架内的输入框处理。列表内容和搜索文本在扩展程序内处理。输入事件用于快捷键、列表操作和录入快捷键。

## 外部请求和第三方处理

在标签页列表及旧版 Chrome 快捷键命令的通知中显示网站图标时，浏览器可能向 Chrome 提供的 HTTPS 图标网址所指向的服务器请求图片。如果 Chrome 提供的图标网址使用 HTTP，扩展会显示替代图标，并且不会请求该网址。HTTPS 图标请求使用 `referrerPolicy="no-referrer"`。

图片提供者可能收到 IP 地址和常规浏览器请求信息。Cookie 和缓存的处理取决于 Chrome 的设置、策略和目标服务器。各提供者按自己的规则保留访问日志。提交前应核对数据使用披露内容。

可执行代码仅引用扩展内置 JavaScript，网站图标作为图片处理。已有运行代码审计未发现外部 JavaScript／WASM 获取执行或动态求值。

## Dashboard 数据使用字段

| 字段 | 草案／判断依据 |
| --- | --- |
| Web history | 披露为功能在本地处理的标签页网址和最近使用顺序 |
| Website content | 披露用于显示／筛选的标题、网站图标和用户输入的搜索文本 |
| User activity | 标签页选择、按键事件和列表操作用于功能；须按当前 Dashboard 定义确定申报范围 |
| 其他数据类型 | 由发布者对照当前定义和实现确定 |
| Remote code | 依据内置代码审计，草案回答为“No, I am not using remote code.” |
| Limited Use 认证 | 由发布者核实并认证草案及实现的数据用途 |
| 政策网址 | 确认无需登录即可通过 HTTPS 访问 GitHub Pages 上更新后的[隐私政策](../privacy-policy.zh-CN.md)，再在 Dashboard 中填写网址。 |

仅在本地处理的数据也须披露，最终分类和认证依据当前 Dashboard 定义：[Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)、[User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)。

## 保留和删除

重启浏览器或停用／重新加载／更新扩展会清空会话历史。关闭的标签页和超出减少后上限的记录会移除。设置保留至用户修改；卸载扩展会删除 Chrome 扩展存储。搜索文本在关闭列表或切换模式时丢弃。图片缓存通过 Chrome 浏览数据功能管理。见[隐私政策](../privacy-policy.zh-CN.md)。

## 发布者须确认的事项

发布者为 `mstksb`。联系邮箱为 [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com)。本政策适用于 tabuchan `0.2.0` 和 `0.2.1`，自这两个版本中第一个在 Chrome 应用商店发布的版本上线之日起生效。

已确认可通过 HTTPS 无需登录访问隐私政策的[现有政策网址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)。Trader／Non-Trader 身份、账户验证和分发目标仍待确定。当前状态见[发布记录](../releases.zh-CN.md)。
