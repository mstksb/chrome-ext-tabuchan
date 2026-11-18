---
lang: zh-TW
---

# 隱私權申報草案

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | 繁體中文 | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | [Deutsch](privacy.de.md)

本申報草案依 tabuchan `0.2.1` 的程式行為編寫。待辦事項與驗證／提交狀態請參閱[發佈紀錄](../releases.zh-TW.md)。

## 單一用途

透過鍵盤切換至目前視窗最近使用的分頁，或以標題搜尋找到的分頁。

## 權限用途

| 權限 | Dashboard 說明草案 |
| --- | --- |
| `tabs` | 列舉各視窗分頁並取得 ID、標題、網址和網站圖示網址，建立各視窗歷史紀錄／清單、判斷快捷鍵可用性，並啟用使用者選取的分頁。 |
| `tabGroups` | 顯示分頁順序清單的群組名稱與顏色，保留群組階層。 |
| `storage` | 本機儲存快捷鍵／行為設定，於瀏覽器工作階段保留歷史紀錄和巡覽狀態。 |
| `scripting` | 對已開啟 HTTP(S) 網頁注入輸入偵測與清單顯示，包含安裝／更新後準備網頁端處理。 |
| `http://*/*`、`https://*/*` | 偵測 HTTP(S) 網頁及其 iframe 內快捷鍵的按下與放開，並在嵌入最上層網頁的擴充功能框架內顯示清單。這讓快捷鍵可從一般網頁觸發。 |

## 資料取得、使用與儲存

| 資料 | 用途 | 儲存／保留 |
| --- | --- | --- |
| 分頁／視窗 ID、最近使用順序、巡覽狀態 | 最近使用切換及歷史一致性 | `storage.session.mruState`，瀏覽器工作階段期間 |
| 標題、網址、網站圖示網址、群組 ID／名稱／顏色 | 清單、標題搜尋、快捷鍵可用性判斷 | Chrome API 取得，在記憶體／清單狀態使用 |
| 按下／放開事件、設定頁登錄的組合 | 快捷鍵、長按／清單操作、設定 | 按鍵狀態於記憶體；確定的組合在 `storage.local.mruShortcuts` |
| 長按時間、歷史紀錄上限、短按時略過無法使用快捷鍵的分頁、搜尋比對方式 | 套用使用者行為設定 | `storage.local.mruSettings` |
| 清單中的標題搜尋文字 | 篩選分頁 | 清單開啟時在記憶體，切換模式／關閉時捨棄 |

標題與群組名稱以純文字顯示於擴充功能的框架內。搜尋文字由同一框架內的輸入欄處理。清單內容與搜尋文字在擴充功能內處理。輸入事件用於快捷鍵、清單操作及記錄快捷鍵。

## 外部請求與第三方處理

在分頁清單及舊版 Chrome 快捷鍵指令的通知中顯示網站圖示時，瀏覽器可能向 Chrome 提供的 HTTPS 圖示網址所指向的伺服器請求圖片。如果 Chrome 提供的圖示網址使用 HTTP，擴充功能會顯示替代圖示，且不會向該網址傳送請求。HTTPS 圖示請求使用 `referrerPolicy="no-referrer"`。

圖片供應者可能收到 IP 位址和一般瀏覽器請求資訊。Cookie 與快取的處理取決於 Chrome 的設定、政策和目的伺服器。各供應者依自身規範保留存取紀錄。提交前應核對資料使用申報內容。

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
| 政策網址 | 確認可無須登入，透過 HTTPS 存取 GitHub Pages 上更新後的[隱私權政策](../privacy-policy.zh-TW.md)，再於 Dashboard 填寫網址。 |

僅在本機處理的資料也須揭露，依現行 Dashboard 定義確定分類及認證：[Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)、[User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)。

## 保留與刪除

瀏覽器重啟或停用／重新載入／更新擴充功能會清除工作階段歷史。關閉分頁及超過降低後上限的紀錄會移除。設定保留到使用者變更，解除安裝會刪除 Chrome 擴充功能儲存。搜尋文字於關閉清單或切換模式時捨棄。圖片快取透過 Chrome 瀏覽資料控制管理。見[隱私權政策](../privacy-policy.zh-TW.md)。

## 發佈者待確認事項

發佈者為 `mstksb`。聯絡信箱為 [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com)。本政策適用於 tabuchan `0.2.0` 和 `0.2.1`，自這兩個版本中第一個在 Chrome 線上應用程式商店發佈的版本上架日起生效。

已確認可透過 HTTPS 無須登入存取隱私權政策的[既有政策網址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html)。Trader／Non-Trader 身分、帳號驗證和發佈目的地仍待確定。最新狀態請參閱[發佈紀錄](../releases.zh-TW.md)。
