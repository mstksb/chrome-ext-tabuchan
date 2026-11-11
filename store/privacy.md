---
lang: en
---

# Privacy disclosure draft

English | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

This draft covers public release candidate `0.1.0` and reflects current code behavior. Publisher verification, legal status, and contact details must be finalized before publication. Open items and verification/submission status are tracked in the [release record](../releases.md).

## Single purpose

Provide keyboard navigation to recently used tabs and tabs found by title in the current window.

## Permission justifications

| Permission | Draft explanation for the Dashboard |
| --- | --- |
| `tabs` | Enumerate tabs in each window and obtain IDs, titles, URLs, and favicon URLs to build per-window history and lists, determine shortcut availability, and activate the tab selected by the user. |
| `tabGroups` | Display group names and colors in the tab-order list and preserve the group hierarchy when presenting tabs. |
| `storage` | Save shortcut/behavior settings locally and retain tab history and traversal state during the browser session. |
| `scripting` | Inject input detection and tab-list display into open HTTP(S) pages, including preparing page-side behavior after installation or an update. |
| `http://*/*` and `https://*/*` | Detect shortcut key-down/key-up events in the user's HTTP(S) pages and iframes, and display the list in the top-level frame. This supports starting shortcuts from arbitrary regular web pages. |

## Data collection, use, and storage

| Data | Purpose | Storage / retention |
| --- | --- | --- |
| Tab/window IDs, recent-use order, traversal state | Recent-use navigation and history consistency | `storage.session.mruState`, retained during the browser session |
| Tab titles, URLs, favicon URLs, group IDs/names/colors | List display, title search, shortcut-availability detection | Obtained from Chrome APIs and used in memory/list display state |
| Key-down/key-up events and combinations recorded in settings | Shortcut detection, hold/list operations, shortcut configuration | Key state in memory; confirmed combinations in `storage.local.mruShortcuts` |
| Hold duration, history limit, skip-unavailable-on-tap setting | Apply the user's selected behavior | `storage.local.mruSettings` |
| Title-search text entered in the list | Filter displayed tabs | In memory while the list is open; discarded on mode changes or closure |

Titles and group names are rendered as text in a list inserted into the current page. Search text is handled in that list's input field. Input-event processing supports shortcuts, list operations, and recording configured combinations.

## External requests and third-party processing

Setting an HTTP(S) favicon URL as a list image may cause the browser to request that image from its server. The destination is the server for the favicon URL provided by Chrome's tab information. The implementation sets `referrerPolicy="no-referrer"`.

Image providers may receive the IP address and ordinary browser request information. Cookie, cache, and mixed-content behavior depends on Chrome settings/policies and the destination. Third-party access-log retention follows each provider's rules. Behavior involving HTTP image URLs and compliance with secure-data-handling requirements must be checked before submission.

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
| Policy URL | Use the [draft policy](../privacy-policy.md) at a public HTTPS URL requiring no login, after adding publisher/contact information |

Disclose handling even when data remains local. Finalize categories and certifications using the Dashboard's current definitions: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Retention and deletion

Session history is cleared on browser restart or extension disable/reload/update. Closed tabs and history entries beyond a reduced limit are removed. Settings remain local until changed; uninstalling the extension removes its Chrome extension storage. Search text is discarded on list closure or mode changes. Browser-managed image caches can be managed through Chrome's browsing-data controls. See the [draft policy](../privacy-policy.md).

## Items requiring publisher confirmation

The [policy URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) is confirmed and was verified accessible without authentication. Publisher display details, contact channel, effective date, Trader / Non-Trader status, account verification, and distribution destinations remain undecided. Keep the policy as a draft until finalized before store submission, and track the status in the [release record](../releases.md).
