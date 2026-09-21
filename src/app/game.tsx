import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtworkCanvas, ArtworkImage, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { GameColors } from '@/design/gameTheme';
import { pixelRectStyle } from '@/game/artworkLayout';
import { FOREST_VALLEY_10_CANVAS, FOREST_VALLEY_10_COMPOSITE } from '@/game/forestValley10Assets';
import { getStoryEvent } from '@/game/storyData';
import { useGameStore } from '@/store/gameStore';

type Hotspot = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const HOTSPOTS: Hotspot[] = [
  { id: 'settings', label: 'Settings', x: 1050, y: 445, width: 170, height: 185 },
  { id: 'encounter', label: 'Choose your path', x: 245, y: 2200, width: 950, height: 220 },
  { id: 'dice', label: 'Dice', x: 40, y: 2515, width: 270, height: 300 },
  { id: 'upgrades', label: 'Upgrades', x: 315, y: 2515, width: 270, height: 300 },
  { id: 'inventory', label: 'Inventory', x: 585, y: 2515, width: 270, height: 300 },
  { id: 'codex', label: 'Codex', x: 855, y: 2515, width: 270, height: 300 },
  { id: 'map', label: 'Map', x: 1125, y: 2515, width: 270, height: 300 },
];

function StoryLabels({ title, text, health, gold }: { title: string; text: string; health: number; gold: number }) {
  const scale = useArtworkScale();
  return <>
    <View pointerEvents="none" style={[styles.headerCopy, pixelRectStyle({ x: 190, y: 780, width: 300, height: 160 }, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height)]}>
      <Text numberOfLines={2} style={[styles.headerTitle, { fontSize: 39 * scale }]}>Forest Valley</Text>
      <Text style={[styles.headerStats, { fontSize: 27 * scale }]}>HP {health}  ·  Gold {gold}</Text>
    </View>
    <View pointerEvents="none" style={[styles.storyCopy, pixelRectStyle({ x: 285, y: 2225, width: 870, height: 175 }, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height)]}>
      <Text numberOfLines={1} style={[styles.storyTitle, { fontSize: 43 * scale }]}>{title}</Text>
      <Text numberOfLines={2} style={[styles.storyText, { fontSize: 27 * scale, lineHeight: 34 * scale }]}>{text}</Text>
      <Text style={[styles.storyHint, { fontSize: 25 * scale }]}>Tap to choose your path →</Text>
    </View>
  </>;
}

export default function GameScreen() {
  const router = useRouter();
  const { gameState, hasSave, isHydrating, isSaving, applyChoice } = useGameStore();
  const lock = useRef(false);
  const [announcement, setAnnouncement] = useState('');
  const [showChoices, setShowChoices] = useState(false);

  useEffect(() => {
    if (!isHydrating && !hasSave) router.replace('/');
  }, [hasSave, isHydrating, router]);

  if (isHydrating || !hasSave) {
    return <View style={styles.loading}><ActivityIndicator color={GameColors.markerPlum} /></View>;
  }

  const activate = async (id: string) => {
    if (lock.current || isSaving) return;
    if (id === 'settings') {
      router.push('/settings');
      return;
    }
    if (id === 'dice') {
      setAnnouncement(`You rolled ${Math.floor(Math.random() * 20) + 1}.`);
      return;
    }
    if (id !== 'encounter') {
      setAnnouncement(`${HOTSPOTS.find(item => item.id === id)?.label} selected.`);
      return;
    }

    setShowChoices(true);
  };

  const choose = async (index: number) => {
    const choice = getStoryEvent(gameState.currentEventId).choices[index];
    if (!choice || lock.current || isSaving) return;
    lock.current = true;
    try {
      await applyChoice(choice);
      setShowChoices(false);
    } catch {
      setAnnouncement('Could not save. Please try again.');
    } finally {
      lock.current = false;
    }
  };

  const event = getStoryEvent(gameState.currentEventId);
  return <><ArtworkCanvas assets={[FOREST_VALLEY_10_COMPOSITE]} width={FOREST_VALLEY_10_CANVAS.width} height={FOREST_VALLEY_10_CANVAS.height}>
    <ArtworkImage accessibilityLabel="Forest Valley gameplay scene" source={FOREST_VALLEY_10_COMPOSITE} />
    <StoryLabels title={event.title} text={event.text} health={gameState.stats.health} gold={gameState.stats.gold} />
    {HOTSPOTS.map(hotspot => <Pressable
      key={hotspot.id}
      accessibilityLabel={hotspot.label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isSaving }}
      disabled={isSaving}
      onPress={() => activate(hotspot.id)}
      style={({ pressed }) => [
        styles.hotspot,
        pixelRectStyle(hotspot, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height),
        pressed && styles.pressed,
      ]}
    />)}
    <Text accessibilityLiveRegion="polite" style={styles.announcement}>{announcement}</Text>
  </ArtworkCanvas>
    <Modal transparent animationType="fade" visible={showChoices} onRequestClose={() => setShowChoices(false)}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{event.title}</Text>
          <Text style={styles.modalText}>{event.text}</Text>
          {event.choices.map((choice, index) => <Pressable key={`${event.id}-${index}`} accessibilityRole="button" disabled={isSaving}
            onPress={() => choose(index)} style={({ pressed }) => [styles.modalChoice, pressed && styles.pressed]}>
            <Text style={styles.modalChoiceText}>{choice.text} →</Text>
          </Pressable>)}
          <Pressable accessibilityRole="button" onPress={() => setShowChoices(false)} style={styles.modalClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: GameColors.paper },
  hotspot: { position: 'absolute', zIndex: 10, backgroundColor: 'transparent' },
  pressed: { backgroundColor: 'rgba(82, 55, 28, 0.08)', transform: [{ scale: 0.99 }] },
  headerCopy: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#3b291b', fontWeight: '700', textAlign: 'center' },
  headerStats: { color: '#574531', marginTop: 3, textAlign: 'center' },
  storyCopy: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  storyTitle: { color: '#3b291b', fontWeight: '700', textAlign: 'center' },
  storyText: { color: '#493622', marginTop: 2, textAlign: 'center' },
  storyHint: { color: '#694b2d', marginTop: 2, textAlign: 'center' },
  announcement: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(23, 30, 23, 0.65)' },
  modalCard: { maxWidth: 520, width: '100%', alignSelf: 'center', padding: 24, borderRadius: 12, borderWidth: 3, borderColor: '#77543b', backgroundColor: '#f7e7ca' },
  modalTitle: { color: '#3b291b', fontSize: 26, fontWeight: '700', textAlign: 'center' },
  modalText: { color: '#493622', fontSize: 17, marginTop: 12, marginBottom: 16, textAlign: 'center' },
  modalChoice: { padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#77543b', borderRadius: 5, backgroundColor: '#f0d4a5' },
  modalChoiceText: { color: '#3b291b', fontSize: 16, textAlign: 'center' },
  modalClose: { marginTop: 18, alignSelf: 'center', padding: 8 },
  modalCloseText: { color: '#493622', fontSize: 16 },
});
