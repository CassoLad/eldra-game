import {
  AmaticSC_400Regular,
  AmaticSC_700Bold,
  useFonts as useAmaticFonts,
} from '@expo-google-fonts/amatic-sc';
import {
  Kalam_400Regular,
  Kalam_700Bold,
  useFonts as useKalamFonts,
} from '@expo-google-fonts/kalam';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { GameProvider } from '@/store/gameStore';
import { GameColors } from '@/design/gameTheme';

export default function RootLayout() {
  const [amaticLoaded, amaticError] = useAmaticFonts({
    AmaticSC_400Regular,
    AmaticSC_700Bold,
  });
  const [kalamLoaded, kalamError] = useKalamFonts({
    Kalam_400Regular,
    Kalam_700Bold,
  });

  if ((!amaticLoaded && !amaticError) || (!kalamLoaded && !kalamError)) {
    return null;
  }

  return (
    <GameProvider>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          animation: 'none',
          contentStyle: { backgroundColor: GameColors.paper },
          headerShown: false,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="journeys" />
        <Stack.Screen name="load" />
        <Stack.Screen name="new-game" />
        <Stack.Screen name="game" />
      </Stack>
    </GameProvider>
  );
}
