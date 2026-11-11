---
lang: zh-TW
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | 繁體中文 | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

透過鍵盤切換至最近使用分頁的 Chrome 擴充功能。短按快捷鍵可依歷史順序移動，長按可開啟分頁清單。

公開候選版本為 `0.1.0`。發佈檔案、已驗證環境與審查／發佈狀態請參閱[發佈紀錄](releases.zh-TW.md)。

文件提供英文、日文、簡體中文、繁體中文、巴西葡萄牙文、西班牙文和德文版本。文件語言與介面語言不同：目前 Chrome 顯示語言為日文時，設定與分頁清單使用日文，其他情況使用英文。標題搜尋獨立於介面語言，支援 Unicode 文字，經 NFC 正規化後進行不區分大小寫的子字串比對。

## 主要功能

- 在目前視窗中，依固定的最近使用順序往前或往後切換分頁。
- 長按開啟清單，以向上／向下鍵選取，按 Enter 切換。
- 按向左鍵切換最近使用順序與實際分頁順序，並在分頁順序清單中搜尋標題。
- 顯示分頁群組名稱、顏色及目標分頁是否可使用快捷鍵。
- 為每個方向設定多組快捷鍵，並調整長按時間與歷史紀錄數量。

## 系統需求

需要支援 Manifest V3 的 Google Chrome。資訊清單宣告最低版本為 Chrome 102。[發佈紀錄](releases.zh-TW.md)區分實際測試的環境與版本。Windows、Linux、舊版 Chrome 及作業系統的日文輸入法尚未驗證。

快捷鍵必須從一般 HTTP(S) 網頁內觸發，也支援 iframe。無法從 Chrome 內部頁面、Chrome 線上應用程式商店、其他擴充功能頁面、本機檔案頁面或網址列觸發。

## 載入與設定

1. 下載並解壓縮此存放庫。
2. 在 Chrome 開啟 `chrome://extensions`，啟用開發人員模式。
3. 選擇「載入未封裝項目」，再選取包含本 README 與 `manifest.json` 的資料夾。
4. 點選工具列的 tabuchan 圖示，開啟設定並確認快捷鍵及行為選項。

| 操作 | macOS 預設快捷鍵 | 其他作業系統預設快捷鍵 |
| --- | --- | --- |
| 上一個 | Control + Shift + J | Alt + Shift + J |
| 下一個 | Control + Shift + K | Alt + Shift + K |

macOS 使用實體 Control 鍵。在設定中實際按下組合即可登錄。Chrome、作業系統或其他擴充功能可能優先攔截按鍵，使網頁無法接收。

短按會在放開必要按鍵時生效。預設長按時間為 1 秒。放開所有按鍵後清單仍保持顯示：向上／向下選取，Enter 確認，Esc 取消。向左鍵切換最近使用順序與分頁順序。在分頁順序清單輸入文字可篩選標題，Backspace 刪除最後一個字元。日文輸入法組字期間，Enter、向上／向下與 Esc 保留給輸入法操作。

長按時間可設為 0.5–2 秒，間隔 0.1 秒。歷史紀錄保留過去的 10–30 個分頁，預設 10 個。短按預設跳過無法使用快捷鍵的分頁，仍可從清單明確選取這些分頁。

## 資料儲存

歷史紀錄依視窗儲存在裝置本機的工作階段儲存空間。重新啟動瀏覽器或停用、重新載入、更新擴充功能會清除紀錄，之後從目前分頁重新累積。快捷鍵與行為設定儲存在本機。資料處理與網站圖示請求請參閱[隱私權政策草案](privacy-policy.zh-TW.md)。

## 重新封裝 ZIP

在本 README 所在資料夾開啟終端機，可使用 macOS 標準的 `zip` 與 `shasum` 將 20 個執行檔案重新封裝。下列指令會取代現有 ZIP 與總和檢查碼檔案。

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.1.0.zip" \
  manifest.json \
  options.html \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  icons/tab.svg \
  icons/tab-16.png \
  icons/tab-48.png \
  icons/tab-128.png \
  src/background.js \
  src/controller.js \
  src/history.js \
  src/input-bridge.js \
  src/options.css \
  src/options.js \
  src/overlay.js \
  src/page-input.js \
  src/press-state.js \
  src/settings.js \
  src/shortcuts.js \
  src/tab-access.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.1.0.zip" dist/tabuchan-0.1.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.1.0.zip > tabuchan-0.1.0.zip.sha256)
```

ZIP 根目錄包含 `manifest.json`，不含商店文件、擷圖或發佈紀錄。重新封裝可能改變 SHA-256。發佈前請將實際 ZIP 的總和檢查碼與[發佈紀錄](releases.zh-TW.md)對應。

## 網站

使用說明與公開文件託管於 GitHub Pages。已驗證的部署狀態請參閱[發佈紀錄](releases.zh-TW.md#github-pages)。

- [使用說明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-TW.html)
- [隱私權政策草案](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-TW.html)

發佈者名稱、聯絡方式與生效日期尚未確定，須在提交商店審查前完成政策定稿。

## 公開文件

| 文件 | 內容 |
| --- | --- |
| [README](README.zh-TW.md) | 安裝、使用、設定、系統需求及 ZIP 重新封裝 |
| [商店資訊](store/listing.zh-TW.md) | 商店說明文案與擷圖 |
| [隱私權申報](store/privacy.zh-TW.md) | 權限用途與隱私權申報草案 |
| [隱私權政策](privacy-policy.zh-TW.md) | 使用者資料處理政策草案 |
| [發佈紀錄](releases.zh-TW.md) | 版本、發佈檔案、驗證環境與審查／發佈狀態 |
