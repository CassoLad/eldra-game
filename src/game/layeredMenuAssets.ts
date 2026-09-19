// Complete Procreate layers: no UI artwork is cropped, cut, or recombined.
export const characterLayers = {
  back: require('../../assets/ported/menu/transitions/character/scene-back.png'),
  mid: require('../../assets/ported/menu/transitions/character/scene-mid.png'),
  0: require('../../assets/ported/menu/transitions/character/00.png'),
  1: require('../../assets/ported/menu/transitions/character/01.png'),
  4: require('../../assets/ported/menu/transitions/character/04.png'),
  6: require('../../assets/ported/menu/transitions/character/06.png'),
  7: require('../../assets/ported/menu/transitions/character/07.png'),
  8: require('../../assets/ported/menu/transitions/character/08.png'),
  9: require('../../assets/ported/menu/transitions/character/09.png'),
  10: require('../../assets/ported/menu/transitions/character/10.png'),
  12: require('../../assets/ported/menu/transitions/character/12.png'),
  13: require('../../assets/ported/menu/transitions/character/13.png'),
  14: require('../../assets/ported/menu/transitions/character/14.png'),
  16: require('../../assets/ported/menu/transitions/character/16.png'),
  17: require('../../assets/ported/menu/transitions/character/17.png'),
  18: require('../../assets/ported/menu/transitions/character/18.png'),
  24: require('../../assets/ported/menu/transitions/character/24.png'),
  25: require('../../assets/ported/menu/transitions/character/25.png'),
} as const;

export const traitsLayers = {
  scenery: require('../../assets/ported/menu/transitions/traits/scenery.png'),
  0: require('../../assets/ported/menu/transitions/traits/00.png'),
  1: require('../../assets/ported/menu/transitions/traits/01.png'),
  2: require('../../assets/ported/menu/transitions/traits/02.png'),
  3: require('../../assets/ported/menu/transitions/traits/03.png'),
  4: require('../../assets/ported/menu/transitions/traits/04.png'),
  5: require('../../assets/ported/menu/transitions/traits/05.png'),
  6: require('../../assets/ported/menu/transitions/traits/06.png'),
  7: require('../../assets/ported/menu/transitions/traits/07.png'),
  8: require('../../assets/ported/menu/transitions/traits/08.png'),
  9: require('../../assets/ported/menu/transitions/traits/09.png'),
} as const;

export const layeredMenuAssets = [
  ...Object.values(characterLayers),
  ...Object.values(traitsLayers),
] as number[];
