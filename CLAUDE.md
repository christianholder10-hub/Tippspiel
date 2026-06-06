# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Expo SDK Version

This project uses **Expo SDK 54** — not SDK 56. The AGENTS.md reference to `docs.expo.dev/versions/v56.0.0` does not apply here. Use the SDK 54 docs at `https://docs.expo.dev/versions/v54.0.0/` instead. When adding new Expo packages, always use `npx expo install <package>` (not plain `npm install`) to get the SDK-54-compatible version.

## Commands

```bash
# Start dev server (shows QR for Expo Go on Android)
npx expo start --clear

# Open in browser
npx expo start --web

# Install a new Expo-compatible package
npx expo install <package-name>

# Save current work to GitHub
git add .
git commit -m "description"
git push
```

Node is managed via nvm. If commands are not found, run:
```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh"
```

## Architecture

### Routing
expo-router with file-based routing. `package.json` sets `"main": "expo-router/entry"`. The `app/` directory is the entire route tree — adding a file there automatically creates a new screen.

### Screen structure
`app/_layout.js` defines the bottom tab navigator. Adding a new tab requires two steps: create `app/<name>.js`, then add an entry to the `TABS` array in `_layout.js`.

### Data layer
All placeholder data lives in `data/`. This is the intended integration point for future APIs:
- `data/matchdays.js` — exports `MATCHDAYS` (10 matchdays × 10 games). Each game has `teamA`, `teamB`, `oddsA`, `oddsB`, `date`, `time`. **Replace this with the real WM 2026 schedule + odds API.**
- `data/players.js` — exports `PLAYERS` (flat array with `isMe: true` on the current user). **Replace with multiplayer backend.**

### State management
Tip state (`{ [dayIndex]: { [gameId]: 'A' | 'B' } }`) lives locally in `app/index.js` with `useState`. It persists between tab switches because expo-router keeps tab screens mounted. There is no global store or AsyncStorage yet — adding persistence is the next step when saving tips across app restarts becomes necessary.

### Design system
All colors are defined as a local `C` constant at the top of each screen file (not a shared theme file). The palette is:
- Background: `#0B0F1A`, Surface: `#101828`, Card: `#141C2E`
- Accent (selected/positive): `#22C55E` (green)
- Text: `#F8FAFC`, Secondary: `#94A3B8`, Muted: `#3F5070`
- Border: `#1A2540`

When adding new screens, copy this `C` object directly — do not abstract it until a shared theme file is actually needed.

## Key product rules

- **Tipping mechanic:** users pick the *winner/advancer* of a match (team A or B), not a score. Points = the odds of the chosen team if correct.
- **Odds are placeholders** (`2.0` for both teams everywhere). The architecture is ready for a real odds API — just replace the values in `data/matchdays.js`.
- **Max 7 screens.** The app is intentionally minimal. Do not add screens without removing others.
- **Retention hooks:** every single tip must give immediate positive feedback (toast). Completing all 10 tips in a matchday triggers the success modal in `app/index.js`.
