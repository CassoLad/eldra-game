import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, type ImageStyle, type ViewStyle } from 'react-native';

import { ArtworkCanvas, ArtworkImage } from '@/components/menu/FullArtworkScreen';
import {
  MAIN_MENU_V2_BUTTONS,
  MAIN_MENU_V2_CANVAS,
  MAIN_MENU_V2_FRAME,
  MAIN_MENU_V2_TAVERN_LAYERS,
} from '@/game/mainMenuV2Assets';
import type { ArtworkLayer } from '@/game/layerAssets';
import { useGameStore } from '@/store/gameStore';

const SCENE_SCALE = 0.92;
const SCENE_SOURCE_CENTER_X = 720;
const SCENE_SOURCE_TOP = 479;
const SCENE_TARGET_TOP = 300;
const percent = (value: number, total: number): `${number}%` => `${(value / total) * 100}%`;

const SCENERY = [...MAIN_MENU_V2_TAVERN_LAYERS].sort((left, right) => right.order - left.order);
const ASSETS = [
  ...SCENERY.map((layer) => layer.source),
  MAIN_MENU_V2_FRAME.source,
  ...Object.values(MAIN_MENU_V2_BUTTONS).map((button) => button.source),
];

function position(bounds: { x: number; y: number; width: number; height: number }): ImageStyle & ViewStyle {
  return {
    left: percent(bounds.x, MAIN_MENU_V2_CANVAS.width),
    top: percent(bounds.y, MAIN_MENU_V2_CANVAS.height),
    width: percent(bounds.width, MAIN_MENU_V2_CANVAS.width),
    height: percent(bounds.height, MAIN_MENU_V2_CANVAS.height),
  };
}

function sceneryPosition(layer: ArtworkLayer): ImageStyle {
  const x = (MAIN_MENU_V2_CANVAS.width / 2) + ((layer.rect.x - SCENE_SOURCE_CENTER_X) * SCENE_SCALE);
  const y = SCENE_TARGET_TOP + ((layer.rect.y - SCENE_SOURCE_TOP) * SCENE_SCALE);
  return position({ x, y, width: layer.rect.width * SCENE_SCALE, height: layer.rect.height * SCENE_SCALE });
}

export default function MainMenuScreen() {
  const router = useRouter();
  const { hasSave, isHydrating, isSaving } = useGameStore();
  const buttons = [
    { ...MAIN_MENU_V2_BUTTONS.continue, label: 'Continue', route: '/game', disabled: !hasSave },
    { ...MAIN_MENU_V2_BUTTONS.newGame, label: 'New Game', route: '/new-game', disabled: false },
    { ...MAIN_MENU_V2_BUTTONS.load, label: 'Load', route: '/load', disabled: false },
  ] as const;

  return (
    <ArtworkCanvas assets={ASSETS} width={MAIN_MENU_V2_CANVAS.width} height={MAIN_MENU_V2_CANVAS.height}>
      {SCENERY.map((layer) => (
        <ArtworkImage key={layer.id} source={layer.source} style={[sceneryPosition(layer), { opacity: layer.opacity }]} />
      ))}

      <ArtworkImage accessibilityLabel="Eldra main menu" source={MAIN_MENU_V2_FRAME.source} />

      {buttons.map((button) => {
        const disabled = isHydrating || isSaving || button.disabled;
        return (
          <Pressable
            key={button.id}
            accessibilityLabel={button.label}
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => router.push(button.route)}
            style={({ pressed }) => [
              styles.button,
              position(button.bounds),
              disabled && styles.disabled,
              pressed && !disabled && styles.pressed,
            ]}>
            <ArtworkImage source={button.source} />
          </Pressable>
        );
      })}
    </ArtworkCanvas>
  );
}

const styles = StyleSheet.create({
  button: { position: 'absolute', zIndex: 10 },
  disabled: { opacity: 0.48 },
  pressed: { opacity: 0.88, transform: [{ translateY: 2 }, { scale: 0.985 }] },
});
