import { useRouter } from 'expo-router';

import { FullArtworkScreen, FullArtworkSwapButton } from '@/components/menu/FullArtworkScreen';
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

  return (
    <FullArtworkScreen accessibilityLabel="Eldra main menu" source={MAIN_SCREEN}>
      <FullArtworkSwapButton accessibilityLabel="Continue Journey" disabled={isBusy || !hasSave} height={8.37} left={10.58} normalSource={CONTINUE_A} onPress={() => router.push('/journeys')} pressedSource={CONTINUE_B} top={53.04} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="New Game" disabled={isBusy} height={7.94} left={10.58} normalSource={NEW_GAME_A} onPress={() => router.push('/new-game')} pressedSource={NEW_GAME_B} top={62.01} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="Load Game" disabled={isBusy} height={8.1} left={10.58} normalSource={LOAD_GAME_A} onPress={() => router.push('/load')} pressedSource={LOAD_GAME_B} top={70.55} width={81.1} />
      <FullArtworkSwapButton accessibilityLabel="Settings unavailable" disabled height={8.46} left={10.58} normalSource={SETTINGS_A} pressedSource={SETTINGS_B} top={79.25} width={81.1} />
    </FullArtworkScreen>
  );
}
