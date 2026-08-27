import { Platform, type TextStyle, type ViewStyle } from 'react-native';

export const GameColors = {
  ink: '#1E1C18',
  inkMuted: '#625C52',
  charcoal: '#36312B',
  paper: '#F7F1E6',
  paperDeep: '#EDE3D2',
  paperLight: '#FFF9EE',
  lineSoft: '#AAA08E',
  markerBlue: '#5799A1',
  markerBlueWash: '#C6DEDC',
  markerGold: '#D9A93E',
  markerGoldWash: '#EAD9A8',
  markerGreen: '#769B5C',
  markerGreenWash: '#CCDDBB',
  markerPlum: '#8F6294',
  markerRed: '#BE554E',
  markerRedWash: '#E7C1B8',
} as const;

export const GameFonts = {
  display: 'AmaticSC_700Bold',
  displayRegular: 'AmaticSC_400Regular',
  hand: 'Kalam_400Regular',
  handBold: 'Kalam_700Bold',
} satisfies Record<string, TextStyle['fontFamily']>;

export const SketchShadow: ViewStyle =
  Platform.select<ViewStyle>({
    web: {
      boxShadow: '2px 3px 0 rgba(30, 28, 24, 0.22)',
    },
    default: {
      elevation: 2,
      shadowColor: GameColors.ink,
      shadowOffset: { height: 3, width: 2 },
      shadowOpacity: 0.22,
      shadowRadius: 0,
    },
  }) ?? {};
