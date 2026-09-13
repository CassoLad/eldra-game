import type { ArtworkLayer } from './layerAssets';

export const MAIN_MENU_11_CANVAS = { width: 1440, height: 3120 } as const;

export const MAIN_MENU_11_LAYERS: ArtworkLayer[] = [
  {...{"id":"ELD-MM11-001","displayName":"Eldrane Title","hidden":false,"opacity":0.8478734493255615,"order":0,"rect":{"x":299,"y":46,"width":813,"height":406}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-001_inserted_image.png")},
  {...{"id":"ELD-MM11-002","displayName":"Leafy Outer Frame","hidden":false,"opacity":0.8214842081069946,"order":1,"rect":{"x":1,"y":0,"width":1439,"height":3119}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-002_layer_17.png")},
  {...{"id":"ELD-MM11-009","displayName":"Torn Parchment Menu Panel","hidden":false,"opacity":1,"order":8,"rect":{"x":0,"y":284,"width":1440,"height":2836}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-009_layer_7.png")},
  {...{"id":"ELD-MM11-012","displayName":"Forest Paper-Cut Foreground","hidden":false,"opacity":1,"order":11,"rect":{"x":28,"y":347,"width":1412,"height":1330}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-012_layer_10.png")},
  {...{"id":"ELD-MM11-013","displayName":"Road to Castle","hidden":false,"opacity":1,"order":12,"rect":{"x":249,"y":270,"width":1033,"height":1840}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-013_layer_4.png")},
  {...{"id":"ELD-MM11-014","displayName":"Castle and Mountains","hidden":false,"opacity":1,"order":13,"rect":{"x":100,"y":383,"width":1114,"height":891}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-014_inserted_image_08.png")},
  {...{"id":"ELD-MM11-015","displayName":"Clouds and Birds","hidden":false,"opacity":1,"order":14,"rect":{"x":234,"y":462,"width":734,"height":464}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-015_inserted_image_09.png")},
  {...{"id":"ELD-MM11-016","displayName":"Blue Paper Sky","hidden":false,"opacity":1,"order":15,"rect":{"x":66,"y":353,"width":1304,"height":1437}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-016_inserted_image_10.png")},
  {...{"id":"ELD-MM11-017","displayName":"Parchment Background","hidden":false,"opacity":1,"order":16,"rect":{"x":0,"y":0,"width":1440,"height":3120}},source:require("../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-017_layer_29.png")},
];

export const MAIN_MENU_11_BUTTONS = {
  continue: { id: 'ELD-MM11-007', source: require('../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-007_inserted_image_04.png'), pressedSource: require('../../assets/ported/layers/mainMenu11/Pressed/ELD-MM11-007_continue_crumpled.png'), bounds: { x: 305, y: 1674, width: 828, height: 201 } },
  load: { id: 'ELD-MM11-008', source: require('../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-008_inserted_image_05.png'), pressedSource: require('../../assets/ported/layers/mainMenu11/Pressed/ELD-MM11-008_load_crumpled.png'), bounds: { x: 294, y: 1954, width: 856, height: 213 } },
  newGame: { id: 'ELD-MM11-005', source: require('../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-005_inserted_image_02.png'), pressedSource: require('../../assets/ported/layers/mainMenu11/Pressed/ELD-MM11-005_new_game_crumpled.png'), bounds: { x: 293, y: 2169, width: 870, height: 266 } },
  settings: { id: 'ELD-MM11-006', source: require('../../assets/ported/layers/mainMenu11/Shared/ELD-MM11-006_inserted_image_03.png'), pressedSource: require('../../assets/ported/layers/mainMenu11/Pressed/ELD-MM11-006_settings_crumpled.png'), bounds: { x: 292, y: 2443, width: 860, height: 209 } },
} as const;
