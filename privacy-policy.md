---
lang: en
---

# tabuchan privacy policy

English | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | [Português (Brasil)](privacy-policy.pt-BR.md) | [Español](privacy-policy.es.md) | [Deutsch](privacy-policy.de.md)

This policy takes effect on the date tabuchan version `0.2.0` is published in the Chrome Web Store. See the [release record](releases.md) for the current status.

## Purpose

tabuchan provides keyboard navigation to recently used tabs and tabs found by title in the current window.

## Information handled

- Tab IDs, window IDs, tab titles, URLs, favicon URLs, and group IDs, names, and colors obtained from Chrome.
- Tab selection order, the fixed traversal order, and selection state in the list.
- Shortcut key-down/key-up events detected within pages, list operations, and title-search text.
- Shortcut combinations, hold duration, history limit, skip-unavailable-on-tap setting, and search matching mode chosen by the user.

This information is used to switch tabs, build history and lists, search titles, indicate shortcut availability, and apply the user's settings.

## Local processing and storage

History and traversal state are kept in Chrome's local extension session storage, `storage.session`. Stored history primarily consists of tab IDs, order, and selection state. Shortcut combinations and behavior settings are saved in `storage.local`.

Titles, URLs, and group information are obtained from Chrome during processing. The list appears inside an extension frame embedded in the current page. The extension renders titles and group names as text and keeps list contents and search text within the extension. Search text and key-press state are used in memory during processing.

## Network requests for favicons

The tab list and notifications for legacy Chrome shortcut commands may display favicons. The browser may request these images from HTTPS URLs supplied by Chrome. When Chrome supplies an HTTP favicon URL, the extension displays a fallback icon without requesting that URL.

Image providers may receive the user's IP address and ordinary request information. The extension specifies `no-referrer` for favicon requests. Cookie and cache behavior depends on Chrome settings and policies and the destination. Each image provider's rules govern access-log retention and other processing.

## Retention and deletion

Session history is cleared when the browser restarts or the extension is disabled, reloaded, or updated. New history is then built from the current tab. Closing a tab removes it from history. Reducing the history limit removes the oldest entries beyond that limit.

Shortcuts and behavior settings remain on the device until changed by the user. They can be changed and saved in settings. When the extension is removed, Chrome deletes its extension storage. Browser-managed image caches can be managed through Chrome's browsing-data controls.

Search text is used while the list is open and discarded when the list closes or its mode changes.

## Scope of data use

Information is used for the tab switching, list display, search, and settings functions described in this policy. Requests to external image providers are associated with favicon display. Chrome Web Store data-use disclosures must reflect this handling.

## Publisher and contact

Publisher: `mstksb`. Contact: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com).

The public policy URL is [here](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html). Policy changes must be reflected in the listing with the applicable version and updated data handling.
