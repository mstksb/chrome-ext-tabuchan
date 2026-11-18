---
lang: ja
---

# tabuchan

[English](README.md) | 日本語 | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

最近使ったタブへキーボードで移動するChrome拡張です。短押しで履歴をたどり、長押しで候補を表示します。

このパッケージのバージョンは `0.2.1` です。配布物と確認済みの環境、審査・公開状態は[公開記録](releases.ja.md)を参照してください。

設定画面と候補一覧はChromeの表示言語に合わせて自動選択します。日本語環境では日本語、それ以外では英語を表示します。

文書は英語、日本語、中国語（簡体字・繁体字）、ポルトガル語（ブラジル）、スペイン語、ドイツ語に対応します。文書の対応言語と拡張UIの対応言語は別です。

## 主な機能

- 現在のウィンドウ内で、最近使ったタブを固定した順序で戻る・進む。
- 長押しで候補一覧を開き、上下キーで選択してEnterで切り替える。
- 左キーで最近使用順と実際のタブ順を切り替え、タブ順一覧でタイトルを検索する。
- タブグループの名前と、移動先でショートカットを使えるかを表示する。
- 各方向へ複数のショートカットを割り当て、長押し時間や履歴件数を設定する。

## 動作条件

Manifest V3に対応するGoogle Chromeを使用します。manifestの最低バージョン指定は102です。実際に確認した環境・対象版は[公開記録](releases.ja.md)で区別しています。Windows、旧Chrome、OSのIMEそのものは未確認です。Linuxではarm64のヘッドレス版Chrome for Testingで確認しました。

キー操作の開始位置は通常のHTTP(S)ページ内です。iframe内からの操作にも対応します。Chrome内部ページ、Chrome Web Store、他の拡張ページ、ファイルページ、アドレス欄ではキー操作を開始できません。Chrome Web Store関連の制限は `chromewebstore.google.com` と `chrome.google.com` の両方に適用され、サブドメインも含みます。

## 読み込みと設定

1. このリポジトリーをダウンロードして展開します。
2. Chromeで `chrome://extensions` を開き、デベロッパーモードを有効にします。
3. 「パッケージ化されていない拡張機能を読み込む」で、このREADMEと `manifest.json` があるフォルダーを選びます。
4. ツールバーのtabuchanアイコンから設定画面を開き、キーと動作設定を確認します。

| 操作 | macOSの初期キー | その他のOS向け初期キー |
| --- | --- | --- |
| 戻る | Control + Shift + J | Alt + Shift + J |
| 進む | Control + Shift + K | Alt + Shift + K |

macOSでは物理的なControlキーを使います。設定画面では、実際に使用する組み合わせを押して各方向へ登録できます。Chrome・OS・他の拡張が優先して処理する組み合わせは、ページへの配送に制限があります。

必要な修飾キーを押したまま「戻る」または「進む」の通常キーを短く押して離すたび、固定した履歴順で1件移動します。必要な修飾キーのいずれかを離すと、そのとき表示しているタブが履歴の最新になります。

長押しの初期値は0.5秒です。候補一覧は全キーを離した後も表示され、上下で選択、Enterで確定、Escで取消できます。左キーで最近使用順とタブ順を切り替えます。タブ順一覧ではUnicode文字列でタイトルを絞り込み、Backspaceで末尾を削除します。日本語変換中のEnter・上下・EscはIMEの操作に使います。

どちらの一覧でも、検索結果を含めてEnterで選んだタブが最新になります。Chromeでタブを直接選んだ場合も同じです。履歴にあるタブを選んだ場合は、元の位置にある項目を除き、残りのタブの順序を保ちます。

検索語はスペースで区切ります。部分一致（初期設定）は全検索語を含むタイトルを語順に関係なく表示します。前方一致は最初の語がタイトルの先頭にあり、後続の語が入力順に現れるものを表示します。語の間に別の文字があっても一致します。どちらもUnicode NFCで正規化し、大小文字を区別しません。

長押し時間は0.2〜2.0秒を0.1秒刻みで設定でき、初期値は0.5秒です。過去の履歴件数は10〜30件で、初期値は10件です。初期設定では短押しでショートカットを使えないタブを飛ばします。一覧では行の高さを保ったままグレーアウトし、Enterで選択できます。スキップを無効にしてキー入力を受け取れないタブへ移動した場合は、移動時点でそのタブが最新になります。

## データの保存

履歴はウィンドウごとに端末内のセッション領域へ保持します。ブラウザー再起動、拡張の無効化・再読み込み・更新で履歴は消去され、現在タブから再び蓄積します。キーと動作設定は端末内に保存します。データの取扱いは[プライバシーポリシー](privacy-policy.ja.md)を参照してください。

## 配布ZIPの再梱包

このフォルダーの28実行ファイルだけを使い、macOS標準の `zip` と `shasum` で再梱包できます。ターミナルでこのREADMEがあるフォルダーを開き、次を実行します。既存の配布ZIPとチェックサムを更新します。

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.2.1.zip" \
  manifest.json \
  options.html \
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
  mv "$tabuchan_package_tmp/tabuchan-0.2.1.zip" dist/tabuchan-0.2.1.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.2.1.zip > tabuchan-0.2.1.zip.sha256)
```

ZIPの直下に `manifest.json` が入り、掲載資料・画像・公開記録は収録されません。再梱包ではZIPのSHA-256が変わる場合があります。配布時は実際のZIPのチェックサムと[公開記録](releases.ja.md)を対応させてください。

## Webサイト

使い方と公開資料をGitHub Pagesで公開しています。URLは次のとおりです。公開状況は[公開記録](releases.ja.md#github-pages)を参照してください。

- [使い方](https://mstksb.github.io/chrome-ext-tabuchan/README.ja.html)
- [GitHub Pagesのプライバシーポリシー](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.ja.html)

GitHub Pagesのプライバシーポリシーは、7言語すべてでログインせずにHTTPSで閲覧できることを確認しました。

## 公開資料

| ファイル | 内容 |
| --- | --- |
| [README.md](README.ja.md) | 導入、使い方、設定、動作条件、配布ZIPの再梱包 |
| [store/listing.md](store/listing.ja.md) | ストア掲載原稿と掲載画像 |
| [store/privacy.md](store/privacy.ja.md) | 権限理由とプライバシー申告原稿 |
| [privacy-policy.md](privacy-policy.ja.md) | データの取扱いを説明するプライバシーポリシー |
| [releases.md](releases.ja.md) | 対象版、配布物、確認済みの環境、審査・公開状態 |
