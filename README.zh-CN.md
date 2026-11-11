---
lang: zh-CN
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | 简体中文 | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

通过键盘切换到最近使用的标签页的 Chrome 扩展。短按快捷键可浏览历史顺序，长按可打开标签页列表。

公开候选版本为 `0.1.0`。分发文件、已验证环境以及审核和发布状态见[发布记录](releases.zh-CN.md)。

文档提供英语、日语、简体中文、繁体中文、巴西葡萄牙语、西班牙语和德语版本。文档语言与扩展界面语言不同：目前 Chrome 显示语言为日语时，设置页面和标签页列表使用日语，其他情况下使用英语。标题搜索独立于界面语言，支持 Unicode 文本，采用 NFC 规范化后不区分大小写的子串匹配。

## 主要功能

- 在当前窗口中，按固定的最近使用顺序向前或向后切换标签页。
- 长按打开列表，用上下方向键选择，按 Enter 切换。
- 按左方向键切换最近使用顺序和实际标签页顺序，并在标签页顺序列表中搜索标题。
- 显示标签页分组名称、颜色，以及目标标签页是否支持快捷键。
- 为每个方向设置多个快捷键，并调整长按时间和历史记录数量。

## 运行要求

需要支持 Manifest V3 的 Google Chrome。清单声明的最低版本为 Chrome 102。[发布记录](releases.zh-CN.md)列出了实际验证过的环境和版本。Windows、Linux、旧版 Chrome 和操作系统自带的日语输入法尚未验证。

快捷键须在普通 HTTP(S) 网页内触发，也支持 iframe。无法从 Chrome 内部页面、Chrome 应用商店、其他扩展的页面、本地文件页面或地址栏触发快捷键。

## 加载和设置

1. 下载并解压本仓库。
2. 在 Chrome 中打开 `chrome://extensions`，启用开发者模式。
3. 选择“加载已解压的扩展程序”，再选择包含本 README 和 `manifest.json` 的文件夹。
4. 点击工具栏中的 tabuchan 图标，打开设置并确认快捷键及行为选项。

| 操作 | macOS 默认快捷键 | 其他操作系统默认快捷键 |
| --- | --- | --- |
| 后退 | Control + Shift + J | Alt + Shift + J |
| 前进 | Control + Shift + K | Alt + Shift + K |

macOS 使用实体 Control 键。在设置中实际按下所需组合即可注册。Chrome、操作系统或其他扩展可能优先拦截按键，导致网页无法接收。

短按在松开所需按键时生效。默认长按时间为 1 秒。松开所有按键后列表仍保持显示：上下方向键选择，Enter 确认，Esc 取消。左方向键切换最近使用顺序与标签页顺序。在标签页顺序列表中输入文字可筛选标题，Backspace 删除最后一个字符。日语输入法组合输入期间，Enter、上下方向键和 Esc 保留给输入法操作。

长按时间可设为 0.5–2 秒，步长为 0.1 秒。历史记录保留 10–30 个过去的标签页，默认 10 个。短按时默认跳过无法使用快捷键的标签页；仍可从列表中明确选择这些标签页。

## 数据存储

历史记录按窗口保存在设备本地的会话存储中。重启浏览器或停用、重新加载、更新扩展时会清空历史记录，之后从当前标签页重新积累。快捷键和行为设置保存在本地。数据处理及网站图标请求见[隐私政策草案](privacy-policy.zh-CN.md)。

## 重新打包分发 ZIP

在本 README 所在文件夹打开终端，可用 macOS 标准的 `zip` 和 `shasum` 工具将 20 个运行文件重新打包。以下命令会替换现有 ZIP 和校验和文件。

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.1.0.zip" \
  manifest.json \
  options.html \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  icons/tab.svg \
  icons/tab-16.png \
  icons/tab-48.png \
  icons/tab-128.png \
  src/background.js \
  src/controller.js \
  src/history.js \
  src/input-bridge.js \
  src/options.css \
  src/options.js \
  src/overlay.js \
  src/page-input.js \
  src/press-state.js \
  src/settings.js \
  src/shortcuts.js \
  src/tab-access.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.1.0.zip" dist/tabuchan-0.1.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.1.0.zip > tabuchan-0.1.0.zip.sha256)
```

ZIP 根目录包含 `manifest.json`，不包含商店资料、截图或发布记录。重新打包可能改变 SHA-256。分发前请将实际 ZIP 的校验和与[发布记录](releases.zh-CN.md)对应。

## 网站

使用说明和公开资料托管在 GitHub Pages。已验证的部署状态见[发布记录](releases.zh-CN.md#github-pages)。

- [使用说明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-CN.html)
- [隐私政策草案](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-CN.html)

发布者名称、联系方式和生效日期尚未确定，须在提交商店审核前完善政策。

## 公开资料

| 文件 | 内容 |
| --- | --- |
| [README](README.zh-CN.md) | 安装、使用、设置、运行要求和 ZIP 重新打包 |
| [商店资料](store/listing.zh-CN.md) | 商店展示文案和截图 |
| [隐私披露](store/privacy.zh-CN.md) | 权限用途和隐私申报草案 |
| [隐私政策](privacy-policy.zh-CN.md) | 面向用户的数据处理政策草案 |
| [发布记录](releases.zh-CN.md) | 版本、分发文件、验证环境以及审核和发布状态 |
