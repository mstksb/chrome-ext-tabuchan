---
lang: zh-TW
---

# Chrome 線上應用程式商店資訊草案

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | 繁體中文 | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | [Deutsch](listing.de.md)

適用公開候選版本 `0.1.0`。已確定資訊與待辦事項請參閱[發佈紀錄](../releases.zh-TW.md)。

## 基本資訊

| 欄位 | 草案／現況 |
| --- | --- |
| 名稱 | tabuchan |
| 版本 | 0.1.0，首次公開候選版本 |
| 文件／商店文案語言 | 英文、日文、簡體中文、繁體中文、巴西葡萄牙文、西班牙文、德文，以英文為基礎；Dashboard 儲存值未驗證 |
| 擴充功能介面語言 | Chrome 顯示語言為日文時使用日文，否則英文；文件語言不代表介面支援 |
| 建議類別 | Functionality & UI，依涵蓋分頁／快捷鍵管理的現行官方分類；Dashboard 儲存值未驗證 |
| 摘要 | 短按切換最近分頁，長按瀏覽、搜尋並選取目前視窗中的分頁。 |
| 首頁／支援 | [使用說明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-TW.html)；支援管道由發佈者決定 |
| 發佈範圍／國家 | 由發佈者決定 |
| 政策網址 | [公開網址](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-TW.html)，發佈者／生效日期待定，提交前須定稿 |

## 詳細說明

tabuchan 讓您透過快捷鍵切換目前視窗的分頁。

短按上一個／下一個快捷鍵，依固定最近使用順序移動，預設略過無法使用快捷鍵的分頁。

長按整組快捷鍵可開啟清單。向上／向下選取，Enter 切換，Esc 取消。放開快捷鍵後清單仍顯示。

向左鍵切換最近使用順序與分頁順序。分頁順序清單保留群組階層，可用 Unicode 文字篩選標題，獨立於介面語言。搜尋採 NFC 正規化後不區分大小寫的子字串比對。

每個操作可設定多組快捷鍵。長按時間為 0.5–2 秒，保留過去 10–30 個分頁，預設分別為 1 秒與 10 個。

macOS 預設上一個為 Control + Shift + J，下一個為 Control + Shift + K，其他平台使用 Alt + Shift + J／K。可在設定中實際按下組合來變更。

快捷鍵從一般 HTTP(S) 網頁與 iframe 觸發，無法從 Chrome 內部頁面、Chrome 線上應用程式商店、其他擴充功能頁面、本機檔案頁面或網址列觸發。仍可從一般網頁開啟清單並選取受限分頁。

歷史紀錄及設定於本機處理和儲存。顯示網站圖示可能向圖片供應者傳送請求，資料處理詳見隱私權政策。

## 擷圖

| 素材 | 內容／準備狀態 |
| --- | --- |
| 商店圖示 | [tab-128.png](../icons/tab-128.png)，現有分頁圖案轉為 128×128 PNG |
| 英文設定 | [options-en-1280x800.png](images/options-en-1280x800.png)，1280×800 英文設定介面 |
| 英文清單 | [picker-en-1280x800.png](images/picker-en-1280x800.png)，1280×800，實際按鍵開啟的分頁順序清單及 Work 群組 |
| 日文設定 | [options-1280x800.png](images/options-1280x800.png)，1280×800，實際設定介面的預設快捷鍵 |
| 日文清單 | [picker-1280x800.png](images/picker-1280x800.png)，1280×800，實際按鍵開啟的最近使用清單與測試分頁 |

日文圖片來自公開版 `0.1.0` 的 Chrome 測試。英文圖片來自實際 Chrome，以相同介面程式碼及僅英文辭典的擷圖副本拍攝，已檢查英文文字和版面。原始雙語套件自動選用英文尚未驗證。四張圖片皆為不透明 1280×800 PNG，並經目視檢查。清單使用範例資料；其他文件語言尚無擷圖，介面亦未翻譯為這些語言。

## 審查人員測試說明

無須帳號或登入。在同一視窗開啟並依序造訪多個一般 HTTP(S) 分頁，以上述預設快捷鍵測試短按切換。長按整組至少 1 秒開啟清單，再用向上／向下、Enter、Esc 選取或取消。向左鍵切換模式，在分頁順序模式輸入標題。從工具列圖示開啟設定並確認版本 `0.1.0`。

## 草案依據

依目前實作和候選版 Chrome 測試編寫，包含固定 MRU、短按／長按、群組／標題搜尋、設定、iframe 與受限分頁。原生輸入法、其他系統、舊版 Chrome 及實際英文／回退選擇尚未驗證，見[發佈紀錄](../releases.zh-TW.md)。

商店欄位與圖片要求於 2026 年 11 月 9 日依官方資料檢查；提交前須再次確認 Dashboard 必填欄位：[Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing)、[Supplying Images](https://developer.chrome.com/docs/webstore/images)。
