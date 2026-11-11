---
lang: zh-TW
---

# 發佈紀錄

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | 繁體中文 | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | [Deutsch](releases.de.md)

## GitHub Pages

2026 年 11 月 11 日，既有 README 與公開文件透過 GitHub Pages 發佈，來源為 `main` 分支根目錄。README 作為首頁，標準 Jekyll 處理將相對 Markdown 連結轉為 HTML 網址，文件仍以 Markdown 編輯。擴充功能的 `src/`、`options.html`、`manifest.json` 不列入網站產生範圍。

首次發佈時，[使用說明](https://mstksb.github.io/chrome-ext-tabuchan/)及[隱私權政策草案](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)的標準建置和部署成功，已確認可透過 HTTPS 無須登入存取，並在瀏覽器中檢查正文。發佈者名稱、聯絡方式與生效日期未定，政策尚非商店提交定稿。此歷史驗證不代表本次新增翻譯已部署。

## 0.1.0

公開候選版本包含短按切換最近分頁、長按開啟清單、最近使用／分頁順序切換、群組顯示、標題搜尋及快捷鍵／行為設定。

設定與清單支援日文和英文，Chrome 顯示語言非日文時使用英文。搜尋獨立於介面語言，採用 Unicode NFC 正規化後不區分大小寫的子字串比對。文件翻譯不會擴增介面支援語言。

| 項目 | 內容 |
| --- | --- |
| 版本 | SemVer 與資訊清單皆為 `0.1.0` |
| 發佈 ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip)，含 20 個執行檔案，資訊清單位於根目錄 |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| 總和檢查碼 | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| 系統需求 | 支援 Manifest V3 的 Google Chrome；資訊清單指定最低 Chrome 102 |
| 商店狀態 | 此國際化 ZIP 的上傳／接收結果、審查／發佈狀態及商店項目 ID／網址均未驗證 |

## 已驗證範圍

2026 年 11 月 10 日，於 macOS、Chrome `156.0.8078.80` 驗證日文介面與主要操作，包括短按／長按、選取／取消、分頁順序／群組、設定儲存、iframe 輸入、受限分頁、搜尋及輸入法組字期間的事件轉送。於獨立目錄解壓縮 ZIP 後，也驗證了日文介面與 NFC 搜尋。

2026 年 11 月 11 日，於 macOS、Chrome `157.0.8103.40`、介面語言 `ja`，以本存放庫執行檔案驗證 17 組主要操作，包含設定頁面版本 `0.1.0`。重新載入後恢復運作尚未驗證。

設定／自動檢查涵蓋日英翻譯鍵、資訊清單參照、NFC 預組合／組合字元，以及多語言／表情符號的子字串比對。英文介面版面使用相同程式碼和英文辭典的擷圖專用設定驗證。

[商店資訊](store/listing.zh-TW.md#擷圖)提供日英設定／清單擷圖，皆為不透明 1280×800 PNG，清單使用擷圖用範例分頁。

## 尚未驗證或決定

- Windows、Linux、舊版 Chrome 及作業系統各語言輸入法。
- 原始雙語套件於實際英文環境的顯示，以及不支援語言回退為英文的顯示。
- 一般 Chrome 中重新載入擴充功能後恢復運作。
- 發佈者／聯絡資訊、授權條款、發佈範圍和目標國家。
- 政策的發佈者、聯絡方式、生效日期，以及包含 HTTP 網站圖示請求的資料處理合規性。
- Dashboard 商店資訊／隱私權申報儲存結果，以及審查／發佈狀態。

須在提交商店前完成。現有申報與政策草案為準備資料，不能證明已滿足提交條件。
