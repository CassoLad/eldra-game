import { useRouter, type Href } from 'expo-router';
import { useRef } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ArtworkCanvas, ArtworkImage } from '@/components/menu/FullArtworkScreen';
import { pixelRectStyle } from '@/game/artworkLayout';
import { MAIN_MENU_12_ARTWORK, MAIN_MENU_12_BUTTONS, MAIN_MENU_12_CANVAS } from '@/game/mainMenu12Assets';
import { useGameStore } from '@/store/gameStore';

function position(bounds: { x: number; y: number; width: number; height: number }): ViewStyle {
  return pixelRectStyle(bounds, MAIN_MENU_12_CANVAS.width, MAIN_MENU_12_CANVAS.height);
}

export default function MainMenuScreen() {
  const router = useRouter();
  const { hasSave, isHydrating, isSaving } = useGameStore();
  const navigationLocked = useRef(false);
  const buttons = [
    { ...MAIN_MENU_12_BUTTONS.continue, disabled: !hasSave },
    { ...MAIN_MENU_12_BUTTONS.newGame, disabled: false },
    { ...MAIN_MENU_12_BUTTONS.settings, disabled: false },
    { ...MAIN_MENU_12_BUTTONS.credits, disabled: false },
  ] as const;

  const open = (route: '/game' | '/new-game' | '/settings' | '/credits') => {
    if (navigationLocked.current) return;
    navigationLocked.current = true;
    setTimeout(() => router.push(route as Href), 70);
  };

  return <ArtworkCanvas assets={[MAIN_MENU_12_ARTWORK.source]} width={MAIN_MENU_12_CANVAS.width} height={MAIN_MENU_12_CANVAS.height}>
    <ArtworkImage accessibilityLabel="Eldrane main menu" source={MAIN_MENU_12_ARTWORK.source} />
    {buttons.map((button) => {
      const disabled = isHydrating || isSaving || button.disabled;
      return <Pressable
        key={button.id}
        accessibilityLabel={button.label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => open(button.route)}
        style={({ pressed }) => [styles.button, position(button.bounds), pressed && !disabled && styles.pressed]}
      />;
    })}
  </ArtworkCanvas>;
}

const styles = StyleSheet.create({
  button: { position: 'absolute', backgroundColor: 'transparent', zIndex: 10 },
  pressed: { backgroundColor: 'rgba(55, 34, 16, 0.07)', transform: [{ scaleX: 0.992 }, { scaleY: 0.985 }] },
});
