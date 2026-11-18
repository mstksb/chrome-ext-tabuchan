---
lang: en
---

# Release record

English | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

On November 11, 2026, the existing README and public documents were published on GitHub Pages from the root of the `main` branch. The README is the home page; GitHub Pages' standard Jekyll processing converts relative Markdown links to HTML URLs. Pages continue to be edited as Markdown. Extension files in `src/`, `options.html`, and `manifest.json` are excluded from the generated site.

The public URLs are [usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/) and the [privacy policy](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html). The initial GitHub Pages build and deployment succeeded, and both pages were accessible without authentication over HTTPS.

On November 18, 2026, the site build from commit `e190053` deployed to GitHub Pages. The privacy policy pages were verified in all seven documentation languages over HTTPS without a login.

## 0.2.1

This update introduces the Tabuchan mascot icon for the extension, toolbar, and settings page. Behavior and data handling are the same as in `0.2.0`.

| Item | Details |
| --- | --- |
| Version | `0.2.1` |
| Distribution ZIP | [tabuchan-0.2.1.zip](dist/tabuchan-0.2.1.zip), contains 28 runtime files with the manifest at the ZIP root |
| SHA-256 | `8cbafd2a24d4f52fb8521f95df2b5f9ed46869eaa48d56df5d4e68819af143ab` |
| Checksum file | [tabuchan-0.2.1.zip.sha256](dist/tabuchan-0.2.1.zip.sha256) |
| Requirements | Google Chrome with Manifest V3 support; the manifest declares a minimum of Chrome 102 |
| Store status | The Dashboard’s package, item ID/URL, and review and publication status still need verification. |

### Extracted ZIP verification

The source candidate passed 184 Node tests and syntax checks. The extracted distribution ZIP passed 25 end-to-end test groups (22 main and 3 locale) in Chrome for Testing Stable `158.0.8127.36` on Linux arm64 (Docker). Settings showed `0.2.1` and loaded the 48 px PNG. The manifest referenced the 16 px and 128 px PNGs.

Retaking the four 1280×800 Japanese and English settings and tab-list screenshots from this ZIP produced files identical to the existing images.

## 0.2.0

Version 0.2.0 updates how tab switches are recorded in the history. It also improves picker and tab switching internals and fixes focus restoration after closing the picker from an iframe.

Keep the required modifier keys held and press and release the regular key for Back or Forward to switch one tab at a time in fixed history order. Release any required modifier to make the displayed tab the most recent.

Press Enter in either list, including in search results, or select a tab directly in Chrome to make it the most recent. If it was already in the history, its old entry is removed and the other tabs stay in the same order.

| Item | Details |
| --- | --- |
| Version | This package uses version `0.2.0`. The submission version depends on the Dashboard’s upload history. |
| Distribution ZIP | [tabuchan-0.2.0.zip](dist/tabuchan-0.2.0.zip), containing 29 runtime files with the manifest at its root |
| SHA-256 | `01327c7caf9eb6a1d59fd6cd2cc9d7fa1eee3f5313bb9b382ac8c8fa776e2173` |
| Checksum file | [tabuchan-0.2.0.zip.sha256](dist/tabuchan-0.2.0.zip.sha256) |
| Requirements | Google Chrome with Manifest V3 support; the manifest declares a minimum of Chrome 102 |
| Store status | The Dashboard’s package, item ID/URL, and review and publication status still need verification. |

## Verification of 0.2.0

The candidate passed 184 Node tests. Chrome for Testing Stable `158.0.8127.36` (Linux arm64) passed 21 main end-to-end test groups and 3 language groups for Japanese, English, and the English fallback in a French Chrome environment.

The updated ZIP passed 25 browser test groups, including the version display in settings. In the tab list, an HTTP favicon URL used the fallback icon without a request, and an HTTPS favicon rendered. The [listing draft](store/listing.md#screenshots) links to four 1280×800 Japanese and English screenshots verified against the updated ZIP.


## 0.1.0

This candidate updates restricted-page detection and the appearance of affected tabs, reduces the minimum and default hold durations, and adds a choice of partial or prefix matching for multiple search terms. It also includes fixes to tab switching and settings.

Settings and the tab list use Japanese when Chrome uses Japanese, and English otherwise. Separate search terms with spaces. Partial match (the default) finds titles containing every term in any order. Prefix match starts with the first term and finds the others in order, with gaps allowed. Both modes ignore letter case and use Unicode NFC normalization.

| Item | Details |
| --- | --- |
| Version | The earlier package used version `0.1.0`. |
| Distribution ZIP | `tabuchan-0.1.0.zip`, containing 29 runtime files with the manifest at its root |
| SHA-256 | `25a07b0f94b01a9bc9d9ea5ce05d9e258b584a7560ace136fa10716a1e6d9982` |
| Checksum file | `tabuchan-0.1.0.zip.sha256` |
| Requirements | Google Chrome with Manifest V3 support; the manifest declares a minimum of Chrome 102 |
| Store status | The Dashboard’s package, item ID/URL, and review and publication status still need verification. |

## Verification of the 0.1.0 candidate on November 18, 2026

The candidate passed 21 groups of end-to-end tests on Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Three additional groups verified Japanese, English, and the English fallback with a French Chrome UI, including Unicode title search. All 24 groups also passed with the extension loaded from the extracted distribution ZIP. The settings page displayed the version declared by that ZIP’s manifest.

The [listing draft](store/listing.md#screenshots) links to Japanese and English settings/list screenshots. They are opaque 1280×800 PNGs; the list uses sample tabs prepared for screenshots.

## Verification of the earlier candidate

On November 10, 2026, Japanese UI and major operations were checked on macOS with Chrome `156.0.8078.80`: taps, holds, selection/cancellation, tab order/groups, settings persistence, iframe input, restricted tabs, search, and forwarding operations during IME composition. Japanese UI and NFC search were also checked using the ZIP extracted into a separate location.

On November 11, 2026, 17 groups of major operations were checked using this repository's runtime files on macOS with Chrome `157.0.8103.40` (UI language `ja`), including version `0.1.0` in settings. Operation after extension reload remains unverified.

Configuration/automated checks cover Japanese/English translation keys and manifest references, precomposed/combining NFC characters, and multilingual/emoji substring matching. The English UI layout was checked using a screenshot setup with the same UI code and the English dictionary.

## Unverified or undecided

- Windows, older Chrome versions, and native operating system IMEs.
- Operation after extension reload in regular Chrome.
- License, distribution visibility, and target countries.
- Data-handling requirements for Chrome Web Store submission.
- Saved listing/privacy disclosures in the Dashboard and review/publication status.

Finalize these items before store submission.
