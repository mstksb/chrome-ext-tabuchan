---
lang: de
---

# Entwurf des Chrome-Web-Store-Eintrags

[English](listing.md) | [日本語](listing.ja.md) | [简体中文](listing.zh-CN.md) | [繁體中文](listing.zh-TW.md) | [Português (Brasil)](listing.pt-BR.md) | [Español](listing.es.md) | Deutsch

Für den öffentlichen Kandidaten `0.1.0`. Festlegungen und offene Punkte stehen im [Protokoll](../releases.de.md).

## Grunddaten

| Feld | Entwurf / Status |
| --- | --- |
| Name | tabuchan |
| Version | 0.1.0, erster öffentlicher Kandidat |
| Dokument-/Eintragssprachen | Englisch als Basis; Japanisch, vereinfachtes/traditionelles Chinesisch, brasilianisches Portugiesisch, Spanisch, Deutsch. Gespeicherte Dashboard-Sprachen ungeprüft |
| Oberfläche | Japanisch bei japanischer Chrome-Anzeigesprache, sonst Englisch; Dokumentsprachen erweitern sie nicht |
| Kategorie-Vorschlag | Functionality & UI gemäß aktueller offizieller Kategorie für Tabs/Tastenkürzel; gespeicherter Wert ungeprüft |
| Kurzbeschreibung | Kurz drücken für letzte Tabs. Gedrückt halten, um Tabs im aktuellen Fenster aufzulisten, zu suchen und auszuwählen. |
| Startseite / Support | [Anleitung](https://mstksb.github.io/chrome-ext-tabuchan/README.de.html); Supportweg durch Herausgeber festzulegen |
| Sichtbarkeit / Länder | Durch Herausgeber festzulegen |
| Datenschutz | [Öffentliche URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.de.html); Herausgeber/Gültigkeit offen, vor Einreichung abschließen |

## Ausführliche Beschreibung

tabuchan wechselt per Tastenkürzel zwischen Tabs im aktuellen Fenster.

Zurück oder Vorwärts kurz drücken, um eine feste Reihenfolge letzter Verwendung zu durchlaufen. Tabs ohne verfügbare Tastenkürzel werden standardmäßig übersprungen.

Die gesamte Kombination gedrückt halten, um die Liste zu öffnen. Auf/Ab wählt, Enter wechselt, Esc bricht ab. Die Liste bleibt nach dem Loslassen offen.

Links wechselt zwischen letzter Verwendung und Tab-Reihenfolge. Letztere bewahrt Gruppen und filtert Titel mit Unicode unabhängig von der Oberflächensprache, per NFC und Teilzeichenfolgen ohne Groß-/Kleinschreibung.

Mehrere Tastenkürzel je Aktion, 0,5–2 Sekunden Haltedauer und 10–30 vorherige Tabs sind einstellbar. Standard: 1 Sekunde und 10 Tabs.

macOS: Control + Shift + J für Zurück, Control + Shift + K für Vorwärts. Andere Systeme: Alt + Shift + J/K. Eigene Kombinationen lassen sich in Einstellungen erfassen.

Tastenkürzel beginnen in normalen HTTP(S)-Seiten und iframes, nicht auf internen Seiten, im Chrome Web Store, in anderen Erweiterungen, Dateien oder der Adressleiste. Eingeschränkte Tabs bleiben über eine auf normaler Seite geöffnete Liste auswählbar.

Verlauf und Einstellungen werden lokal verarbeitet/gespeichert. Favicons können Anfragen an den Bildanbieter auslösen; siehe Datenschutzrichtlinie.

## Bildschirmaufnahmen

| Datei | Inhalt / Vorbereitung |
| --- | --- |
| [tab-128.png](../icons/tab-128.png) | Bestehendes Symbol als PNG 128×128 |
| [options-en-1280x800.png](images/options-en-1280x800.png) | Englische Einstellungen, 1280×800 |
| [picker-en-1280x800.png](images/picker-en-1280x800.png) | Tab-Reihenfolge mit Gruppe Work, durch echte Tasteneingabe geöffnet, 1280×800 |
| [options-1280x800.png](images/options-1280x800.png) | Japanische Einstellungen mit Standardkürzeln, 1280×800 |
| [picker-1280x800.png](images/picker-1280x800.png) | Japanische Liste letzter Verwendung mit Test-Tabs und echten Tasten, 1280×800 |

Japanische Bilder stammen aus Chrome-Tests von `0.1.0`. Englische Bilder entstanden im echten Chrome mit gleichem Code und ausschließlich englischem Wörterbuch: Text/Layout geprüft, automatische Auswahl im ursprünglichen zweisprachigen Paket ungeprüft. Alle vier PNGs sind undurchsichtig, 1280×800 und visuell geprüft; die Liste enthält Beispieldaten. Für andere Dokumentsprachen gibt es weder Aufnahmen noch übersetzte Oberfläche.

## Prüfanleitung

Kein Konto/Anmelden nötig. Mehrere normale HTTP(S)-Tabs in einem Fenster öffnen und nacheinander besuchen. Kurze Betätigung der genannten Kürzel prüfen, dann mindestens 1 Sekunde halten und Auf/Ab, Enter, Esc verwenden. Mit Links Modus wechseln und in Tab-Reihenfolge Titel suchen. Einstellungen über das Symbol öffnen und `0.1.0` prüfen.

## Grundlage

Aktuelle Implementierung und Kandidaten-Chrome-Tests: feste MRU-Reihenfolge, kurze/lange Betätigung, Gruppen/Suche, Einstellungen, iframes und eingeschränkte Tabs. Native IMEs, andere Systeme, älteres Chrome und tatsächliche Englisch-/Rückfallauswahl ungeprüft; siehe [Protokoll](../releases.de.md).

Felder und Bildanforderungen wurden am 9. November 2026 mit offiziellen Dokumenten abgeglichen. Aktuelle Pflichtfelder vor Einreichung prüfen: [Store listing](https://developer.chrome.com/docs/webstore/cws-dashboard-listing), [Supplying Images](https://developer.chrome.com/docs/webstore/images).
