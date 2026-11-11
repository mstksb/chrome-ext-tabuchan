---
lang: en
---

# Release record

English | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

On November 11, 2026, the existing README and public documents were published on GitHub Pages from the root of the `main` branch. The README is the home page; GitHub Pages' standard Jekyll processing converts relative Markdown links to HTML URLs. Pages continue to be edited as Markdown. Extension files in `src/`, `options.html`, and `manifest.json` are excluded from the generated site.

The public URLs are [usage instructions](https://mstksb.github.io/chrome-ext-tabuchan/) and the [draft privacy policy](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html). The standard build and initial deployment succeeded. Both pages were accessible over HTTPS without authentication, and their content was checked in a browser. The policy's publisher name, contact details, and effective date remain undecided; it is not a finalized store-submission policy.

This historical deployment record does not confirm deployment of the translations added in the current documentation update.

## 0.1.0

This public release candidate includes tap-to-switch recent tabs, a hold-to-open tab list, switching between recent-use order and tab order, tab group display, title search, and shortcut/behavior settings.

Settings and the tab list support Japanese and English. Chrome display languages other than Japanese select English. Search is independent of the UI language and uses case-insensitive substring matching after Unicode NFC normalization. Documentation translations do not expand extension UI support.

| Item | Details |
| --- | --- |
| Version | `0.1.0` for both SemVer and the manifest |
| Distribution ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), containing 20 runtime files with the manifest at its root |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| Checksum file | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Requirements | Google Chrome with Manifest V3 support; the manifest declares a minimum of Chrome 102 |
| Store status | Upload/acceptance of this internationalized ZIP, review/publication status, and the store item ID/URL remain unverified |

## Verified scope

On November 10, 2026, Japanese UI and major operations were checked on macOS with Chrome `156.0.8078.80`: taps, holds, selection/cancellation, tab order/groups, settings persistence, iframe input, restricted tabs, search, and forwarding operations during IME composition. Japanese UI and NFC search were also checked using the ZIP extracted into a separate location.

On November 11, 2026, 17 groups of major operations were checked using this repository's runtime files on macOS with Chrome `157.0.8103.40` (UI language `ja`), including version `0.1.0` in settings. Operation after extension reload remains unverified.

Configuration/automated checks cover Japanese/English translation keys and manifest references, precomposed/combining NFC characters, and multilingual/emoji substring matching. The English UI layout was checked using a screenshot setup with the same UI code and the English dictionary.

The [listing draft](store/listing.md#screenshots) links to Japanese and English settings/list screenshots. They are opaque 1280×800 PNGs; the list uses sample tabs prepared for screenshots.

## Unverified or undecided

- Windows, Linux, older Chrome versions, and the operating system's IMEs for individual languages.
- The actual two-language package in an English environment and English fallback in unsupported-language environments.
- Operation after extension reload in regular Chrome.
- Publisher/contact details, license, distribution visibility, and target countries.
- Final policy publisher/contact/effective date and data-handling compliance, including HTTP favicon requests.
- Saved listing/privacy disclosures in the Dashboard and review/publication status.

Finalize these items before store submission. Current disclosure drafts and the draft policy are working materials, not evidence that submission requirements have been completed.
