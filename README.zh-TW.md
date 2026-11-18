---
lang: zh-TW
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | 繁體中文 | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

透過鍵盤切換至最近使用分頁的 Chrome 擴充功能。短按快捷鍵可依歷史順序移動，長按可開啟分頁清單。

此套件的版本為 `0.2.0`。提交版本號將在核對 Dashboard 的上傳紀錄後決定。發佈檔案、已驗證環境及審查與發佈狀態請參閱[發佈紀錄](releases.zh-TW.md)。

文件提供英文、日文、簡體中文、繁體中文、巴西葡萄牙文、西班牙文和德文版本。文件語言與介面語言不同：目前 Chrome 顯示語言為日文時，設定與分頁清單使用日文，其他情況使用英文。

## 主要功能

- 在目前視窗中，依固定的最近使用順序往前或往後切換分頁。
- 長按開啟清單，以向上／向下鍵選取，按 Enter 切換。
- 按向左鍵切換最近使用順序與實際分頁順序，並在分頁順序清單中搜尋標題。
- 顯示分頁群組名稱及目標分頁是否可使用快捷鍵。
- 為每個方向設定多組快捷鍵，並調整長按時間與歷史紀錄數量。

## 系統需求

需要支援 Manifest V3 的 Google Chrome。資訊清單宣告最低版本為 Chrome 102。[發佈紀錄](releases.zh-TW.md)區分實際測試的環境與版本。Windows、舊版 Chrome 與作業系統原生輸入法尚未驗證。Linux 環境使用 arm64 無頭版 Chrome for Testing 驗證。

快捷鍵必須從一般 HTTP(S) 網頁內觸發，也支援 iframe。無法從 Chrome 內部頁面、Chrome 線上應用程式商店、其他擴充功能頁面、本機檔案頁面或網址列觸發。Chrome 線上應用程式商店的限制適用於 `chromewebstore.google.com` 與 `chrome.google.com`，包括兩者的子網域。

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

按住所需的修飾鍵，每次短按並放開上一個或下一個對應的一般按鍵，就會依固定的歷史順序切換一個分頁。放開任何一個必要的修飾鍵時，目前顯示的分頁會成為最近使用的分頁。

預設長按時間為 0.5 秒。放開所有按鍵後清單仍保持顯示：向上／向下選取，Enter 確認，Esc 取消。向左鍵切換最近使用順序與分頁順序。在分頁順序清單輸入文字可篩選標題，Backspace 刪除最後一個字元。日文輸入法組字期間，Enter、向上／向下與 Esc 保留給輸入法操作。

在任一清單中按 Enter 確認，包括從搜尋結果中確認，或直接在 Chrome 選取分頁，都會將所選分頁列為最近使用。如果歷史紀錄中已有該分頁，只移除原本的項目，其他分頁的相對順序會保留。

用空格分隔搜尋詞。部分比對（預設）要求標題包含所有搜尋詞，順序不限。前綴比對要求第一個詞出現在標題開頭，其餘詞依輸入順序出現，詞與詞之間可以有其他字元。兩種方式都採用 Unicode NFC 正規化，且不區分大小寫。

長按時間可設為 0.2–2.0 秒，間隔 0.1 秒，預設為 0.5 秒。歷史紀錄保留過去的 10–30 個分頁，預設為 10 個。短按時預設略過無法使用快捷鍵的分頁。清單會將這些分頁以灰色顯示並維持列高，仍可按 Enter 選取。關閉略過功能後，切換到擴充功能無法接收按鍵輸入的分頁時，該分頁會立即成為最近使用的分頁。

## 資料儲存

歷史紀錄依視窗儲存在裝置本機的工作階段儲存空間。重新啟動瀏覽器或停用、重新載入、更新擴充功能會清除紀錄，之後從目前分頁重新累積。快捷鍵與行為設定儲存在本機。資料處理與網站圖示請求請參閱[隱私權政策](privacy-policy.zh-TW.md)。

## 重新封裝 ZIP

在本 README 所在資料夾開啟終端機，可使用 macOS 標準的 `zip` 與 `shasum` 將 29 個執行檔案重新封裝。下列指令會取代現有 ZIP 與總和檢查碼檔案。

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.2.0.zip" \
  manifest.json \
  options.html \
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
  src/tab-access.js \
  _locales/en/messages.json \
  _locales/ja/messages.json \
  picker.html \
  src/input-protocol.js \
  src/legacy-command.js \
  src/picker-model.js \
  src/picker-view.js \
  src/picker.css \
  src/picker.js \
  src/settings-rules.js \
  src/shortcut-changes.js && \
  mv "$tabuchan_package_tmp/tabuchan-0.2.0.zip" dist/tabuchan-0.2.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.2.0.zip > tabuchan-0.2.0.zip.sha256)
```

ZIP 根目錄包含 `manifest.json`，不含商店文件、擷圖或發佈紀錄。重新封裝可能改變 SHA-256。發佈前請將實際 ZIP 的總和檢查碼與[發佈紀錄](releases.zh-TW.md)對應。

## 網站

使用說明與公開文件託管於 GitHub Pages。已驗證的部署狀態請參閱[發佈紀錄](releases.zh-TW.md#github-pages)。

- [使用說明](https://mstksb.github.io/chrome-ext-tabuchan/README.zh-TW.html)
- [GitHub Pages 上的隱私權政策](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.zh-TW.html)

更新後的 `0.2.0` 隱私權政策已在此存放庫中，尚未部署至 GitHub Pages。

## 公開文件

| 文件 | 內容 |
| --- | --- |
| [README](README.zh-TW.md) | 安裝、使用、設定、系統需求及 ZIP 重新封裝 |
| [商店資訊](store/listing.zh-TW.md) | 商店說明文案與擷圖 |
| [隱私權申報](store/privacy.zh-TW.md) | 權限用途與隱私權申報草案 |
| [隱私權政策](privacy-policy.zh-TW.md) | 說明擴充功能如何處理資料的隱私權政策 |
| [發佈紀錄](releases.zh-TW.md) | 版本、發佈檔案、驗證環境與審查／發佈狀態 |
