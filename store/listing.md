---
lang: en
---

# Chrome Web Store listing draft

English | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | [Deutsch](listing.de.md)

This draft describes public release candidate `0.1.0`. Confirmed values and open items are tracked in the [release record](../releases.md).

## Basic information

| Field | Draft / current status |
| --- | --- |
| Listing name | tabuchan |
| Version | 0.1.0, initial public release candidate |
| Documentation / listing languages | English, Japanese, Simplified Chinese, Traditional Chinese, Brazilian Portuguese, Spanish, and German. English is the base language. Saved Dashboard languages remain unverified |
| Extension UI languages | Japanese when Chrome's display language is Japanese; English otherwise. Documentation languages do not expand UI support |
| Proposed category | Functionality & UI, based on the current official category covering tab/shortcut management. The saved Dashboard value remains unverified |
| Summary | Switch to recent tabs with a tap. Hold to browse, search, and select tabs in the current window. |
| Homepage / support | [Usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/). The publisher must decide the support channel |
| Visibility / target countries | To be decided by the publisher |
| Privacy policy URL | [Public URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html). Draft pending publisher details and effective date; finalize before submission |

## Detailed description

tabuchan lets you switch between tabs in the current window using keyboard shortcuts.

Tap Back or Forward to move through a fixed recent-use order. By default, short presses skip tabs where the shortcuts are unavailable.

Hold the entire shortcut combination to open a tab list. Use Up and Down to select, Enter to switch, and Esc to cancel. The list stays open after you release the shortcut.

Press Left to switch between recent-use order and tab order. The tab-order list preserves tab groups and lets you filter tab titles with Unicode text, independently of the UI language. Search uses case-insensitive substring matching with Unicode NFC normalization.

The settings page supports multiple shortcuts per action, a hold duration of 0.5–2 seconds, and a history limit of 10–30 past tabs. The defaults are 1 second and 10 tabs.

On macOS, the default shortcuts are Control + Shift + J for Back and Control + Shift + K for Forward. Other platforms use Alt + Shift + J and Alt + Shift + K. You can record your own combinations in settings.

Shortcuts start inside regular HTTP(S) pages, including iframes. They do not start on Chrome internal pages, the Chrome Web Store, other extensions' pages, file pages, or the address bar. Restricted tabs can still be selected from a list opened on a regular page.

History and settings are processed and stored locally. Displaying tab favicons may cause image requests to the favicon provider. See the privacy policy for data-handling details.

## Screenshots

| Asset | Implementation / preparation status |
| --- | --- |
| Store icon | [icons/tab-128.png](../icons/tab-128.png), the existing tab artwork converted to a 128×128 PNG |
| English settings | [options-en-1280x800.png](images/options-en-1280x800.png), 1280×800, English settings UI |
| English tab list | [picker-en-1280x800.png](images/picker-en-1280x800.png), 1280×800, tab-order list and Work group opened with actual key input |
| Japanese settings | [options-1280x800.png](images/options-1280x800.png), 1280×800, actual settings UI with default shortcuts |
| Japanese tab list | [picker-1280x800.png](images/picker-1280x800.png), 1280×800, recent-use list opened with actual key input and test tabs |

The two Japanese images were captured during Chrome testing of public version `0.1.0`. The English images were captured in actual Chrome using a screenshot copy containing the same UI code and only the English dictionary. English translation and layout were checked. Automatic English selection in the original two-language package remains unverified. All four images are opaque 1280×800 PNGs and were visually checked. The list uses sample tabs prepared for screenshots. Images for other documentation languages have not been created, and the UI has not been translated into those languages.

## Reviewer testing instructions

No account or login is required. Open several regular HTTP(S) tabs in one window and visit them in order. Use the default Back/Forward shortcuts listed above to check tap navigation. Hold the entire shortcut for at least 1 second to open the list, then use Up/Down, Enter, and Esc to select or cancel. Press Left to switch list modes and type a title query in tab-order mode. Use the toolbar icon to open settings and confirm version `0.1.0`.

## Basis of this draft

The draft follows the current implementation and public-candidate Chrome tests: fixed MRU traversal, taps/holds, tab groups/title search, settings, iframe input, and restricted-tab behavior. OS-native IMEs, other operating systems, older Chrome versions, and actual English/fallback selection remain unverified. See the [release record](../releases.md).

Listing fields and image requirements were checked against official documentation on November 9, 2026. Recheck the Dashboard's current required fields before submission: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
