import { useRouter } from 'expo-router';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SketchMenuButton } from '@/components/menu/MenuScaffold';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { useGameStore } from '@/store/gameStore';

const TITLE_ART = require('../../assets/menu-art/eldra-title.jpg');

export default function MainMenuScreen() {
  const router = useRouter();
  const { hasSave, isHydrating, isSaving } = useGameStore();
  const isBusy = isHydrating || isSaving;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.heroFrame}>
            <Image accessibilityLabel="Eldra: Chronicles of the Road" resizeMode="contain" source={TITLE_ART} style={styles.hero} />
          </View>

          <View style={styles.actions}>
            <SketchMenuButton accent="green" disabled={isBusy || !hasSave} icon="✦" label="Continue Journey" onPress={() => router.push('/journeys')} showArrow />
            <SketchMenuButton accent="plum" disabled={isBusy} icon="†" label="New Game" onPress={() => router.push('./new-game')} />
            <SketchMenuButton accent="green" disabled={isBusy} icon="▤" label="Load Game" onPress={() => router.push('/load')} />
            <SketchMenuButton accent="gold" disabled icon="⚙" label="Settings" />
            {isBusy ? <ActivityIndicator color={GameColors.markerGreen} /> : null}
          </View>

          <View style={styles.creditRule} />
          <Text style={styles.credits}>CREDITS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: GameColors.paper },
  scrollContent: { alignItems: 'center', flexGrow: 1 },
  page: { backgroundColor: GameColors.paper, maxWidth: 720, paddingBottom: 34, width: '100%' },
  heroFrame: { aspectRatio: 1170 / 1071, position: 'relative', width: '100%' },
  hero: { bottom: 0, height: '100%', left: 0, position: 'absolute', right: 0, top: 0, width: '100%' },
  actions: { alignSelf: 'center', gap: 12, marginTop: 8, maxWidth: 470, paddingHorizontal: 18, width: '100%' },
  creditRule: { alignSelf: 'center', backgroundColor: GameColors.lineSoft, height: 1, marginTop: 28, width: 150 },
  credits: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 14, letterSpacing: 3, marginTop: 11, textAlign: 'center' },
});
