import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChoiceButton } from '@/components/ChoiceButton';
import { StatBar } from '@/components/StatBar';
import { StoryCard } from '@/components/StoryCard';
import { GameColors, GameFonts } from '@/design/gameTheme';
import type { StoryChoice } from '@/game/gameTypes';
import { getStoryEvent } from '@/game/storyData';
import { useGameStore } from '@/store/gameStore';

export default function GameScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const { applyChoice, gameState, hasSave, isHydrating, isSaving } = useGameStore();
  const storyEvent = getStoryEvent(gameState.currentEventId);

  useEffect(() => {
    if (!isHydrating && !hasSave) router.replace('/');
  }, [hasSave, isHydrating, router]);

  const handleChoice = async (choice: StoryChoice) => {
    await applyChoice(choice);
    scrollRef.current?.scrollTo({ animated: true, y: 0 });
  };

  if (isHydrating || !hasSave) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color={GameColors.markerGreen} size="large" />
        <Text style={styles.loadingText}>Opening your journey…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView ref={scrollRef} bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View pointerEvents="none" style={styles.pageInnerFrame} />

          <View style={styles.header}>
            <Pressable accessibilityLabel="Return to journeys" accessibilityRole="button" onPress={() => router.replace('/journeys')} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <Text style={styles.backText}>←</Text>
            </Pressable>
            <View style={styles.headerBrush}><Text style={styles.headerTitle}>ENCOUNTER</Text></View>
            <Text style={styles.headerMark}>◇</Text>
          </View>

          <StatBar stats={gameState.stats} />
          <StoryCard event={storyEvent} />

          <View style={styles.choiceSection}>
            <View style={styles.choiceBrush}><Text style={styles.choiceLabel}>MAKE YOUR CHOICE</Text></View>
            <Text style={styles.choiceHint}>There are no wrong answers—only different roads.</Text>
            <View style={styles.choices}>
              {storyEvent.choices.map((choice, index) => (
                <ChoiceButton
                  key={`${storyEvent.id}-${choice.nextEventId}-${choice.text}`}
                  choice={choice}
                  disabled={isSaving}
                  index={index}
                  onPress={() => handleChoice(choice)}
                />
              ))}
            </View>
          </View>

          <View style={styles.saveRow}>
            {isSaving ? <ActivityIndicator color={GameColors.markerPlum} size="small" /> : <Text style={styles.saveMark}>✦</Text>}
            <Text style={styles.saveText}>{isSaving ? 'Writing your choice…' : 'Your journey saves after every choice'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: GameColors.paperDeep, flex: 1 },
  scrollContent: { alignItems: 'center', flexGrow: 1, padding: 8 },
  page: { backgroundColor: GameColors.paper, borderColor: GameColors.ink, borderRadius: 16, borderWidth: 1.5, maxWidth: 610, paddingBottom: 28, paddingHorizontal: 18, paddingTop: 16, position: 'relative', width: '100%' },
  pageInnerFrame: { bottom: 5, borderColor: GameColors.lineSoft, borderRadius: 12, borderWidth: 0.7, left: 5, position: 'absolute', right: 5, top: 5 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 13, minHeight: 48, paddingHorizontal: 2 },
  backButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 48 },
  backText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 43, lineHeight: 45 },
  headerBrush: { backgroundColor: GameColors.charcoal, paddingHorizontal: 30, paddingVertical: 2, transform: [{ rotate: '-1deg' }] },
  headerTitle: { color: GameColors.paperLight, fontFamily: GameFonts.display, fontSize: 31, letterSpacing: 2.5, lineHeight: 35 },
  headerMark: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 24, textAlign: 'center', width: 48 },
  choiceSection: { marginTop: 25 },
  choiceBrush: { alignSelf: 'center', backgroundColor: GameColors.markerGreenWash, paddingHorizontal: 24, paddingVertical: 2, transform: [{ rotate: '-1deg' }] },
  choiceLabel: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 29, letterSpacing: 1.6, lineHeight: 33, textAlign: 'center' },
  choiceHint: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 12, lineHeight: 18, marginBottom: 13, marginTop: 7, textAlign: 'center' },
  choices: { gap: 11 },
  saveRow: { alignItems: 'center', flexDirection: 'row', gap: 7, justifyContent: 'center', marginTop: 22 },
  saveMark: { color: GameColors.markerPlum, fontFamily: GameFonts.display, fontSize: 18 },
  saveText: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 10 },
  pressed: { opacity: 0.65, transform: [{ translateY: 1 }] },
  loadingScreen: { alignItems: 'center', backgroundColor: GameColors.paper, flex: 1, gap: 14, justifyContent: 'center' },
  loadingText: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 16 },
});
