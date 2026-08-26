import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { CornerMotifs, DetailLine, MenuHeading, PaperScreen } from '@/components/menu/MenuScaffold';
import { PortraitCrop } from '@/components/menu/PortraitCrop';
import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import { getStoryEvent } from '@/game/storyData';
import { useGameStore } from '@/store/gameStore';

const LOAD_ART = require('../../assets/menu-art/load-journey.jpg');

export default function LoadJourneyScreen() {
  const router = useRouter();
  const { continueGame, gameState, hasSave, isHydrating, isSaving } = useGameStore();
  const [isOpening, setIsOpening] = useState(false);
  const event = getStoryEvent(gameState.currentEventId);
  const isBusy = isHydrating || isSaving || isOpening;

  const loadJourney = async () => {
    setIsOpening(true);
    const restored = await continueGame();
    if (restored) return router.replace('/game');
    setIsOpening(false);
  };

  return (
    <PaperScreen>
      <View style={styles.topRow}>
        <Pressable accessibilityLabel="Back" accessibilityRole="button" disabled={isBusy} onPress={() => router.replace('/')} style={({ pressed }) => [styles.topBack, pressed && styles.pressed]}>
          <Text style={styles.topBackText}>←</Text>
        </Pressable>
        <CornerMotifs />
      </View>
      <MenuHeading dark title="Load Journey" />

      <View style={styles.slotList}>
        {hasSave ? (
          <View style={[styles.slotCard, SketchShadow]}>
            <View style={styles.portrait}><PortraitCrop crop={{ x: 91, y: 283, width: 190, height: 202 }} source={LOAD_ART} /></View>
            <View style={styles.slotCopy}>
              <Text style={styles.slotTitle}>Kael</Text>
              <DetailLine icon="◇">Roadfarer · Level 1</DetailLine>
              <DetailLine icon="⌖">The Old Road</DetailLine>
              <DetailLine icon="▤">{event.title}</DetailLine>
            </View>
            <SlotButton disabled={isBusy} label="Load" onPress={loadJourney} />
          </View>
        ) : <EmptySlot number={1} />}

        {[2, 3, 4].map((slot) => <EmptySlot key={slot} number={slot} />)}
        {isBusy ? <ActivityIndicator color={GameColors.markerGreen} /> : null}
      </View>

      <View style={styles.footerDecorations} pointerEvents="none"><Text style={styles.potion}>⚗</Text><Text style={styles.coins}>◉ ◉</Text></View>
    </PaperScreen>
  );
}

function EmptySlot({ number }: { number: number }) {
  return (
    <View style={[styles.slotCard, SketchShadow]}>
      <View style={styles.emptyPortrait}><Text style={styles.plus}>+</Text></View>
      <View style={styles.slotCopy}><Text style={styles.slotTitle}>Empty Slot {number}</Text><Text style={styles.slotSubtitle}>Reserved for another road.</Text></View>
      <SlotButton disabled label="Empty" />
    </View>
  );
}

function SlotButton({ disabled = false, label, onPress }: { disabled?: boolean; label: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.slotButton, disabled && styles.disabled, pressed && styles.pressed]}>
      <Text style={styles.slotButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: { minHeight: 54 },
  topBack: { alignItems: 'center', height: 48, justifyContent: 'center', left: 0, position: 'absolute', top: 0, width: 52, zIndex: 2 },
  topBackText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 44 },
  slotList: { alignSelf: 'center', gap: 14, maxWidth: 540, width: '100%' },
  slotCard: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 8, borderWidth: 1.5, flexDirection: 'row', minHeight: 126, paddingHorizontal: 12, paddingVertical: 12 },
  portrait: { backgroundColor: GameColors.markerGreenWash, borderRadius: 4, overflow: 'hidden', width: 90 },
  emptyPortrait: { alignItems: 'center', borderColor: GameColors.inkMuted, borderRadius: 40, borderStyle: 'dashed', borderWidth: 1.5, height: 72, justifyContent: 'center', marginHorizontal: 9, width: 72 },
  plus: { color: GameColors.ink, fontFamily: GameFonts.displayRegular, fontSize: 54, lineHeight: 58 },
  slotCopy: { flex: 1, paddingHorizontal: 10 },
  slotTitle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 34, letterSpacing: 1, lineHeight: 37, textTransform: 'uppercase' },
  slotSubtitle: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 13, lineHeight: 19 },
  slotButton: { alignItems: 'center', backgroundColor: GameColors.paper, borderColor: GameColors.ink, borderRadius: 5, borderWidth: 1.5, justifyContent: 'center', minWidth: 70, paddingHorizontal: 10, paddingVertical: 7 },
  slotButtonText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 25, letterSpacing: 1.1, lineHeight: 28, textTransform: 'uppercase' },
  disabled: { opacity: 0.33 },
  pressed: { opacity: 0.68, transform: [{ translateY: 1 }] },
  footerDecorations: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 26, paddingHorizontal: 20 },
  potion: { backgroundColor: '#DED0E1', color: GameColors.ink, fontSize: 28, paddingHorizontal: 12, transform: [{ rotate: '-5deg' }] },
  coins: { backgroundColor: GameColors.markerGoldWash, color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 18, paddingHorizontal: 12, transform: [{ rotate: '4deg' }] },
});
