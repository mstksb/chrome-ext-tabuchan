---
lang: de
---

# Datenschutzrichtlinie für tabuchan

[English](privacy-policy.md) | [日本語](privacy-policy.ja.md) | [简体中文](privacy-policy.zh-CN.md) | [繁體中文](privacy-policy.zh-TW.md) | [Português (Brasil)](privacy-policy.pt-BR.md) | [Español](privacy-policy.es.md) | Deutsch

Diese Richtlinie gilt für die tabuchan-Versionen `0.2.0` und `0.2.1`. Sie tritt in Kraft, sobald die erste dieser beiden Versionen im Chrome Web Store veröffentlicht wird. Den Veröffentlichungsstatus finden Sie im [Protokoll](releases.de.md).

## Zweck

tabuchan ermöglicht Tastaturnavigation zu zuletzt verwendeten oder über den Titel gefundenen Tabs im aktuellen Fenster.

## Verarbeitete Informationen

- Von Chrome gelieferte Tab-/Fenster-IDs, Titel, URLs, Favicon-URLs sowie Gruppen-IDs, -Namen und -Farben.
- Tab-Auswahlreihenfolge, feste Durchlaufreihenfolge und Auswahlzustand der Liste.
- In Seiten erkannte Tastendruck-/Loslassereignisse für Tastenkürzel, Listenaktionen und Titelsuchtext.
- Vom Nutzer gewählte Tastenkombinationen, Haltedauer, Verlaufslimit, Einstellung zum Überspringen von Tabs ohne verfügbares Tastenkürzel beim kurzen Drücken und Suchmethode.

Diese Informationen dienen dem Tab-Wechsel, Verlauf und Listen, der Titelsuche, der Anzeige verfügbarer Tastenkürzel und den Nutzereinstellungen.

## Lokale Verarbeitung und Speicherung

Verlauf und Durchlaufzustand liegen im lokalen Chrome-Erweiterungs-Sitzungsspeicher `storage.session`, hauptsächlich als Tab-IDs, Reihenfolge und Auswahlzustand. Tastenkürzel und Verhaltenseinstellungen werden in `storage.local` gespeichert.

Titel, URLs und Gruppeninformationen werden während der Verarbeitung von Chrome abgefragt. Die Liste erscheint in einem Frame der Erweiterung, der in die aktuelle Seite eingebettet ist. Titel und Gruppennamen werden als Text angezeigt. Listeninhalte und Suchtext werden innerhalb der Erweiterung verarbeitet. Suchtext und Tastenzustand werden während der Verarbeitung im Arbeitsspeicher verwendet.

## Netzwerkanfragen für Favicons

Zur Anzeige von Favicons in der Tab-Liste und in Benachrichtigungen für frühere Chrome-Tastenkürzelbefehle kann der Browser Bilder von HTTPS-URLs abrufen, die Chrome bereitstellt. Wenn Chrome eine HTTP-URL für ein Favicon bereitstellt, zeigt die Erweiterung ein Ersatzsymbol an, ohne diese URL abzurufen.

Bildanbieter können die IP-Adresse des Nutzers und übliche Anfragedaten erhalten. Die Erweiterung setzt für Favicon-Anfragen `no-referrer`. Der Umgang mit Cookies und Cache hängt von den Chrome-Einstellungen und -Richtlinien sowie vom Zielserver ab. Für die Aufbewahrung von Zugriffsprotokollen und weitere Verarbeitung gelten die Regeln des jeweiligen Anbieters.

## Aufbewahrung und Löschung

Browserneustart oder Deaktivieren, Neuladen und Aktualisieren der Erweiterung löscht den Sitzungsverlauf. Neuer Verlauf beginnt beim aktuellen Tab. Geschlossene Tabs werden entfernt; ein kleineres Limit entfernt überzählige älteste Einträge.

Tastenkürzel und Einstellungen bleiben auf dem Gerät, bis der Nutzer sie ändert und speichert. Bei Deinstallation löscht Chrome den Erweiterungsspeicher. Vom Browser verwaltete Bild-Caches lassen sich über die Funktionen zum Löschen von Browserdaten verwalten.

Suchtext wird während der geöffneten Liste verwendet und beim Schließen oder Moduswechsel verworfen.

## Umfang der Datennutzung

Die Informationen dienen den beschriebenen Tab-Wechsel-, Listen-, Such- und Einstellungsfunktionen. Anfragen an externe Bildanbieter entstehen durch Favicons. Die Angaben zur Datennutzung im Chrome Web Store müssen diese Verarbeitung widerspiegeln.

## Herausgeber und Kontakt

Herausgeber: `mstksb`. Kontakt: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com).

Die öffentliche Richtlinien-URL steht [hier](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.de.html). Änderungen der Richtlinie sind im Store-Eintrag mit der betroffenen Version und der aktualisierten Datenverarbeitung zu dokumentieren.
