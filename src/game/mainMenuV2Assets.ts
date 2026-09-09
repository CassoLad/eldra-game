import type { ArtworkLayer } from './layerAssets';

export const MAIN_MENU_V2_CANVAS = { width: 863, height: 1822 } as const;

export const MAIN_MENU_V2_FRAME = {
  id: 'ELD-MAIN-V2-001', displayName: 'Eldra Torn-Parchment Main Menu Frame',
  tags: ['main-menu', 'frame', 'header', 'transparent-window'],
  source: require('../../assets/ported/menu-v2/ELD-MAIN-V2-001_frame.png'),
} as const;

export const MAIN_MENU_V2_BUTTONS = {
  continue: { id: 'ELD-MAIN-V2-002', displayName: 'Continue Button', tags: ['button', 'continue', 'book', 'purple'], source: require('../../assets/ported/menu-v2/ELD-MAIN-V2-002_continue.png'), bounds: { x: 132, y: 1100, width: 600, height: 200 } },
  newGame: { id: 'ELD-MAIN-V2-003', displayName: 'New Game Button', tags: ['button', 'new-game', 'play', 'green'], source: require('../../assets/ported/menu-v2/ELD-MAIN-V2-003_new_game.png'), bounds: { x: 132, y: 1310, width: 600, height: 200 } },
  load: { id: 'ELD-MAIN-V2-004', displayName: 'Load Button', tags: ['button', 'load', 'folder', 'gold'], source: require('../../assets/ported/menu-v2/ELD-MAIN-V2-004_load.png'), bounds: { x: 132, y: 1520, width: 600, height: 200 } },
} as const;

// Reuses the labelled Forest Tavern layers; originals remain in their encounter set.
export const MAIN_MENU_V2_TAVERN_LAYERS: readonly ArtworkLayer[] = [
  {...{"id":"ELD-MAIN-V2-TAVERN-001","displayName":"Tavern Scene Base","hidden":false,"opacity":1,"order":23,"rect":{"x":29,"y":479,"width":1385,"height":1070}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-049_layer_26_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-002","displayName":"Forest Canopy","hidden":false,"opacity":1,"order":22,"rect":{"x":55,"y":489,"width":798,"height":484}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-048_layer_29_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-003","displayName":"Forest Environment","hidden":false,"opacity":1,"order":21,"rect":{"x":15,"y":571,"width":1374,"height":898}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-047_inserted_image_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-004","displayName":"Tavern Building","hidden":false,"opacity":1,"order":20,"rect":{"x":440,"y":597,"width":962,"height":660}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-046_inserted_image_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-005","displayName":"Tavern Ground","hidden":false,"opacity":1,"order":19,"rect":{"x":11,"y":990,"width":1420,"height":980}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-045_layer_27_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-006","displayName":"Tavern Foreground Frame","hidden":false,"opacity":1,"order":18,"rect":{"x":17,"y":474,"width":1412,"height":1165}},source:require("../../assets/ported/layers/forestTavern/Derived/Consistency/ELD-ENC-FT-044_layer_25_outlined.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-007","displayName":"Huntsman Separation Shadow","hidden":false,"opacity":0.22,"order":1,"rect":{"x":484,"y":950,"width":326,"height":547}},source:require("../../assets/ported/layers/forestTavern/Characters/Huntsman/ELD-ENC-FT-027_huntsman_separation_shadow.png")},
  {...{"id":"ELD-MAIN-V2-TAVERN-008","displayName":"Huntsman Focal Outline","hidden":false,"opacity":1,"order":0,"rect":{"x":478,"y":946,"width":322,"height":539}},source:require("../../assets/ported/layers/forestTavern/Characters/Huntsman/ELD-ENC-FT-026_huntsman_focal_outline.png")},
];
