---
lang: de
---

# Entwurf des Chrome-Web-Store-Eintrags

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | Deutsch

Dieses Paket verwendet die Version `0.2.0`. Die Version für die Einreichung richtet sich nach dem Uploadverlauf im Dashboard. Dateien, geprüfte Umgebungen und Store-Status stehen im [Protokoll](../releases.de.md).

## Grunddaten

| Feld | Entwurf / Status |
| --- | --- |
| Name | tabuchan |
| Version | `0.2.0` |
| Dokument-/Eintragssprachen | Englisch als Basis; Japanisch, vereinfachtes/traditionelles Chinesisch, brasilianisches Portugiesisch, Spanisch, Deutsch. Gespeicherte Dashboard-Sprachen ungeprüft |
| Oberfläche | Japanisch bei japanischer Chrome-Anzeigesprache, sonst Englisch; Dokumentsprachen erweitern sie nicht |
| Kategorie-Vorschlag | Functionality & UI gemäß aktueller offizieller Kategorie für Tabs/Tastenkürzel; gespeicherter Wert ungeprüft |
| Kurzbeschreibung | Kurz drücken für letzte Tabs. Gedrückt halten, um Tabs im aktuellen Fenster aufzulisten, zu suchen und auszuwählen. |
| Startseite / Support | [Anleitung](https://mstksb.github.io/chrome-ext-tabuchan/README.de.html); Supportweg durch Herausgeber festzulegen |
| Sichtbarkeit / Länder | Durch Herausgeber festzulegen |
| Datenschutz | [Öffentliche URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.de.html); Herausgeber/Gültigkeit offen, vor Einreichung abschließen |

## Ausführliche Beschreibung

tabuchan wechselt per Tastenkürzel zwischen Tabs im aktuellen Fenster.

Die erforderlichen Modifikatortasten gedrückt halten und die Buchstabentaste für Zurück oder Vorwärts kurz drücken und loslassen, um einer festen Reihenfolge zu folgen. Wird eine erforderliche Modifikatortaste losgelassen, gilt der angezeigte Tab als zuletzt verwendet. Tabs ohne verfügbare Tastenkürzel werden standardmäßig übersprungen.

Enter in einer der beiden Listen, auch in den Suchergebnissen, oder die direkte Auswahl eines Tabs in Chrome macht ihn zum zuletzt verwendeten Tab. War er schon im Verlauf, wird sein alter Eintrag entfernt und die Reihenfolge der anderen Tabs bleibt erhalten.

Die gesamte Kombination gedrückt halten, um die Liste zu öffnen. Auf/Ab wählt, Enter wechselt, Esc bricht ab. Die Liste bleibt nach dem Loslassen offen.

Mit der Linkstaste wechseln Sie zwischen letzter Verwendung und tatsächlicher Tab-Reihenfolge. Die Liste in Tab-Reihenfolge behält Gruppen bei und filtert Titel unabhängig von der Oberflächensprache. Suchbegriffe werden durch Leerzeichen getrennt. Die Teilsuche (Standard) findet Titel, die alle Begriffe in beliebiger Reihenfolge enthalten. Bei der Präfixsuche muss der Titel mit dem ersten Begriff beginnen und die übrigen Begriffe in der eingegebenen Reihenfolge enthalten. Zeichen zwischen den Begriffen sind erlaubt. Beide Modi verwenden Unicode-NFC-Normalisierung und ignorieren Groß- und Kleinschreibung.

Für jede Aktion lassen sich mehrere Tastenkürzel festlegen. Die Haltedauer lässt sich in Schritten von 0,1 Sekunden auf 0,2 bis 2,0 Sekunden einstellen. Der Standardwert beträgt 0,5 Sekunden. Der Verlauf umfasst 10 bis 30 vorherige Tabs, standardmäßig 10. Tabs ohne verfügbare Tastenkürzel erscheinen ausgegraut. Die Zeilenhöhe bleibt gleich und die Tabs lassen sich mit Enter auswählen.

macOS: Control + Shift + J für Zurück, Control + Shift + K für Vorwärts. Andere Systeme: Alt + Shift + J/K. Eigene Kombinationen lassen sich in Einstellungen erfassen.

Tastenkürzel beginnen in normalen HTTP(S)-Seiten und iframes, nicht auf internen Seiten, im Chrome Web Store, in anderen Erweiterungen, Dateien oder der Adressleiste. Eingeschränkte Tabs bleiben über eine auf normaler Seite geöffnete Liste auswählbar.

Verlauf und Einstellungen werden lokal verarbeitet/gespeichert. Favicons können Anfragen an den Bildanbieter auslösen; siehe Datenschutzrichtlinie.

## Bildschirmaufnahmen

| Datei | Inhalt / Vorbereitung |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Bestehendes Symbol als PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Standard-Haltedauer von 0,5 Sekunden und Einstellungen zur Suchmethode auf Englisch, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Englische Liste in Tab-Reihenfolge mit Gruppen, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Standard-Haltedauer von 0,5 Sekunden und Einstellungen zur Suchmethode auf Japanisch, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Japanische Liste in Tab-Reihenfolge mit Gruppen, 1280×800 |

Die vier Aufnahmen mit 1280×800 Pixeln zeigen dasselbe zweisprachige Paket in Chrome for Testing Stable `158.0.8127.36` (Linux arm64) mit japanischer und englischer Chrome-Oberfläche. Die Listen zeigen Beispiel-Tabs.

## Prüfanleitung

Ein Konto oder eine Anmeldung ist nicht erforderlich. Mehrere gewöhnliche HTTP(S)-Tabs in einem Fenster öffnen und nacheinander besuchen. Die Modifikatortasten gedrückt halten und die Buchstabentasten für Zurück und Vorwärts kurz betätigen. Eine erforderliche Modifikatortaste loslassen und prüfen, ob der angezeigte Tab als zuletzt verwendet erscheint. Die ganze Kombination mindestens 0,5 Sekunden halten. Mit Links die Tab-Reihenfolge öffnen, nach Titel filtern und mit Enter bestätigen. Über das Symbol in der Symbolleiste die Einstellungen öffnen und Version `0.2.0` prüfen.

## Grundlage

Der Kandidat bestand 21 End-to-End-Testgruppen in Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Drei weitere Gruppen bestätigten die japanische und englische Oberfläche, die englische Oberfläche bei französischer Chrome-Sprache sowie die Unicode-Titelsuche.

Felder und Bildanforderungen wurden am 9. November 2026 mit offiziellen Dokumenten abgeglichen. Aktuelle Pflichtfelder vor Einreichung prüfen: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
