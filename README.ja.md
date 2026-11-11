---
lang: ja
---

# tabuchan

[English](README.md) | 日本語 | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | [Deutsch](README.de.md)

最近使ったタブへキーボードで移動するChrome拡張です。短押しで履歴をたどり、長押しで候補を表示します。

公開用バージョンは `0.1.0` です。配布物と確認済みの環境、審査・公開状態は[公開記録](releases.ja.md)を参照してください。

設定画面と候補一覧はChromeの表示言語に合わせて自動選択します。日本語環境では日本語、それ以外では英語を表示します。検索はUI言語と独立してUnicode文字列を扱い、タイトルと入力をNFC正規化してから大小文字を区別しない部分一致で絞り込みます。

文書は英語、日本語、中国語（簡体字・繁体字）、ポルトガル語（ブラジル）、スペイン語、ドイツ語に対応します。文書の対応言語と拡張UIの対応言語は別です。

## 主な機能

- 現在のウィンドウ内で、最近使ったタブを固定した順序で戻る・進む。
- 長押しで候補一覧を開き、上下キーで選択してEnterで切り替える。
- 左キーで最近使用順と実際のタブ順を切り替え、タブ順一覧でタイトルを検索する。
- タブグループの名前・色と、移動先でショートカットを使えるかを表示する。
- 各方向へ複数のショートカットを割り当て、長押し時間や履歴件数を設定する。

## 動作条件

Manifest V3に対応するGoogle Chromeを使用します。manifestの最低バージョン指定は102です。実際に確認した環境・対象版は[公開記録](releases.ja.md)で区別しています。Windows・Linux・旧ChromeとOSの日本語IME自体の動作は未確認です。

キー操作の開始位置は通常のHTTP(S)ページ内です。iframe内からの操作にも対応します。Chrome内部ページ、Chrome Web Store、他の拡張ページ、ファイルページ、アドレス欄ではキー操作を開始できません。

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

短押しはキーを離すと確定します。長押しの初期値は1秒です。候補一覧は全キーを離した後も表示され、上下で選択、Enterで確定、Escで取消できます。左キーで最近使用順とタブ順を切り替えます。タブ順一覧ではUnicode文字列でタイトルを絞り込み、Backspaceで末尾を削除します。日本語変換中のEnter・上下・EscはIMEの操作に使います。

設定可能な長押し時間は0.5〜2秒、0.1秒刻みです。過去の履歴件数は10〜30件、初期値10件です。短押しで使えないタブを飛ばす設定は初期値ONです。候補一覧からは、そのタブを明示的に選んで移動できます。

## データの保存

履歴はウィンドウごとに端末内のセッション領域へ保持します。ブラウザー再起動、拡張の無効化・再読み込み・更新で履歴は消去され、現在タブから再び蓄積します。キーと動作設定は端末内に保存します。データの取扱いは[プライバシーポリシー草案](privacy-policy.ja.md)を参照してください。

## 配布ZIPの再梱包

このフォルダーの20実行ファイルだけを使い、macOS標準の `zip` と `shasum` で再梱包できます。ターミナルでこのREADMEがあるフォルダーを開き、次を実行します。既存の配布ZIPとチェックサムを更新します。

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

ZIPの直下に `manifest.json` が入り、掲載資料・画像・公開記録は収録されません。再梱包ではZIPのSHA-256が変わる場合があります。配布時は実際のZIPのチェックサムと[公開記録](releases.ja.md)を対応させてください。

## Webサイト

使い方と公開資料をGitHub Pagesで公開しています。URLは次のとおりです。公開状況は[公開記録](releases.ja.md#github-pages)を参照してください。

- [使い方](https://mstksb.github.io/chrome-ext-tabuchan/README.ja.html)
- [プライバシーポリシー草案](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.ja.html)

プライバシーポリシーは、公開者名・連絡先・施行日が未確定の草案です。ストア提出前に内容を確定します。

## 公開資料

| ファイル | 内容 |
| --- | --- |
| [README.md](README.ja.md) | 導入、使い方、設定、動作条件、配布ZIPの再梱包 |
| [store/listing.md](store/listing.ja.md) | ストア掲載原稿と掲載画像 |
| [store/privacy.md](store/privacy.ja.md) | 権限理由とプライバシー申告原稿 |
| [privacy-policy.md](privacy-policy.ja.md) | 利用者向けデータ取扱いの草案 |
| [releases.md](releases.ja.md) | 対象版、配布物、確認済みの環境、審査・公開状態 |
