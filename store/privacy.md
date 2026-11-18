---
lang: en
---

# Privacy disclosure draft

English | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

This draft covers tabuchan `0.2.0` and reflects the extension’s code. See the [release record](../releases.md) for open items and verification and submission status.

## Single purpose

Provide keyboard navigation to recently used tabs and tabs found by title in the current window.

## Permission justifications

| Permission | Draft explanation for the Dashboard |
| --- | --- |
| `tabs` | Enumerate tabs in each window and obtain IDs, titles, URLs, and favicon URLs to build per-window history and lists, determine shortcut availability, and activate the tab selected by the user. |
| `tabGroups` | Display group names and colors in the tab-order list and preserve the group hierarchy when presenting tabs. |
| `storage` | Save shortcut/behavior settings locally and retain tab history and traversal state during the browser session. |
| `scripting` | Inject input detection and tab-list display into open HTTP(S) pages, including preparing page-side behavior after installation or an update. |
| `http://*/*` and `https://*/*` | Detect shortcut key-down and key-up events in HTTP(S) pages and their iframes, and display the list in an extension frame embedded in the top-level page. This allows shortcuts to start on regular web pages. |

## Data collection, use, and storage

| Data | Purpose | Storage / retention |
| --- | --- | --- |
| Tab/window IDs, recent-use order, traversal state | Recent-use navigation and history consistency | `storage.session.mruState`, retained during the browser session |
| Tab titles, URLs, favicon URLs, group IDs/names/colors | List display, title search, shortcut-availability detection | Obtained from Chrome APIs and used in memory/list display state |
| Key-down/key-up events and combinations recorded in settings | Shortcut detection, hold/list operations, shortcut configuration | Key state in memory; confirmed combinations in `storage.local.mruShortcuts` |
| Hold duration, history limit, skip-unavailable-on-tap setting, and search matching mode | Apply the user's selected behavior | `storage.local.mruSettings` |
| Title-search text entered in the list | Filter displayed tabs | In memory while the list is open; discarded on mode changes or closure |

The extension renders titles and group names as text inside its own frame. The search field handles title queries within that frame. The extension keeps list contents and search text within the extension. Input events support shortcuts, list operations, and shortcut recording.

## External requests and third-party processing

For the tab list and notifications for legacy Chrome shortcut commands, the browser may request favicons from servers at HTTPS URLs supplied by Chrome. When Chrome supplies an HTTP favicon URL, the extension displays a fallback icon without requesting that URL. HTTPS favicon requests use `referrerPolicy="no-referrer"`.

Image providers may receive the IP address and ordinary browser request information. Cookie and cache behavior depends on Chrome settings and policies and the destination. Providers retain access logs according to their own rules. Verify the data-use disclosures before submission.

Executable code references JavaScript packaged with the extension. Favicons are display images. The existing runtime-code audit did not detect fetching/executing external JavaScript or WASM, or dynamic evaluation.

## Dashboard data-use fields

| Field | Draft / decision basis |
| --- | --- |
| Web history | Disclose tab URLs and recent-use order handled locally for the feature |
| Website content | Disclose titles, favicons, and user-entered search text used for display/filtering |
| User activity | Tab selection, key-down/key-up events, and list operations support the feature; finalize the scope against the current Dashboard definition |
| Other data types | Publisher to compare the current Dashboard definitions with the implementation |
| Remote code | Draft answer: “No, I am not using remote code,” based on the packaged-code audit |
| Limited Use certification | Publisher to verify and certify the purposes/data use in this draft and the implementation |
| Policy URL | Confirm that GitHub Pages serves the updated [privacy policy](../privacy-policy.md) over HTTPS without a login before entering its URL in the Dashboard. |

Disclose handling even when data remains local. Finalize categories and certifications using the Dashboard's current definitions: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Retention and deletion

Session history is cleared on browser restart or extension disable/reload/update. Closed tabs and history entries beyond a reduced limit are removed. Settings remain local until changed; uninstalling the extension removes its Chrome extension storage. Search text is discarded on list closure or mode changes. Browser-managed image caches can be managed through Chrome's browsing-data controls. See the [privacy policy](../privacy-policy.md).

## Items requiring publisher confirmation

Publisher: `mstksb`. Contact: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com). This policy takes effect on the date tabuchan version `0.2.0` is published in the Chrome Web Store.

The existing [policy URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) was verified over HTTPS without a login. The updated policy is ready in this repository and is pending deployment to GitHub Pages. Trader / Non-Trader status, account verification, and distribution destinations remain pending. See the [release record](../releases.md) for current status.
