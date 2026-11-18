---
lang: en
permalink: /
---

# tabuchan

English | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

A Chrome extension for switching to recently used tabs with the keyboard. Tap a shortcut to move through your history; hold it to open a tab list.

This package uses version `0.2.1`. See the [release record](releases.md) for tested environments and store status.

Documentation languages: English, Japanese, Simplified Chinese, Traditional Chinese, Brazilian Portuguese, Spanish, and German. Documentation translations are separate from extension UI support: settings and the tab list currently use Japanese when Chrome's display language is Japanese, and English otherwise.

## Features

- Move backward and forward through a fixed recent-use order in the current window.
- Hold a shortcut to open the list; select with Up/Down and switch with Enter.
- Press Left to switch between recent-use order and actual tab order, and search titles in the tab-order list.
- See tab group names and whether shortcuts are available in the destination tab.
- Assign multiple shortcuts per direction and configure the hold duration and history limit.

## Requirements

Google Chrome with Manifest V3 support. The manifest declares Chrome 102 as the minimum version. The [release record](releases.md) distinguishes the environments and versions actually tested. Windows, older Chrome versions, and operating system IMEs remain unverified. Linux verification used headless Chrome for Testing on arm64.

Start shortcuts inside a regular HTTP(S) page, including an iframe. Shortcuts cannot start from Chrome internal pages, the Chrome Web Store, other extensions' pages, file pages, or the address bar. Chrome Web Store restrictions cover both `chromewebstore.google.com` and `chrome.google.com`, including their subdomains.

## Load and configure

1. Download and extract this repository.
2. Open `chrome://extensions` in Chrome and enable Developer mode.
3. Choose **Load unpacked** and select the folder containing this README and `manifest.json`.
4. Open settings from the tabuchan toolbar icon and review the shortcuts and behavior settings.

| Action | Default on macOS | Default on other operating systems |
| --- | --- | --- |
| Back | Control + Shift + J | Alt + Shift + J |
| Forward | Control + Shift + K | Alt + Shift + K |

On macOS, use the physical Control key. In settings, press the actual combination to register it for a direction. Chrome, the operating system, or other extensions may intercept combinations before they reach the page.

Keep the required modifier keys held and press and release the regular key for Back or Forward to switch one tab at a time in fixed history order. Release any required modifier to make the displayed tab the most recent.

The default hold duration is 0.5 seconds. The list stays open after you release all keys: Up/Down selects, Enter confirms, and Esc cancels. Left switches between recent-use order and tab order. In tab order, type to filter titles and use Backspace to delete the last character. During Japanese IME composition, Enter, Up/Down, and Esc are reserved for the IME.

Press Enter in either list, including in search results, or select a tab directly in Chrome to make it the most recent. If it was already in the history, its old entry is removed and the other tabs stay in the same order.

Separate search terms with spaces. Partial match (the default) finds titles containing every term in any order. Prefix match starts with the first term and finds the others in order, with gaps allowed. Both modes ignore letter case and use Unicode NFC normalization.

The hold duration ranges from 0.2 to 2.0 seconds in 0.1-second steps and defaults to 0.5 seconds. The history limit is 10–30 past tabs, with a default of 10. A tap skips tabs with unavailable shortcuts by default. The list dims those tabs without changing row height, and you can select them with Enter. If you turn off skipping and switch to a tab where the extension cannot receive key input, that tab becomes the most recent as soon as it opens.

## Data storage

History is kept per window in local session storage. Restarting the browser or disabling, reloading, or updating the extension clears history; tracking then starts again from the current tab. Shortcuts and behavior settings are stored locally. See the [privacy policy](privacy-policy.md) for data-handling details, including favicon requests.

## Repackage the distribution ZIP

You can repackage the 28 runtime files in this folder using macOS's standard `zip` and `shasum` tools. Open a terminal in the folder containing this README and run the following. This replaces the existing distribution ZIP and checksum.

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.2.1.zip" \
  manifest.json \
  options.html \
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
  src/tab-access.js \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  picker.html \
  src/input-protocol.js \
  src/legacy-command.js \
  src/picker-model.js \
  src/picker-view.js \
  src/picker.css \
  src/picker.js \
  src/settings-rules.js \
  src/shortcut-changes.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.2.1.zip" dist/tabuchan-0.2.1.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.2.1.zip > tabuchan-0.2.1.zip.sha256)
```

The ZIP contains `manifest.json` at its root; listing documents, screenshots, and release records are excluded. Repackaging may change its SHA-256. Match the actual ZIP checksum to the [release record](releases.md) before distribution.

## Website

Usage instructions and public documents are hosted on GitHub Pages. See the [publication record](releases.md#github-pages) for the verified deployment status.

- [Usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/)
- [Privacy policy on GitHub Pages](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)

The privacy policy on GitHub Pages was verified in all seven documentation languages over HTTPS without a login.

## Public documents

| File | Contents |
| --- | --- |
| [README.md](README.md) | Installation, usage, settings, requirements, and ZIP repackaging |
| [store/listing.md](store/listing.md) | Store listing drafts and screenshots |
| [store/privacy.md](store/privacy.md) | Permission justifications and privacy disclosure drafts |
| [privacy-policy.md](privacy-policy.md) | Privacy policy describing how the extension handles data |
| [releases.md](releases.md) | Version, distribution files, verified environments, and review/publication status |
