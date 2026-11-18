---
lang: zh-TW
---

# Chrome 線上應用程式商店資訊草案

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | 繁體中文 | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | [Deutsch](listing.de.md)

此套件的版本為 `0.2.0`。提交版本號將在核對 Dashboard 的上傳紀錄後決定。發佈檔案、已驗證環境及審查與發佈狀態請參閱[發佈紀錄](../releases.zh-TW.md)。

## 基本資訊

| 欄位 | 草案／現況 |
| --- | --- |
| 名稱 | tabuchan |
| 版本 | `0.2.0` |
| 文件／商店文案語言 | 英文、日文、簡體中文、繁體中文、巴西葡萄牙文、西班牙文、德文，以英文為基礎；Dashboard 儲存值未驗證 |
| 擴充功能介面語言 | Chrome 顯示語言為日文時使用日文，否則英文；文件語言不代表介面支援 |
| 建議類別 | Functionality & UI，依涵蓋分頁／快捷鍵管理的現行官方分類；Dashboard 儲存值未驗證 |
| 摘要 | 短按切換最近分頁，長按瀏覽、搜尋並選取目前視窗中的分頁。|
| 首頁／支援 | [使用說明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-TW.html)；支援管道由發佈者決定 |
| 發佈範圍／國家 | 由發佈者決定 |
| 政策網址 | [公開網址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-TW.html)。提交前請確認此網址顯示更新後的隱私權政策 |

## 詳細說明

tabuchan 讓您透過快捷鍵切換目前視窗的分頁。

按住修飾鍵，每次短按並放開上一個或下一個對應的一般按鍵，就會依固定順序切換。放開必要的修飾鍵時，目前分頁會成為最近使用的分頁。預設略過無法使用快捷鍵的分頁。

在任一清單中按 Enter 確認，包括從搜尋結果中確認，或直接在 Chrome 選取分頁，都會將所選分頁列為最近使用。如果歷史紀錄中已有該分頁，只移除原本的項目，其他分頁的相對順序會保留。

長按整組快捷鍵可開啟清單。向上／向下選取，Enter 切換，Esc 取消。放開快捷鍵後清單仍顯示。

按向左鍵切換最近使用順序與實際分頁順序。按分頁順序顯示的清單會保留群組，可獨立於介面語言搜尋標題。用空格分隔搜尋詞。部分比對（預設）要求標題包含所有搜尋詞，順序不限。前綴比對要求第一個詞出現在標題開頭，其餘詞依輸入順序出現，詞與詞之間可以有其他字元。兩種方式都採用 Unicode NFC 正規化，且不區分大小寫。

每個操作可設定多組快捷鍵。長按時間可設為 0.2–2.0 秒，間隔 0.1 秒，預設為 0.5 秒。歷史紀錄保留過去的 10–30 個分頁，預設為 10 個。無法使用快捷鍵的分頁會以灰色顯示並維持列高，仍可按 Enter 選取。

macOS 預設上一個為 Control + Shift + J，下一個為 Control + Shift + K，其他平台使用 Alt + Shift + J／K。可在設定中實際按下組合來變更。

快捷鍵從一般 HTTP(S) 網頁與 iframe 觸發，無法從 Chrome 內部頁面、Chrome 線上應用程式商店、其他擴充功能頁面、本機檔案頁面或網址列觸發。仍可從一般網頁開啟清單並選取受限分頁。

歷史紀錄及設定於本機處理和儲存。顯示網站圖示可能向圖片供應者傳送請求，資料處理詳見隱私權政策。

## 擷圖

| 素材 | 內容／準備狀態 |
| --- | --- |
| 商店圖示 | [tab-128.png](../icons/tab-128.png)，現有分頁圖案轉為 128×128 PNG |
| 英文設定 | [options-en-1280x800.png](images/options-en-1280x800.png)，1280×800，預設長按時間 0.5 秒與搜尋比對設定 |
| 英文清單 | [picker-en-1280x800.png](images/picker-en-1280x800.png), 1280×800, 含群組的英文分頁順序清單 |
| 日文設定 | [options-1280x800.png](images/options-1280x800.png)，1280×800，預設長按時間 0.5 秒與搜尋比對設定 |
| 日文清單 | [picker-1280x800.png](images/picker-1280x800.png), 1280×800, 含群組的日文分頁順序清單 |

四張擷圖皆為 1280×800，使用同一個雙語套件在 Linux arm64 的 Chrome for Testing Stable `158.0.8127.36` 上擷取。Chrome 分別使用日文與英文介面，清單使用範例分頁。

## 審查人員測試說明

無須帳號或登入。在同一視窗依序造訪多個一般 HTTP(S) 分頁。按住修飾鍵，短按並放開上一個、下一個對應的一般按鍵。放開必要的修飾鍵，確認目前分頁成為最近使用的分頁。長按整組快捷鍵至少 0.5 秒，按向左鍵切換到分頁順序，依標題篩選並按 Enter 確認。從工具列圖示開啟設定，確認版本 `0.2.0`。

## 草案依據

候選版本在 Linux arm64 的 Chrome for Testing Stable `158.0.8127.36` 上通過 21 組端對端測試。另有 3 組測試驗證日文與英文介面，以及 Chrome 使用法文時改用英文的行為，並涵蓋 Unicode 標題搜尋。

商店欄位與圖片要求於 2026 年 11 月 9 日依官方資料檢查；提交前須再次確認 Dashboard 必填欄位：[Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)、[Supplying Images](https://developer.chrome.com/docs/webstore/images)。
