# Eldra — restored Expo version

Expo / React Native is the active runtime again. Unity is not required to run this app.

## Run

After cloning, run `npm ci`, then `npm start` for Expo Go or `npm run web` for the browser.

## Preserved changes

- Current illustrated main, world, hero, trait and past menus.
- Main-menu spacing and preloaded A/B buttons: B appears only while pressed.
- Hero selection uses a purple outline, without the extra tick.
- World → Hero → Trait → Past → Summary → Gameplay. Selection requires Continue.
- Each artwork screen is revealed only after its images and button states load.
- Proportional portrait fitting; the entire gameplay card stays inside the available screen. No artwork overscroll.
- Saved world, hero, trait and past selections accompany the existing Expo story/save state.
- Gameplay uses the 24 individual original layers, not a flattened screenshot.

## Assets

`assets/ported/menu` contains the latest menu art. `assets/ported/layers` contains:

| Set | Layers | Stable IDs |
| --- | ---: | --- |
| gameplay | 24 | ELD-GP-001–024 |
| splitPath | 23 | ELD-ENC-SP-001–023 |
| banditsOpenField | 26 | ELD-ENC-BOF-001–026 |
| forestTavern | 25 | ELD-ENC-FT-001–025 |

All use the original 1440×3120 canvas coordinates. Each set includes its manifest, alpha/opacity and placement metadata. `src/game/layerAssets.ts` registers the images for Metro.

The three new encounter sets are imported and available for allocation; no new story encounters were invented or assigned to them. The original Huntsman gameplay artwork remains the active visual template. The local Unity project and source Procreate documents are untouched.

## Checks

Use `npx tsc --noEmit`, `npm run lint`, and `npx expo export --platform web` to check a clone.
