import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { CornerMotifs, DetailLine, MenuHeading, PaperScreen, SectionBrush, SketchMenuButton } from '@/components/menu/MenuScaffold';
import { PortraitCrop } from '@/components/menu/PortraitCrop';
import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import { getStoryEvent } from '@/game/storyData';
import { useGameStore } from '@/store/gameStore';

const JOURNEYS_ART = require('../../assets/menu-art/your-journeys.jpg');

export default function JourneysScreen() {
  const router = useRouter();
  const { continueGame, gameState, hasSave, isHydrating, isSaving } = useGameStore();
  const [isOpening, setIsOpening] = useState(false);
  const event = getStoryEvent(gameState.currentEventId);
  const isBusy = isHydrating || isSaving || isOpening;

  const continueJourney = async () => {
    setIsOpening(true);
    const restored = await continueGame();
    if (restored) return router.replace('/game');
    setIsOpening(false);
  };

  return (
    <PaperScreen>
      <CornerMotifs />
      <MenuHeading title="Your Journeys" subtitle="Every road begins with a choice." />

      <View style={styles.content}>
        <SectionBrush>Current Journey</SectionBrush>
        <View style={[styles.journeyCard, SketchShadow]}>
          <View style={styles.portraitColumn}>
            <PortraitCrop crop={{ x: 82, y: 486, width: 222, height: 242 }} source={JOURNEYS_ART} />
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardCopy}>
            <Text style={styles.journeyTitle}>{hasSave ? 'Kael' : 'New Wanderer'}</Text>
            <DetailLine icon="◇">Roadfarer · Level 1</DetailLine>
            <DetailLine icon="⌖">The Old Road</DetailLine>
            <DetailLine icon="▤">{hasSave ? event.title : 'No active quest'}</DetailLine>
          </View>
        </View>

        <View style={styles.actions}>
          <SketchMenuButton accent="green" disabled={isBusy || !hasSave} icon="✦" label="Continue Journey" onPress={continueJourney} showArrow />
          <SketchMenuButton accent="plum" disabled={isBusy} icon="†" label="New Journey" onPress={() => router.push('./new-game')} showArrow subtitle="Start a new adventure." />
          {isBusy ? <ActivityIndicator color={GameColors.markerGreen} /> : null}
        </View>

        <Pressable accessibilityRole="button" disabled={isBusy} onPress={() => router.replace('/')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
          <Text style={styles.backText}>←  BACK</Text>
        </Pressable>
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  content: { alignSelf: 'center', maxWidth: 520, width: '100%' },
  journeyCard: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 9, borderWidth: 1.5, flexDirection: 'row', minHeight: 190, padding: 14 },
  portraitColumn: { alignItems: 'center', backgroundColor: GameColors.markerGreenWash, borderRadius: 4, overflow: 'hidden', width: '40%' },
  cardDivider: { alignSelf: 'stretch', backgroundColor: GameColors.lineSoft, marginHorizontal: 14, width: 1 },
  cardCopy: { flex: 1 },
  journeyTitle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 40, letterSpacing: 1.2, lineHeight: 43, marginBottom: 4, textTransform: 'uppercase' },
  actions: { gap: 14, marginHorizontal: 8, marginTop: 28 },
  backButton: { alignItems: 'center', alignSelf: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 6, borderWidth: 1.5, marginTop: 28, minWidth: 142, paddingHorizontal: 20, paddingVertical: 8 },
  backText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 25, letterSpacing: 1.4 },
  pressed: { opacity: 0.7, transform: [{ translateY: 1 }] },
});
