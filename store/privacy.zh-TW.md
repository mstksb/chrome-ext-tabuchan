---
lang: zh-TW
---

# 隱私權申報草案

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | 繁體中文 | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

適用公開候選版本 `0.1.0`，依目前程式行為編寫。發佈者驗證、法律身分及聯絡資訊須於發佈前確定。待辦與驗證／提交狀態請參閱[發佈紀錄](../releases.zh-TW.md)。

## 單一用途

透過鍵盤切換至目前視窗最近使用的分頁，或以標題搜尋找到的分頁。

## 權限用途

| 權限 | Dashboard 說明草案 |
| --- | --- |
| `tabs` | 列舉各視窗分頁並取得 ID、標題、網址和網站圖示網址，建立各視窗歷史紀錄／清單、判斷快捷鍵可用性，並啟用使用者選取的分頁。 |
| `tabGroups` | 顯示分頁順序清單的群組名稱與顏色，保留群組階層。 |
| `storage` | 本機儲存快捷鍵／行為設定，於瀏覽器工作階段保留歷史紀錄和巡覽狀態。 |
| `scripting` | 對已開啟 HTTP(S) 網頁注入輸入偵測與清單顯示，包含安裝／更新後準備網頁端處理。 |
| `http://*/*`、`https://*/*` | 在使用者的一般 HTTP(S) 網頁及 iframe 偵測快捷鍵按下／放開事件，在最上層框架顯示清單，以便從任意一般網頁觸發。 |

## 資料取得、使用與儲存

| 資料 | 用途 | 儲存／保留 |
| --- | --- | --- |
| 分頁／視窗 ID、最近使用順序、巡覽狀態 | 最近使用切換及歷史一致性 | `storage.session.mruState`，瀏覽器工作階段期間 |
| 標題、網址、網站圖示網址、群組 ID／名稱／顏色 | 清單、標題搜尋、快捷鍵可用性判斷 | Chrome API 取得，在記憶體／清單狀態使用 |
| 按下／放開事件、設定頁登錄的組合 | 快捷鍵、長按／清單操作、設定 | 按鍵狀態於記憶體；確定的組合在 `storage.local.mruShortcuts` |
| 長按時間、歷史上限、短按略過設定 | 套用使用者行為設定 | `storage.local.mruSettings` |
| 清單中的標題搜尋文字 | 篩選分頁 | 清單開啟時在記憶體，切換模式／關閉時捨棄 |

標題與群組名稱以文字呈現於插入目前網頁的清單中。搜尋文字由清單輸入欄處理。輸入事件用於快捷鍵、清單操作及登錄組合。

## 外部請求與第三方處理

清單圖片使用 HTTP(S) 網站圖示網址時，瀏覽器可能向該伺服器請求圖片。目的地是 Chrome 分頁資訊提供的圖示網址伺服器。實作指定 `referrerPolicy="no-referrer"`。

圖片供應者可能收到 IP 位址和一般瀏覽器請求資訊。Cookie、快取、混合內容取決於 Chrome 設定／政策與目的地。第三方存取紀錄保留遵循其規範。HTTP 圖片行為及安全資料處理合規性須於提交前確認。

執行程式僅參照套件內 JavaScript；網站圖示視為圖片。既有程式稽核未發現外部 JavaScript／WASM 下載執行或動態求值。

## Dashboard 資料使用欄位

| 欄位 | 草案／判斷依據 |
| --- | --- |
| Web history | 揭露為功能而於本機處理的分頁網址與最近使用順序 |
| Website content | 揭露顯示／篩選使用的標題、網站圖示與使用者搜尋文字 |
| User activity | 分頁選取、按鍵事件與清單操作支援功能；依目前 Dashboard 定義確定申報範圍 |
| 其他類型 | 發佈者對照現行定義及實作確定 |
| Remote code | 依套件程式稽核，草案回答為“No, I am not using remote code.” |
| Limited Use 驗證 | 發佈者確認並認證草案及實作的資料用途 |
| 政策網址 | 補充發佈者／聯絡資訊後，將[政策草案](../privacy-policy.zh-TW.md)放至無須登入的 HTTPS 網址 |

僅在本機處理的資料也須揭露，依現行 Dashboard 定義確定分類及認證：[Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)、[User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)。

## 保留與刪除

瀏覽器重啟或停用／重新載入／更新擴充功能會清除工作階段歷史。關閉分頁及超過降低後上限的紀錄會移除。設定保留到使用者變更，解除安裝會刪除 Chrome 擴充功能儲存。搜尋文字於關閉清單或切換模式時捨棄。圖片快取透過 Chrome 瀏覽資料控制管理。見[政策草案](../privacy-policy.zh-TW.md)。

## 發佈者待確認事項

[既有政策網址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)已確認可無須登入存取；新增翻譯尚未確認部署。發佈者資訊、聯絡管道、生效日期、Trader／Non-Trader 身分、帳號驗證與發佈目的地仍待確定。提交商店前須定稿，狀態記錄於[發佈紀錄](../releases.zh-TW.md)。
