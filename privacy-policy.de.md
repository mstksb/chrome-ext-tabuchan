---
lang: de
---

# Entwurf der Datenschutzrichtlinie für tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | [Português (Brasil)](privacy-policy.pt-BR.md) | [Español](privacy-policy.es.md) | Deutsch

Dieser Entwurf gilt für Version `0.1.0`. Herausgebername, Kontakt sowie Veröffentlichungs-/Gültigkeitsdatum sind noch offen. Siehe das [Protokoll](releases.de.md).

## Zweck

tabuchan ermöglicht Tastaturnavigation zu zuletzt verwendeten oder über den Titel gefundenen Tabs im aktuellen Fenster.

## Verarbeitete Informationen

- Von Chrome gelieferte Tab-/Fenster-IDs, Titel, URLs, Favicon-URLs sowie Gruppen-IDs, -Namen und -Farben.
- Tab-Auswahlreihenfolge, feste Durchlaufreihenfolge und Auswahlzustand der Liste.
- In Seiten erkannte Tastendruck-/Loslassereignisse für Tastenkürzel, Listenaktionen und Titelsuchtext.
- Vom Nutzer festgelegte Tastenkombinationen, Haltedauer, Verlaufslimit und Überspringen beim kurzen Drücken.

Diese Informationen dienen dem Tab-Wechsel, Verlauf und Listen, der Titelsuche, der Anzeige verfügbarer Tastenkürzel und den Nutzereinstellungen.

## Lokale Verarbeitung und Speicherung

Verlauf und Durchlaufzustand liegen im lokalen Chrome-Erweiterungs-Sitzungsspeicher `storage.session`, hauptsächlich als Tab-IDs, Reihenfolge und Auswahlzustand. Tastenkürzel und Verhaltenseinstellungen werden in `storage.local` gespeichert.

Titel, URLs und Gruppeninformationen werden während der Verarbeitung von Chrome abgefragt. Die Liste erscheint in der aktuellen Seite; Titel und Gruppennamen werden als Text dargestellt. Suchtext und Tastenzustand werden während der Verarbeitung im Arbeitsspeicher verwendet.

## Netzwerkanfragen für Favicons

Die Liste kann Favicons über von Chrome gelieferte HTTP(S)-Bild-URLs anzeigen. Dabei kann der Browser Anfragen an den Bildserver senden.

Bildanbieter können die IP-Adresse und übliche Anfragedaten erhalten. Die Erweiterung setzt `no-referrer`. Cookies, Cache und gemischte Inhalte hängen von Chrome-Einstellungen/-Richtlinien und dem Ziel ab. Aufbewahrung von Zugriffsprotokollen und weitere Verarbeitung richten sich nach den Regeln des Anbieters.

## Aufbewahrung und Löschung

Browserneustart oder Deaktivieren, Neuladen und Aktualisieren der Erweiterung löscht den Sitzungsverlauf. Neuer Verlauf beginnt beim aktuellen Tab. Geschlossene Tabs werden entfernt; ein kleineres Limit entfernt überzählige älteste Einträge.

Tastenkürzel und Einstellungen bleiben auf dem Gerät, bis der Nutzer sie ändert und speichert. Bei Deinstallation löscht Chrome den Erweiterungsspeicher. Vom Browser verwaltete Bild-Caches lassen sich über die Funktionen zum Löschen von Browserdaten verwalten.

Suchtext wird während der geöffneten Liste verwendet und beim Schließen oder Moduswechsel verworfen.

## Umfang der Datennutzung

Die Informationen dienen den beschriebenen Tab-Wechsel-, Listen-, Such- und Einstellungsfunktionen. Anfragen an externe Bildanbieter entstehen durch Favicons. Die Angaben zur Datennutzung im Chrome Web Store müssen diese Verarbeitung widerspiegeln.

## Herausgeber und Kontakt

Die öffentliche Richtlinien-URL steht [hier](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.de.html). Herausgeber, Kontaktweg und Gültigkeitsdatum müssen vor Store-Einreichung festgelegt werden. Änderungen müssen im Store-Eintrag mit betroffener Version und aktualisierter Verarbeitung dokumentiert werden.
