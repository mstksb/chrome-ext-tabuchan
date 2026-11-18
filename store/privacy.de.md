---
lang: de
---

# Entwurf der Datenschutzangaben

[English](privacy.md) | [日本語](privacy.ja.md) | [简体中文](privacy.zh-CN.md) | [繁體中文](privacy.zh-TW.md) | [Português (Brasil)](privacy.pt-BR.md) | [Español](privacy.es.md) | Deutsch

Dieser Entwurf beruht auf dem Code von tabuchan `0.2.1`. Offene Punkte sowie Prüf- und Einreichungsstatus finden Sie im [Protokoll](../releases.de.md).

## Einziger Zweck

Tastaturnavigation zu zuletzt verwendeten oder nach Titel gefundenen Tabs im aktuellen Fenster.

## Berechtigungsbegründungen

| Berechtigung | Dashboard-Entwurf |
| --- | --- |
| `tabs` | Tabs je Fenster auflisten und IDs, Titel, URLs/Favicons für Verlauf/Listen, Verfügbarkeit der Kürzel und Aktivierung gewählter Tabs abfragen. |
| `tabGroups` | Gruppennamen/-farben anzeigen und Hierarchie in der Tab-Reihenfolge bewahren. |
| `storage` | Kürzel/Einstellungen lokal speichern und Verlauf/Durchlaufzustand während der Browsersitzung halten. |
| `scripting` | Eingabeerkennung und Liste in offene HTTP(S)-Seiten einfügen, auch nach Installation/Aktualisierung. |
| `http://*/*` und `https://*/*` | Drücken und Loslassen von Tastenkürzeln in HTTP(S)-Seiten und ihren iframes erkennen und die Liste in einem Erweiterungsframe anzeigen, der in die übergeordnete Seite eingebettet ist. So lassen sich Tastenkürzel auf gewöhnlichen Webseiten starten. |

## Erhebung, Nutzung und Speicherung

| Daten | Zweck | Speicher / Aufbewahrung |
| --- | --- | --- |
| Tab-/Fenster-IDs, letzte Reihenfolge, Durchlaufzustand | Navigation und Konsistenz | `storage.session.mruState`, während der Sitzung |
| Titel, URLs, Favicons, Gruppen-IDs/-Namen/-Farben | Liste, Suche, Verfügbarkeit | Chrome-APIs; Arbeitsspeicher/Listenstatus |
| Tastenereignisse und erfasste Kombinationen | Kürzel, Halten/Liste, Konfiguration | Zustand im Speicher; Kombinationen in `storage.local.mruShortcuts` |
| Haltedauer, Verlaufslimit, Überspringen von Tabs ohne verfügbares Tastenkürzel beim kurzen Drücken und Suchmethode | Gewähltes Verhalten | `storage.local.mruSettings` |
| Suchtext | Filtern | Bei geöffneter Liste im Speicher; bei Schließen/Moduswechsel verwerfen |

Titel und Gruppennamen erscheinen als Text im Frame der Erweiterung. Das Suchfeld desselben Frames verarbeitet den eingegebenen Text. Listeninhalte und Suchtext werden innerhalb der Erweiterung verarbeitet. Eingabeereignisse dienen Tastenkürzeln, Listenaktionen und der Erfassung von Tastenkürzeln.

## Externe Anfragen und Dritte

Für Favicons in der Tab-Liste und in Benachrichtigungen für frühere Chrome-Tastenkürzelbefehle kann der Browser Anfragen an die Server der von Chrome bereitgestellten HTTPS-URLs senden. Wenn Chrome eine HTTP-URL für ein Favicon bereitstellt, zeigt die Erweiterung ein Ersatzsymbol an, ohne diese URL abzurufen. HTTPS-Favicon-Anfragen verwenden `referrerPolicy="no-referrer"`.

Bildanbieter können die IP-Adresse und übliche Browser-Anfragedaten erhalten. Der Umgang mit Cookies und Cache hängt von den Chrome-Einstellungen und -Richtlinien sowie vom Zielserver ab. Anbieter speichern Zugriffsprotokolle nach ihren eigenen Regeln. Die Angaben zur Datennutzung sind vor der Einreichung zu prüfen.

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
| Richtlinien-URL | Prüfen Sie, ob die aktualisierte [Datenschutzrichtlinie](../privacy-policy.de.md) auf GitHub Pages ohne Anmeldung per HTTPS erreichbar ist, bevor Sie ihre URL im Dashboard eintragen. |

Auch ausschließlich lokale Verarbeitung offenlegen. Kategorien/Bestätigungen anhand aktueller Definitionen abschließen: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

## Aufbewahrung und Löschung

Neustart oder Deaktivieren/Neuladen/Aktualisieren löscht Sitzungsverlauf. Geschlossene Tabs und überzählige Einträge nach Limitverringerung werden entfernt. Einstellungen bleiben bis Änderung; Deinstallation löscht Erweiterungsspeicher. Suchtext wird bei Schließen/Moduswechsel verworfen. Cache über Browserdaten verwalten. Siehe [Datenschutzrichtlinie](../privacy-policy.de.md).

## Bestätigung durch Herausgeber

Herausgeber: `mstksb`. Kontakt: [mstksb.goog@gmail.com](mailto:mstksb.goog@gmail.com). Diese Richtlinie gilt für die tabuchan-Versionen `0.2.0` und `0.2.1`. Sie tritt in Kraft, sobald die erste dieser beiden Versionen im Chrome Web Store veröffentlicht wird.

Die [bestehende URL](https://mstksb.github.io/chrome-ext-tabuchan/privacy-policy.html) der Richtlinie wurde per HTTPS ohne Anmeldung geprüft. Trader-/Non-Trader-Status, Kontoprüfung und Verteilungsziele sind weiterhin offen. Den aktuellen Stand finden Sie im [Protokoll](../releases.de.md).
