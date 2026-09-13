export const MAIN_MENU_12_CANVAS = { width: 768, height: 1664 } as const;

export const MAIN_MENU_12_ARTWORK = {
  id: 'ELD-MM12-001',
  displayName: 'Main Menu 1.2 — supplied composite layout',
  source: require('../../assets/ported/layers/mainMenu12/ELD-MM12-composite-highres.png'),
} as const;

export const MAIN_MENU_12_BUTTONS = {
  continue: { id: 'ELD-MM12-BTN-01', label: 'Continue Journey', route: '/game', bounds: { x: 150, y: 562, width: 480, height: 122 } },
  newGame: { id: 'ELD-MM12-BTN-02', label: 'New Game', route: '/new-game', bounds: { x: 150, y: 699, width: 480, height: 122 } },
  settings: { id: 'ELD-MM12-BTN-03', label: 'Settings', route: '/settings', bounds: { x: 150, y: 836, width: 480, height: 122 } },
  credits: { id: 'ELD-MM12-BTN-04', label: 'Credits', route: '/credits', bounds: { x: 150, y: 973, width: 480, height: 122 } },
} as const;
