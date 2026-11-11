---
lang: de
---

# Veröffentlichungsprotokoll

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | Deutsch

## GitHub Pages

Am 11. November 2026 wurden bestehende README und öffentliche Dokumente über GitHub Pages aus dem Stamm von `main` veröffentlicht. Die README ist die Startseite; Jekyll wandelt relative Markdown-Links in HTML-URLs um. Bearbeitet wird weiterhin Markdown. `src/`, `options.html` und `manifest.json` sind vom erzeugten Webauftritt ausgeschlossen.

Erster Build und erste Bereitstellung von [Anleitung](https://mstksb.github.io/chrome-ext-tabuchan/) und [Datenschutzentwurf](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) waren erfolgreich. Beide Seiten wurden per HTTPS ohne Anmeldung und im Browser geprüft. Herausgeber, Kontakt und Gültigkeit sind offen; die Richtlinie ist noch keine abgeschlossene Store-Fassung. Dieser historische Nachweis bestätigt keine Bereitstellung der neuen Übersetzungen.

## 0.1.0

Öffentlicher Kandidat mit kurzem Drücken zum Wechsel, langem Drücken für die Liste, Modi für letzte Verwendung/Tab-Reihenfolge, Gruppen, Titelsuche und Tastenkürzel-/Verhaltenseinstellungen.

Einstellungen und Liste unterstützen Japanisch/Englisch; andere Chrome-Anzeigesprachen wählen Englisch. Die Suche verwendet unabhängig davon NFC und Teilzeichenfolgen ohne Groß-/Kleinschreibung. Dokumentübersetzungen erweitern die Oberflächensprachen nicht.

| Punkt | Angaben |
| --- | --- |
| Version | `0.1.0` für SemVer und Manifest |
| ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), 20 Laufzeitdateien, Manifest im Stamm |
| SHA-256 | `ffa1b545cf7974f4a16806d73bad0d95d050118caed7b898b2380b6b3f87c65b` |
| Prüfsumme | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Voraussetzungen | Chrome mit Manifest V3; angegebenes Minimum Chrome 102 |
| Store | Upload/Annahme dieses internationalisierten ZIPs, Prüfung/Veröffentlichung und Eintrags-ID/-URL ungeprüft |

## Geprüfter Umfang

Am 10. November 2026 wurden auf macOS mit Chrome `156.0.8078.80` japanische Oberfläche und Hauptfunktionen geprüft: kurze/lange Betätigung, Auswahl/Abbruch, Reihenfolge/Gruppen, Speichern, iframes, eingeschränkte Tabs, Suche und Weiterleitung während IME-Komposition. Japanische Oberfläche/NFC-Suche wurden auch aus separat entpacktem ZIP geprüft.

Am 11. November wurden mit den Laufzeitdateien dieses Repositorys 17 Funktionsgruppen auf macOS, Chrome `157.0.8103.40`, Sprache `ja`, geprüft, darunter die Anzeige `0.1.0` in Einstellungen. Betrieb nach Neuladen blieb ungeprüft.

Konfigurations-/automatische Prüfungen umfassen japanische/englische Schlüssel, Manifestverweise, vorgefertigte/kombinierende NFC-Zeichen und mehrsprachige/Emoji-Teilzeichenfolgen. Das englische Layout wurde mit gleichem Code und englischem Wörterbuch in einer Aufnahme-Konfiguration geprüft.

Der [Store-Entwurf](store/listing.de.md#bildschirmaufnahmen) enthält japanische/englische Einstellungen und Listen: undurchsichtige PNGs in 1280×800 mit Beispiel-Tabs.

## Ungeprüft oder offen

- Windows, Linux, ältere Chrome-Versionen und betriebssystemeigene IMEs der einzelnen Sprachen.
- Ursprüngliches zweisprachiges Paket in englischer Umgebung und englischer Rückfall bei nicht unterstützten Sprachen.
- Betrieb nach Neuladen im normalen Chrome.
- Herausgeber/Kontakt, Lizenz, Sichtbarkeit und Zielländer.
- Richtliniendaten/Gültigkeit und regelkonforme Verarbeitung einschließlich HTTP-Favicon-Anfragen.
- Gespeicherte Store-/Datenschutzangaben im Dashboard und Prüfungs-/Veröffentlichungsstatus.

Vor Store-Einreichung klären. Die Entwürfe sind Vorbereitungsmaterial und kein Nachweis erfüllter Einreichungsvoraussetzungen.
