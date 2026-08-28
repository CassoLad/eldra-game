import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { FullArtworkScreen, FullArtworkSwapButton } from '@/components/menu/FullArtworkScreen';
import { GameColors } from '@/design/gameTheme';
import { useGameStore } from '@/store/gameStore';

const MAIN_SCREEN = require('../../assets/menu-art/main-screen-final.png');
const CONTINUE_A = require('../../assets/menu-art/buttons/main-continue-a.png');
const CONTINUE_B = require('../../assets/menu-art/buttons/main-continue-b.png');
const NEW_GAME_A = require('../../assets/menu-art/buttons/main-new-game-a.png');
const NEW_GAME_B = require('../../assets/menu-art/buttons/main-new-game-b.png');
const LOAD_GAME_A = require('../../assets/menu-art/buttons/main-load-game-a.png');
const LOAD_GAME_B = require('../../assets/menu-art/buttons/main-load-game-b.png');
const SETTINGS_A = require('../../assets/menu-art/buttons/main-settings-a.png');
const SETTINGS_B = require('../../assets/menu-art/buttons/main-settings-b.png');

export default function MainMenuScreen() {
  const router = useRouter();
  const { hasSave, isHydrating, isSaving } = useGameStore();
  const isBusy = isHydrating || isSaving;
  const [isMenuReady, setIsMenuReady] = useState(false);
  const loadedAssetGroups = useRef(new Set<string>());

  const markAssetGroupLoaded = (group: string) => {
    loadedAssetGroups.current.add(group);
    if (loadedAssetGroups.current.size === 5) {
      setIsMenuReady(true);
    }
  };

  return (
    <FullArtworkScreen accessibilityLabel="Eldra main menu" onArtworkLoad={() => markAssetGroupLoaded('background')} source={MAIN_SCREEN}>
      <FullArtworkSwapButton accessibilityLabel="Continue Journey" disabled={isBusy || !hasSave} height={8.37} left={10.58} normalSource={CONTINUE_A} onAssetsLoaded={() => markAssetGroupLoaded('continue')} onPress={() => router.push('/journeys')} pressedSource={CONTINUE_B} top={53.04} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="New Game" disabled={isBusy} height={7.94} left={10.58} normalSource={NEW_GAME_A} onAssetsLoaded={() => markAssetGroupLoaded('new-game')} onPress={() => router.push('/new-game')} pressedSource={NEW_GAME_B} top={62.01} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="Load Game" disabled={isBusy} height={8.1} left={10.58} normalSource={LOAD_GAME_A} onAssetsLoaded={() => markAssetGroupLoaded('load-game')} onPress={() => router.push('/load')} pressedSource={LOAD_GAME_B} top={70.55} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="Settings unavailable" disabled height={8.46} left={10.58} normalSource={SETTINGS_A} onAssetsLoaded={() => markAssetGroupLoaded('settings')} pressedSource={SETTINGS_B} top={79.25} width={81.1} />
      {!isMenuReady ? (
        <View accessibilityLabel="Loading Eldra main menu" accessibilityRole="progressbar" style={styles.loadingCover}>
          <ActivityIndicator color={GameColors.inkMuted} />
        </View>
      ) : null}
    </FullArtworkScreen>
  );
}

const styles = StyleSheet.create({
  loadingCover: { alignItems: 'center', backgroundColor: GameColors.paper, bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0, zIndex: 100 },
});
