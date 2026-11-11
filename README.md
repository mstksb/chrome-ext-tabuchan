---
lang: en
permalink: /
---

# tabuchan

English | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

A Chrome extension for switching to recently used tabs with the keyboard. Tap a shortcut to move through your history; hold it to open a tab list.

The public release candidate is `0.1.0`. See the [release record](releases.md) for the distribution files, verified environments, and review/publication status.

Documentation languages: English, Japanese, Simplified Chinese, Traditional Chinese, Brazilian Portuguese, Spanish, and German. Documentation translations are separate from extension UI support: settings and the tab list currently use Japanese when Chrome's display language is Japanese, and English otherwise. Title search handles Unicode text independently of the UI language, using NFC normalization and case-insensitive substring matching.

## Features

- Move backward and forward through a fixed recent-use order in the current window.
- Hold a shortcut to open the list; select with Up/Down and switch with Enter.
- Press Left to switch between recent-use order and actual tab order, and search titles in the tab-order list.
- See tab group names/colors and whether shortcuts are available in the destination tab.
- Assign multiple shortcuts per direction and configure the hold duration and history limit.

## Requirements

Google Chrome with Manifest V3 support. The manifest declares Chrome 102 as the minimum version. The [release record](releases.md) distinguishes the environments and versions actually tested. Windows, Linux, older Chrome versions, and the operating system's Japanese IME itself remain unverified.

Start shortcuts inside a regular HTTP(S) page, including an iframe. Shortcuts cannot start from Chrome internal pages, the Chrome Web Store, other extensions' pages, file pages, or the address bar.

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

A tap takes effect when a required key is released. The default hold duration is 1 second. The list stays open after you release all keys: Up/Down selects, Enter confirms, and Esc cancels. Left switches between recent-use order and tab order. In tab order, type to filter titles and use Backspace to delete the last character. During Japanese IME composition, Enter, Up/Down, and Esc are reserved for the IME.

The hold duration can be set from 0.5 to 2 seconds in 0.1-second increments. The history limit is 10–30 past tabs, with a default of 10. Skipping unavailable tabs on a tap is enabled by default; you can still select those tabs explicitly from the list.

## Data storage

History is kept per window in local session storage. Restarting the browser or disabling, reloading, or updating the extension clears history; tracking then starts again from the current tab. Shortcuts and behavior settings are stored locally. See the [draft privacy policy](privacy-policy.md) for data-handling details, including favicon requests.

## Repackage the distribution ZIP

You can repackage the 20 runtime files in this folder using macOS's standard `zip` and `shasum` tools. Open a terminal in the folder containing this README and run the following. This replaces the existing distribution ZIP and checksum.

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

The ZIP contains `manifest.json` at its root; listing documents, screenshots, and release records are excluded. Repackaging may change its SHA-256. Match the actual ZIP checksum to the [release record](releases.md) before distribution.

## Website

Usage instructions and public documents are hosted on GitHub Pages. See the [publication record](releases.md#github-pages) for the verified deployment status.

- [Usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/)
- [Draft privacy policy](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)

The publisher name, contact details, and effective date are still undecided. Finalize the policy before store submission.

## Public documents

| File | Contents |
| --- | --- |
| [README.md](README.md) | Installation, usage, settings, requirements, and ZIP repackaging |
| [store/listing.md](store/listing.md) | Store listing drafts and screenshots |
| [store/privacy.md](store/privacy.md) | Permission justifications and privacy disclosure drafts |
| [privacy-policy.md](privacy-policy.md) | Draft user-facing data-handling policy |
| [releases.md](releases.md) | Version, distribution files, verified environments, and review/publication status |
