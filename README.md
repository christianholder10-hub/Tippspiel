# Tippspiel 🏆

Eine minimalistische Fußball-Tippspiel-App für die WM 2026, gebaut mit Expo & React Native.

## Konzept

Anders als klassische Tippspiele (z.B. Kicktipp) tippt man hier nicht auf ein genaues Ergebnis, sondern auf den **Weiterkommer** eines Spiels. Die Punkte richten sich nach den **Wettquoten** des getippten Teams — wer auf den Außenseiter tippt und richtig liegt, bekommt mehr Punkte.

> Wettquoten-API-Anbindung ist geplant. Aktuell laufen Platzhalter-Quoten (2.0).

## Features

- **Spieltag** — 10 Spiele pro Spieltag in einem Durchgang tippen. Quoten und Anstoßzeiten je Spiel sichtbar. Positives Feedback nach jedem Tipp und nach Abschluss eines Spieltags.
- **Tabelle** — Rangliste aller Mitspieler mit Punktestand. Mehrspieler-Funktion folgt.
- **Turnierbaum** — Wird nach Abschluss der Gruppenphase freigeschaltet.
- **Profil** — Persönliche Stats: Punkte, Rang, Trefferquote, Spieltaghistorie.

## Screens

| Screen | Datei |
|--------|-------|
| Spieltag (Tipp-Loop) | `app/index.js` |
| Tabelle | `app/tabelle.js` |
| Turnierbaum | `app/turnierbaum.js` |
| Profil | `app/profil.js` |

## Tech Stack

- [Expo](https://expo.dev) SDK 54
- [React Native](https://reactnative.dev) 0.81.5
- [expo-router](https://expo.github.io/router) v6 (dateibasiertes Routing)

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# App starten
npx expo start

# Im Browser öffnen
npx expo start --web
```

## Projektstruktur

```
Tippspiel/
├── app/
│   ├── _layout.js       # Tab-Navigation
│   ├── index.js         # Spieltag-Screen
│   ├── tabelle.js       # Punktetabelle
│   ├── turnierbaum.js   # Turnierbaum
│   └── profil.js        # Profil
├── data/
│   ├── matchdays.js     # Spieltag-Daten (Platzhalter)
│   └── players.js       # Spieler-Daten (Platzhalter)
└── app.json
```

## Roadmap

- [ ] Echte WM 2026 Spielpläne einbinden
- [ ] Wettquoten-API anbinden
- [ ] Mehrspieler / Gruppen-Feature
- [ ] Turnierbaum mit echten Ergebnissen
- [ ] Push-Benachrichtigungen vor Tipp-Deadline
