---
lang: de
---

# Entwurf der Datenschutzangaben

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | Deutsch

Für den öffentlichen Kandidaten `0.1.0` nach aktuellem Code. Herausgeberprüfung, Rechtsstatus und Kontakt sind vor Veröffentlichung festzulegen. Offene Punkte und Status: [Protokoll](../releases.de.md).

## Einziger Zweck

Tastaturnavigation zu zuletzt verwendeten oder nach Titel gefundenen Tabs im aktuellen Fenster.

## Berechtigungsbegründungen

| Berechtigung | Dashboard-Entwurf |
| --- | --- |
| `tabs` | Tabs je Fenster auflisten und IDs, Titel, URLs/Favicons für Verlauf/Listen, Verfügbarkeit der Kürzel und Aktivierung gewählter Tabs abfragen. |
| `tabGroups` | Gruppennamen/-farben anzeigen und Hierarchie in der Tab-Reihenfolge bewahren. |
| `storage` | Kürzel/Einstellungen lokal speichern und Verlauf/Durchlaufzustand während der Browsersitzung halten. |
| `scripting` | Eingabeerkennung und Liste in offene HTTP(S)-Seiten einfügen, auch nach Installation/Aktualisierung. |
| `http://*/*` und `https://*/*` | Tastendruck/Loslassen in HTTP(S)-Seiten und iframes erkennen, Liste im obersten Frame anzeigen und Start von beliebigen normalen Seiten ermöglichen. |

## Erhebung, Nutzung und Speicherung

| Daten | Zweck | Speicher / Aufbewahrung |
| --- | --- | --- |
| Tab-/Fenster-IDs, letzte Reihenfolge, Durchlaufzustand | Navigation und Konsistenz | `storage.session.mruState`, während der Sitzung |
| Titel, URLs, Favicons, Gruppen-IDs/-Namen/-Farben | Liste, Suche, Verfügbarkeit | Chrome-APIs; Arbeitsspeicher/Listenstatus |
| Tastenereignisse und erfasste Kombinationen | Kürzel, Halten/Liste, Konfiguration | Zustand im Speicher; Kombinationen in `storage.local.mruShortcuts` |
| Haltedauer, Limit, Überspringen | Gewähltes Verhalten | `storage.local.mruSettings` |
| Suchtext | Filtern | Bei geöffneter Liste im Speicher; bei Schließen/Moduswechsel verwerfen |

Titel und Gruppen erscheinen als Text in der eingefügten Liste. Deren Eingabefeld verarbeitet die Suche. Ereignisse dienen Kürzeln, Listenaktionen und Erfassung der Kombinationen.

## Externe Anfragen und Dritte

HTTP(S)-Favicon-URLs können Browseranfragen an den von Chrome genannten Bildserver auslösen. Der Code setzt `referrerPolicy="no-referrer"`.

Anbieter können IP-Adresse und übliche Anfragedaten erhalten. Cookies, Cache und gemischte Inhalte hängen von Chrome und Ziel ab; Anbieter regeln eigene Protokolle. HTTP-Bilder und sichere Datenverarbeitung müssen vor Einreichung geprüft werden.

Ausführbarer Code verweist auf enthaltenes JavaScript; Favicons sind Bilder. Die bestehende Prüfung fand kein Laden/Ausführen externen JavaScripts oder WASMs und keine dynamische Auswertung.

## Dashboard-Felder zur Datennutzung

| Feld | Entwurf / Grundlage |
| --- | --- |
| Web history | Lokal verarbeitete Tab-URLs und Reihenfolge offenlegen |
| Website content | Titel, Favicons und eingegebenen Suchtext offenlegen |
| User activity | Auswahl, Tasten und Listenaktionen; Umfang anhand aktueller Definition festlegen |
| Andere Typen | Herausgeber gleicht aktuelle Definitionen mit Implementierung ab |
| Remote code | Entwurfsantwort „No, I am not using remote code.“ nach Codeprüfung |
| Limited Use | Herausgeber prüft und bestätigt Zwecke/Nutzung |
| Richtlinien-URL | [Entwurf](../privacy-policy.de.md) mit Herausgeber/Kontakt per HTTPS ohne Anmeldung veröffentlichen |

Auch ausschließlich lokale Verarbeitung offenlegen. Kategorien/Bestätigungen anhand aktueller Definitionen abschließen: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Aufbewahrung und Löschung

Neustart oder Deaktivieren/Neuladen/Aktualisieren löscht Sitzungsverlauf. Geschlossene Tabs und überzählige Einträge nach Limitverringerung werden entfernt. Einstellungen bleiben bis Änderung; Deinstallation löscht Erweiterungsspeicher. Suchtext wird bei Schließen/Moduswechsel verworfen. Cache über Browserdaten verwalten. Siehe [Richtlinie](../privacy-policy.de.md).

## Bestätigung durch Herausgeber

Die [bestehende URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) wurde ohne Anmeldung geprüft; neue Übersetzungen sind noch nicht als bereitgestellt bestätigt. Herausgeberdaten, Kontakt, Gültigkeit, Trader-/Non-Trader-Status, Kontoprüfung und Verteilungsziele sind offen. Vor Einreichung abschließen und im [Protokoll](../releases.de.md) festhalten.
