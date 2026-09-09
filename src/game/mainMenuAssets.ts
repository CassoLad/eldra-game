export const MAIN_MENU_CANVAS = { width: 1440, height: 3120 } as const;

export type MainMenuLayer = {
  id: string;
  name: string;
  category: 'background' | 'button' | 'character' | 'environment' | 'frame' | 'source-variant';
  tags: readonly string[];
  stackIndex: number;
  visible: boolean;
  opacity: number;
  source: number;
  bounds: { x: number; y: number; width: number; height: number };
};

// Procreate lists the topmost layer first. These stable IDs and tags mirror
// AssetManifest.json so individual pieces can be found and reused later.
export const MAIN_MENU_LAYERS: readonly MainMenuLayer[] = [
  { id: 'ELD-MAIN-001', name: 'outer-frame-and-header', category: 'frame', tags: ['frame', 'header', 'foliage', 'mountains'], stackIndex: 0, visible: true, opacity: 0.8214842081069946, source: require('../../assets/ported/layers/mainMenu/layer-01.png'), bounds: { x: 1, y: 0, width: 1439, height: 3119 } },
  { id: 'ELD-MAIN-002', name: 'alternate-outer-frame', category: 'source-variant', tags: ['hidden', 'alternate', 'frame'], stackIndex: 1, visible: false, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-02.png'), bounds: { x: 0, y: 0, width: 1440, height: 3120 } },
  { id: 'ELD-MAIN-003', name: 'alternate-header-and-footer', category: 'source-variant', tags: ['hidden', 'alternate', 'header', 'mountains'], stackIndex: 2, visible: false, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-03.png'), bounds: { x: 0, y: 0, width: 1335, height: 3120 } },
  { id: 'ELD-MAIN-004', name: 'new-game-button', category: 'button', tags: ['button', 'new-game', 'sword', 'pink'], stackIndex: 3, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-04.png'), bounds: { x: 293, y: 2169, width: 870, height: 266 } },
  { id: 'ELD-MAIN-005', name: 'settings-button', category: 'button', tags: ['button', 'settings', 'gear', 'gold'], stackIndex: 4, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-05.png'), bounds: { x: 292, y: 2443, width: 860, height: 209 } },
  { id: 'ELD-MAIN-006', name: 'continue-journey-button', category: 'button', tags: ['button', 'continue', 'journey', 'gold'], stackIndex: 5, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-06.png'), bounds: { x: 305, y: 1674, width: 828, height: 201 } },
  { id: 'ELD-MAIN-007', name: 'load-game-button', category: 'button', tags: ['button', 'load', 'book', 'green'], stackIndex: 6, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-07.png'), bounds: { x: 294, y: 1954, width: 856, height: 213 } },
  { id: 'ELD-MAIN-008', name: 'menu-content-panel', category: 'frame', tags: ['panel', 'parchment', 'divider'], stackIndex: 7, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-08.png'), bounds: { x: 0, y: 284, width: 1440, height: 2836 } },
  { id: 'ELD-MAIN-009', name: 'alternate-hero', category: 'source-variant', tags: ['hidden', 'alternate', 'hero', 'character'], stackIndex: 8, visible: false, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-09.png'), bounds: { x: 443, y: 692, width: 653, height: 1126 } },
  { id: 'ELD-MAIN-010', name: 'hero', category: 'character', tags: ['hero', 'character', 'traveller'], stackIndex: 9, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-10.png'), bounds: { x: 576, y: 897, width: 290, height: 572 } },
  { id: 'ELD-MAIN-011', name: 'foreground-forest-frame', category: 'environment', tags: ['forest', 'foreground', 'trees', 'flowers'], stackIndex: 10, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-11.png'), bounds: { x: 28, y: 347, width: 1412, height: 1330 } },
  { id: 'ELD-MAIN-012', name: 'path-and-meadow', category: 'environment', tags: ['path', 'meadow', 'ground'], stackIndex: 11, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-12.png'), bounds: { x: 249, y: 270, width: 1033, height: 1840 } },
  { id: 'ELD-MAIN-013', name: 'castle-and-mountains', category: 'environment', tags: ['castle', 'mountains', 'background'], stackIndex: 12, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-13.png'), bounds: { x: 100, y: 383, width: 1114, height: 891 } },
  { id: 'ELD-MAIN-014', name: 'clouds-and-birds', category: 'environment', tags: ['clouds', 'birds', 'sky-detail'], stackIndex: 13, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-14.png'), bounds: { x: 234, y: 462, width: 734, height: 464 } },
  { id: 'ELD-MAIN-015', name: 'blue-sky', category: 'environment', tags: ['sky', 'texture', 'blue'], stackIndex: 14, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-15.png'), bounds: { x: 66, y: 353, width: 1304, height: 1437 } },
  { id: 'ELD-MAIN-016', name: 'parchment-background', category: 'background', tags: ['background', 'parchment', 'texture'], stackIndex: 15, visible: true, opacity: 1, source: require('../../assets/ported/layers/mainMenu/layer-16.png'), bounds: { x: 0, y: 0, width: 1440, height: 3120 } },
] as const;

export const MAIN_MENU_BUTTONS = {
  continue: MAIN_MENU_LAYERS[5],
  load: MAIN_MENU_LAYERS[6],
  newGame: MAIN_MENU_LAYERS[3],
  settings: MAIN_MENU_LAYERS[4],
} as const;
