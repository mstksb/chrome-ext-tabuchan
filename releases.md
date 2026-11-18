---
lang: en
---

# Release record

English | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

On November 11, 2026, the existing README and public documents were published on GitHub Pages from the root of the `main` branch. The README is the home page; GitHub Pages' standard Jekyll processing converts relative Markdown links to HTML URLs. Pages continue to be edited as Markdown. Extension files in `src/`, `options.html`, and `manifest.json` are excluded from the generated site.

The public URLs are [usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/) and the [draft privacy policy](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html). The standard build and initial deployment succeeded. Both pages were accessible over HTTPS without authentication, and their content was checked in a browser. The policy's publisher name, contact details, and effective date remain undecided; it is not a finalized store-submission policy.

The dates above describe earlier deployments. Deployment of the November 18, 2026 update remains unverified.

## 0.1.0

This candidate updates restricted-page detection and the appearance of affected tabs, reduces the minimum and default hold durations, and adds a choice of partial or prefix matching for multiple search terms. It also includes fixes to tab switching and settings.

Settings and the tab list use Japanese when Chrome uses Japanese, and English otherwise. Separate search terms with spaces. Partial match (the default) finds titles containing every term in any order. Prefix match starts with the first term and finds the others in order, with gaps allowed. Both modes ignore letter case and use Unicode NFC normalization.

| Item | Details |
| --- | --- |
| Version | This package uses version `0.1.0`. The submission version depends on the Dashboard’s upload history. |
| Distribution ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), containing 29 runtime files with the manifest at its root |
| SHA-256 | `25a07b0f94b01a9bc9d9ea5ce05d9e258b584a7560ace136fa10716a1e6d9982` |
| Checksum file | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Requirements | Google Chrome with Manifest V3 support; the manifest declares a minimum of Chrome 102 |
| Store status | The Dashboard’s package, item ID/URL, and review and publication status still need verification. |

## Verification of the November 18, 2026 candidate

The candidate passed 21 groups of end-to-end tests on Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Three additional groups verified Japanese, English, and the English fallback with a French Chrome UI, including Unicode title search. All 24 groups also passed with the extension loaded from the extracted distribution ZIP. The settings page displayed the version declared by that ZIP’s manifest.

The [listing draft](store/listing.md#screenshots) links to Japanese and English settings/list screenshots. They are opaque 1280×800 PNGs; the list uses sample tabs prepared for screenshots.

## Verification of the earlier candidate

On November 10, 2026, Japanese UI and major operations were checked on macOS with Chrome `156.0.8078.80`: taps, holds, selection/cancellation, tab order/groups, settings persistence, iframe input, restricted tabs, search, and forwarding operations during IME composition. Japanese UI and NFC search were also checked using the ZIP extracted into a separate location.

On November 11, 2026, 17 groups of major operations were checked using this repository's runtime files on macOS with Chrome `157.0.8103.40` (UI language `ja`), including version `0.1.0` in settings. Operation after extension reload remains unverified.

Configuration/automated checks cover Japanese/English translation keys and manifest references, precomposed/combining NFC characters, and multilingual/emoji substring matching. The English UI layout was checked using a screenshot setup with the same UI code and the English dictionary.

## Unverified or undecided

- Windows, older Chrome versions, and native operating system IMEs.
- Operation after extension reload in regular Chrome.
- Publisher/contact details, license, distribution visibility, and target countries.
- Final policy publisher/contact/effective date and data-handling compliance, including HTTP favicon requests.
- Saved listing/privacy disclosures in the Dashboard and review/publication status.

Finalize these items before store submission. Current disclosure drafts and the draft policy are working materials, not evidence that submission requirements have been completed.
