import { useRouter } from 'expo-router';
import { FullArtworkScreen, FullArtworkSwapButton } from '@/components/menu/FullArtworkScreen';
import { useGameStore } from '@/store/gameStore';
const ART = require('../../assets/ported/menu/main-screen-final.png');
const BUTTONS = [
  { label: 'Continue Journey', a: require('../../assets/ported/menu/main-continue-a.png'), b: require('../../assets/ported/menu/main-continue-b.png'), top: 53.04, height: 8.37 },
  { label: 'New Game', a: require('../../assets/ported/menu/main-new-game-a.png'), b: require('../../assets/ported/menu/main-new-game-b.png'), top: 62.01, height: 7.94 },
  { label: 'Load Game', a: require('../../assets/ported/menu/main-load-game-a.png'), b: require('../../assets/ported/menu/main-load-game-b.png'), top: 70.55, height: 8.1 },
  { label: 'Settings unavailable', a: require('../../assets/ported/menu/main-settings-a.png'), b: require('../../assets/ported/menu/main-settings-b.png'), top: 79.25, height: 8.46 },
] as const;
export default function MainMenuScreen() {
  const router = useRouter();
  const { hasSave, isHydrating, isSaving } = useGameStore();
  const routes = ['/game', '/new-game', '/load'] as const;
  return <FullArtworkScreen accessibilityLabel="Eldra main menu" source={ART} assets={BUTTONS.flatMap(button => [button.a, button.b])}>
    {BUTTONS.map((button, index) => <FullArtworkSwapButton key={button.label} accessibilityLabel={button.label} normalSource={button.a} pressedSource={button.b}
      left={10.58} width={81.1} top={button.top} height={button.height} disabled={isHydrating || isSaving || index === 3 || (index === 0 && !hasSave)}
      onPress={() => router.push(routes[index as 0 | 1 | 2])} />)}
  </FullArtworkScreen>;
}
