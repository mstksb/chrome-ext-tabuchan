---
lang: de
---

# Veröffentlichungsprotokoll

[English](releases.md) | [日本語](releases.ja.md) | [简体中文](releases.zh-CN.md) | [繁體中文](releases.zh-TW.md) | [Português (Brasil)](releases.pt-BR.md) | [Español](releases.es.md) | Deutsch

## GitHub Pages

Am 11. November 2026 wurden bestehende README und öffentliche Dokumente über GitHub Pages aus dem Stamm von `main` veröffentlicht. Die README ist die Startseite; Jekyll wandelt relative Markdown-Links in HTML-URLs um. Bearbeitet wird weiterhin Markdown. `src/`, `options.html` und `manifest.json` sind vom erzeugten Webauftritt ausgeschlossen.

Erster Build und erste Bereitstellung von [Anleitung](https://mstksb.github.io/chrome-ext-tabuchan/) und [Datenschutzentwurf](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) waren erfolgreich. Beide Seiten wurden per HTTPS ohne Anmeldung und im Browser geprüft. Herausgeber, Kontakt und Gültigkeit sind offen; die Richtlinie ist noch keine abgeschlossene Store-Fassung. Dieser historische Nachweis bestätigt keine Bereitstellung der neuen Übersetzungen.

Der obige Nachweis betrifft frühere Bereitstellungen. Die Bereitstellung des Updates vom 18. November 2026 ist noch ungeprüft.

## 0.1.0

Dieser Kandidat aktualisiert die Erkennung und Darstellung eingeschränkter Tabs, verkürzt die Mindest- und Standard-Haltedauer und ergänzt Teil- und Präfixsuche mit mehreren Begriffen. Außerdem behebt er Fehler beim Tabwechsel und in den Einstellungen.

Einstellungen und Liste sind bei japanischer Chrome-Anzeigesprache japanisch, sonst englisch. Suchbegriffe werden durch Leerzeichen getrennt. Die Teilsuche (Standard) findet Titel, die alle Begriffe in beliebiger Reihenfolge enthalten. Bei der Präfixsuche muss der Titel mit dem ersten Begriff beginnen und die übrigen Begriffe in der eingegebenen Reihenfolge enthalten. Zeichen zwischen den Begriffen sind erlaubt. Beide Modi verwenden Unicode-NFC-Normalisierung und ignorieren Groß- und Kleinschreibung.

| Punkt | Angaben |
| --- | --- |
| Version | Dieses Paket verwendet die Version `0.1.0`. Die Version für die Einreichung richtet sich nach dem Uploadverlauf im Dashboard. |
| ZIP | [tabuchan-0.1.0.zip](dist/tabuchan-0.1.0.zip), 29 Laufzeitdateien, Manifest im Stamm |
| SHA-256 | `25a07b0f94b01a9bc9d9ea5ce05d9e258b584a7560ace136fa10716a1e6d9982` |
| Prüfsumme | [tabuchan-0.1.0.zip.sha256](dist/tabuchan-0.1.0.zip.sha256) |
| Voraussetzungen | Chrome mit Manifest V3; angegebenes Minimum Chrome 102 |
| Store | Paket, ID und URL des Store-Eintrags sowie Prüfungs- und Veröffentlichungsstatus im Dashboard sind noch zu prüfen. |

## Prüfung des Kandidaten vom 18. November 2026

Der Kandidat bestand 21 End-to-End-Testgruppen in Chrome for Testing Stable `158.0.8127.36` (Linux arm64). Drei weitere Gruppen bestätigten die japanische und englische Oberfläche, die englische Oberfläche bei französischer Chrome-Sprache sowie die Unicode-Titelsuche. Alle 24 Gruppen bestanden auch mit der aus dem Distributions-ZIP geladenen Erweiterung. Die in den Einstellungen angezeigte Version entsprach der Angabe im Manifest des ZIPs.

Der [Store-Entwurf](store/listing.de.md#bildschirmaufnahmen) enthält japanische/englische Einstellungen und Listen: undurchsichtige PNGs in 1280×800 mit Beispiel-Tabs.

## Prüfung des früheren Kandidaten

Am 10. November 2026 wurden auf macOS mit Chrome `156.0.8078.80` japanische Oberfläche und Hauptfunktionen geprüft: kurze/lange Betätigung, Auswahl/Abbruch, Reihenfolge/Gruppen, Speichern, iframes, eingeschränkte Tabs, Suche und Weiterleitung während IME-Komposition. Japanische Oberfläche/NFC-Suche wurden auch aus separat entpacktem ZIP geprüft.

Am 11. November wurden mit den Laufzeitdateien dieses Repositorys 17 Funktionsgruppen auf macOS, Chrome `157.0.8103.40`, Sprache `ja`, geprüft, darunter die Anzeige `0.1.0` in Einstellungen. Betrieb nach Neuladen blieb ungeprüft.

Konfigurations-/automatische Prüfungen umfassen japanische/englische Schlüssel, Manifestverweise, vorgefertigte/kombinierende NFC-Zeichen und mehrsprachige/Emoji-Teilzeichenfolgen. Das englische Layout wurde mit gleichem Code und englischem Wörterbuch in einer Aufnahme-Konfiguration geprüft.

## Ungeprüft oder offen

- Windows, ältere Chrome-Versionen und systemeigene IMEs.
- Betrieb nach Neuladen im normalen Chrome.
- Herausgeber/Kontakt, Lizenz, Sichtbarkeit und Zielländer.
- Richtliniendaten/Gültigkeit und regelkonforme Verarbeitung einschließlich HTTP-Favicon-Anfragen.
- Gespeicherte Store-/Datenschutzangaben im Dashboard und Prüfungs-/Veröffentlichungsstatus.

Vor Store-Einreichung klären. Die Entwürfe sind Vorbereitungsmaterial und kein Nachweis erfüllter Einreichungsvoraussetzungen.
