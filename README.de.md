---
lang: de
---

# tabuchan

[English](README.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [繁體中文](README.zh-TW.md) | [Português (Brasil)](README.pt-BR.md) | [Español](README.es.md) | Deutsch

Chrome-Erweiterung zum Wechseln zwischen zuletzt verwendeten Tabs per Tastatur. Kurzes Drücken durchläuft den Verlauf, langes Drücken öffnet die Tab-Liste.

Dieses Paket verwendet die Version `0.1.0`. Die Version für die Einreichung richtet sich nach dem Uploadverlauf im Dashboard. Dateien, geprüfte Umgebungen und Store-Status stehen im [Veröffentlichungsprotokoll](releases.de.md).

Die Dokumentation gibt es auf Englisch, Japanisch, vereinfachtem und traditionellem Chinesisch, brasilianischem Portugiesisch, Spanisch und Deutsch. Dies ist unabhängig von der Oberfläche: Einstellungen und Liste sind bei japanischer Chrome-Anzeigesprache japanisch, sonst englisch.

## Funktionen

- Im aktuellen Fenster eine feste Reihenfolge zuletzt verwendeter Tabs vorwärts/rückwärts durchlaufen.
- Zum Öffnen der Liste gedrückt halten; mit Auf/Ab auswählen und mit Enter wechseln.
- Mit Links zwischen letzter Verwendung und tatsächlicher Tab-Reihenfolge wechseln; Titel in der Tab-Reihenfolge suchen.
- Gruppennamen/-farben und die Verfügbarkeit der Tastenkürzel im Ziel-Tab anzeigen.
- Mehrere Tastenkürzel je Richtung sowie Haltedauer und Verlaufslimit einstellen.

## Voraussetzungen

Google Chrome mit Manifest-V3-Unterstützung. Das Manifest nennt Chrome 102 als Mindestversion. Das [Protokoll](releases.de.md) unterscheidet tatsächlich geprüfte Versionen/Umgebungen. Windows, ältere Chrome-Versionen und systemeigene IMEs sind ungeprüft. Unter Linux wurde Chrome for Testing ohne grafische Oberfläche auf arm64 verwendet.

Tastenkürzel beginnen innerhalb normaler HTTP(S)-Seiten, auch in iframes. Auf internen Chrome-Seiten, im Chrome Web Store, auf Seiten anderer Erweiterungen, Dateiseiten oder in der Adressleiste können sie nicht gestartet werden. Die Chrome-Web-Store-Beschränkungen gelten für `chromewebstore.google.com` und `chrome.google.com` einschließlich ihrer Subdomains.

## Laden und einrichten

1. Repository herunterladen und entpacken.
2. `chrome://extensions` öffnen und den Entwicklermodus aktivieren.
3. **Entpackte Erweiterung laden** wählen und den Ordner mit dieser README und `manifest.json` auswählen.
4. Einstellungen über das tabuchan-Symbol öffnen und Tastenkürzel/Verhalten prüfen.

| Aktion | Standard unter macOS | Andere Betriebssysteme |
| --- | --- | --- |
| Zurück | Control + Shift + J | Alt + Shift + J |
| Vorwärts | Control + Shift + K | Alt + Shift + K |

Unter macOS ist die physische Control-Taste gemeint. Gewünschte Kombinationen werden durch tatsächliches Drücken in den Einstellungen erfasst. Chrome, das Betriebssystem oder andere Erweiterungen können Tastenkombinationen abfangen, bevor sie die Seite erreichen.

Kurzes Drücken wird beim Loslassen einer erforderlichen Taste wirksam. Die Standard-Haltedauer beträgt 0,5 Sekunden. Die Liste bleibt nach dem Loslassen aller Tasten offen: Auf/Ab wählt, Enter bestätigt, Esc bricht ab. Links wechselt den Modus. In der Tab-Reihenfolge filtert Texteingabe die Titel; Backspace löscht das letzte Zeichen. Während japanischer IME-Komposition bleiben Enter, Auf/Ab und Esc dem IME vorbehalten.

Suchbegriffe werden durch Leerzeichen getrennt. Die Teilsuche (Standard) findet Titel, die alle Begriffe in beliebiger Reihenfolge enthalten. Bei der Präfixsuche muss der Titel mit dem ersten Begriff beginnen und die übrigen Begriffe in der eingegebenen Reihenfolge enthalten. Zeichen zwischen den Begriffen sind erlaubt. Beide Modi verwenden Unicode-NFC-Normalisierung und ignorieren Groß- und Kleinschreibung.

Die Haltedauer lässt sich in Schritten von 0,1 Sekunden auf 0,2 bis 2,0 Sekunden einstellen. Der Standardwert beträgt 0,5 Sekunden. Der Verlauf umfasst 10 bis 30 vorherige Tabs, standardmäßig 10. Kurzes Drücken überspringt standardmäßig Tabs ohne verfügbare Tastenkürzel. In der Liste erscheinen diese Tabs ausgegraut, wobei die Zeilenhöhe gleich bleibt. Sie lassen sich mit Enter auswählen.

## Datenspeicherung

Der Verlauf wird je Fenster lokal im Sitzungsspeicher gehalten. Browserneustart oder Deaktivieren, Neuladen bzw. Aktualisieren der Erweiterung löscht ihn; danach beginnt er beim aktuellen Tab neu. Tastenkürzel und Einstellungen bleiben lokal gespeichert. Siehe den [Datenschutzentwurf](privacy-policy.de.md), auch zu Favicon-Anfragen.

## ZIP neu erstellen

Ein Terminal im Ordner dieser README öffnen. Die Befehle verwenden macOS-Standardwerkzeuge `zip` und `shasum` für die 29 Laufzeitdateien und ersetzen ZIP und Prüfsumme.

```sh
mkdir -p dist &&
tabuchan_package_tmp=$(mktemp -d) &&
zip -X "$tabuchan_package_tmp/tabuchan-0.1.0.zip" \
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
  mv "$tabuchan_package_tmp/tabuchan-0.1.0.zip" dist/tabuchan-0.1.0.zip &&
rmdir "$tabuchan_package_tmp" &&
(cd dist && shasum -a 256 tabuchan-0.1.0.zip > tabuchan-0.1.0.zip.sha256)
```

`manifest.json` liegt im ZIP-Stamm; Store-Dokumente, Bilder und Protokolle sind ausgeschlossen. Erneutes Packen kann SHA-256 ändern. Vor der Verteilung die tatsächliche Prüfsumme im [Protokoll](releases.de.md) zuordnen.

## Website

Anleitung und öffentliche Dokumente liegen auf GitHub Pages. Den geprüften Bereitstellungsstatus enthält das [Protokoll](releases.de.md#github-pages).

- [Anleitung](https://mstksb.github.io/chrome-ext-tabuchan/README.de.html)
- [Datenschutzentwurf](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.de.html)

Herausgebername, Kontakt und Gültigkeitsdatum sind offen. Die Richtlinie vor Einreichung beim Store abschließen.

## Öffentliche Dokumente

| Dokument | Inhalt |
| --- | --- |
| [README](README.de.md) | Installation, Nutzung, Einstellungen, Voraussetzungen und ZIP-Erstellung |
| [Store-Eintrag](store/listing.de.md) | Texte und Bildschirmaufnahmen |
| [Datenschutzangaben](store/privacy.de.md) | Berechtigungsbegründungen und Entwürfe |
| [Datenschutzrichtlinie](privacy-policy.de.md) | Datenverarbeitung für Nutzer |
| [Veröffentlichungsprotokoll](releases.de.md) | Version, Dateien, geprüfte Umgebungen und Status |
