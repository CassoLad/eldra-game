import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ArtworkCanvas, ArtworkImage, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { GameColors } from '@/design/gameTheme';
import { pixelRectStyle } from '@/game/artworkLayout';
import { DICE_20_LANDING_RECT, DICE_20_RESULTS } from '@/game/dice20Assets';
import { FOREST_VALLEY_10_CANVAS, FOREST_VALLEY_10_COMPOSITE } from '@/game/forestValley10Assets';
import { EQUIPMENT_BOARD, INVENTORY_BOARD } from '@/game/inventoryEquipment12Assets';
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

type InventoryStage = 'closed' | 'inventory' | 'equipment';

const INVENTORY_HIDDEN_Y = -2800;
const INVENTORY_OPEN_Y = -350;
const INVENTORY_RAISED_Y = -720;
const EQUIPMENT_HIDDEN_Y = -3200;
const EQUIPMENT_STOWED_Y = -600;
const EQUIPMENT_OPEN_Y = 0;

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

function InventoryEquipmentPanels({
  stage,
  inventoryY,
  equipmentY,
  onPlayerCard,
}: {
  stage: InventoryStage;
  inventoryY: Animated.Value;
  equipmentY: Animated.Value;
  onPlayerCard: () => void;
}) {
  const scale = useArtworkScale();
  return <>
    <Animated.View
      pointerEvents={stage === 'closed' ? 'none' : 'auto'}
      aria-hidden={stage === 'closed'}
      accessibilityElementsHidden={stage === 'closed'}
      importantForAccessibility={stage === 'closed' ? 'no-hide-descendants' : 'auto'}
      style={[
        styles.inventoryPanel,
        pixelRectStyle(INVENTORY_BOARD.rect, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height),
        { transform: [{ translateY: Animated.multiply(inventoryY, scale) }] },
      ]}>
      <Image resizeMode="stretch" source={INVENTORY_BOARD.source} style={styles.panelImage} />
      <Pressable accessibilityLabel="Open Huntsman equipment" accessibilityRole="button" onPress={onPlayerCard}
        style={({ pressed }) => [styles.playerCardHotspot, pressed && styles.pressed]} />
    </Animated.View>
    <Animated.View
      pointerEvents={stage === 'equipment' ? 'auto' : 'none'}
      aria-hidden={stage !== 'equipment'}
      accessibilityElementsHidden={stage !== 'equipment'}
      importantForAccessibility={stage === 'equipment' ? 'auto' : 'no-hide-descendants'}
      style={[
        styles.equipmentPanel,
        pixelRectStyle(EQUIPMENT_BOARD.rect, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height),
        { transform: [{ translateY: Animated.multiply(equipmentY, scale) }] },
      ]}>
      <Image resizeMode="stretch" source={EQUIPMENT_BOARD.source} style={styles.panelImage} />
    </Animated.View>
  </>;
}

function DiceRollOverlay({
  result,
  visible,
  translateX,
  translateY,
  rollScale,
  spin,
}: {
  result: number;
  visible: boolean;
  translateX: Animated.Value;
  translateY: Animated.Value;
  rollScale: Animated.Value;
  spin: Animated.Value;
}) {
  const artworkScale = useArtworkScale();
  const rotation = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '1080deg'] });
  if (!visible) return null;
  return <Animated.View pointerEvents="none" style={[
    styles.diceOverlay,
    pixelRectStyle(DICE_20_LANDING_RECT, FOREST_VALLEY_10_CANVAS.width, FOREST_VALLEY_10_CANVAS.height),
    {
      transform: [
        { translateX: Animated.multiply(translateX, artworkScale) },
        { translateY: Animated.multiply(translateY, artworkScale) },
        { rotate: rotation },
        { scale: rollScale },
      ],
    },
  ]}>
    <Image accessibilityLabel={`D20 result ${result}`} resizeMode="contain" source={DICE_20_RESULTS[result - 1]} style={styles.panelImage} />
  </Animated.View>;
}

export default function GameScreen() {
  const router = useRouter();
  const { gameState, hasSave, isHydrating, isSaving, applyChoice } = useGameStore();
  const lock = useRef(false);
  const [announcement, setAnnouncement] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [inventoryStage, setInventoryStage] = useState<InventoryStage>('closed');
  const [diceResult, setDiceResult] = useState(20);
  const [diceVisible, setDiceVisible] = useState(false);
  const diceRolling = useRef(false);
  const diceX = useRef(new Animated.Value(0)).current;
  const diceY = useRef(new Animated.Value(0)).current;
  const diceScale = useRef(new Animated.Value(1)).current;
  const diceSpin = useRef(new Animated.Value(0)).current;
  const inventoryY = useRef(new Animated.Value(INVENTORY_HIDDEN_Y)).current;
  const equipmentY = useRef(new Animated.Value(EQUIPMENT_HIDDEN_Y)).current;

  useEffect(() => {
    if (!isHydrating && !hasSave) router.replace('/');
  }, [hasSave, isHydrating, router]);

  if (isHydrating || !hasSave) {
    return <View style={styles.loading}><ActivityIndicator color={GameColors.markerPlum} /></View>;
  }

  const rollDice = () => {
    if (diceRolling.current) return;
    diceRolling.current = true;
    const result = Math.floor(Math.random() * 20) + 1;
    setDiceResult(result);
    setDiceVisible(true);
    diceX.setValue(650);
    diceY.setValue(-660);
    diceScale.setValue(1.55);
    diceSpin.setValue(0);

    const step = (x: number, y: number, scale: number, spin: number, duration: number) => Animated.parallel([
      Animated.timing(diceX, { toValue: x, duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(diceY, { toValue: y, duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(diceScale, { toValue: scale, duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      Animated.timing(diceSpin, { toValue: spin, duration, easing: Easing.linear, useNativeDriver: true }),
    ]);

    Animated.sequence([
      step(300, -360, 1.2, 0.18, 300),
      step(75, -130, 0.65, 0.35, 280),
      step(-155, -140, 0.9, 0.52, 250),
      step(-385, -210, 0.55, 0.68, 250),
      step(-195, -410, 0.72, 0.84, 300),
      Animated.parallel([
        Animated.spring(diceX, { toValue: 0, speed: 9, bounciness: 7, useNativeDriver: true }),
        Animated.spring(diceY, { toValue: 0, speed: 9, bounciness: 7, useNativeDriver: true }),
        Animated.spring(diceScale, { toValue: 1, speed: 9, bounciness: 5, useNativeDriver: true }),
        Animated.timing(diceSpin, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start(() => {
      diceRolling.current = false;
      setAnnouncement(`You rolled ${result}.`);
    });
  };

  const activate = async (id: string) => {
    if (lock.current || isSaving) return;
    if (id === 'settings') {
      router.push('/settings');
      return;
    }
    if (id === 'dice') {
      rollDice();
      return;
    }
    if (id === 'inventory') {
      if (inventoryStage !== 'closed') {
        Animated.parallel([
          Animated.timing(inventoryY, { toValue: INVENTORY_HIDDEN_Y, duration: 520, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(equipmentY, { toValue: EQUIPMENT_HIDDEN_Y, duration: 520, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start(() => setInventoryStage('closed'));
        return;
      }
      inventoryY.setValue(INVENTORY_HIDDEN_Y);
      equipmentY.setValue(EQUIPMENT_HIDDEN_Y);
      setInventoryStage('inventory');
      Animated.timing(inventoryY, {
        toValue: INVENTORY_OPEN_Y,
        duration: 760,
        easing: Easing.out(Easing.back(0.65)),
        useNativeDriver: true,
      }).start();
      return;
    }
    if (id !== 'encounter') {
      setAnnouncement(`${HOTSPOTS.find(item => item.id === id)?.label} selected.`);
      return;
    }

    setShowChoices(true);
  };

  const openEquipment = () => {
    if (inventoryStage === 'inventory') {
      setInventoryStage('equipment');
      equipmentY.setValue(EQUIPMENT_HIDDEN_Y);
      Animated.timing(inventoryY, {
        toValue: INVENTORY_RAISED_Y,
        duration: 430,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        equipmentY.setValue(EQUIPMENT_STOWED_Y);
        Animated.timing(equipmentY, {
          toValue: EQUIPMENT_OPEN_Y,
          duration: 700,
          easing: Easing.out(Easing.back(0.5)),
          useNativeDriver: true,
        }).start();
      });
      return;
    }
    if (inventoryStage === 'equipment') {
      Animated.timing(equipmentY, {
        toValue: EQUIPMENT_STOWED_Y,
        duration: 520,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        equipmentY.setValue(EQUIPMENT_HIDDEN_Y);
        Animated.timing(inventoryY, {
          toValue: INVENTORY_OPEN_Y,
          duration: 650,
          easing: Easing.out(Easing.back(0.5)),
          useNativeDriver: true,
        }).start(() => setInventoryStage('inventory'));
      });
    }
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
  return <><ArtworkCanvas assets={[FOREST_VALLEY_10_COMPOSITE, INVENTORY_BOARD.source, EQUIPMENT_BOARD.source]} width={FOREST_VALLEY_10_CANVAS.width} height={FOREST_VALLEY_10_CANVAS.height}>
    <ArtworkImage accessibilityLabel="Forest Valley gameplay scene" source={FOREST_VALLEY_10_COMPOSITE} />
    <ArtworkImage source={INVENTORY_BOARD.source} style={styles.preloadArtwork} />
    <ArtworkImage source={EQUIPMENT_BOARD.source} style={styles.preloadArtwork} />
    <StoryLabels title={event.title} text={event.text} health={gameState.stats.health} gold={gameState.stats.gold} />
    <DiceRollOverlay result={diceResult} visible={diceVisible} translateX={diceX} translateY={diceY} rollScale={diceScale} spin={diceSpin} />
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
    <InventoryEquipmentPanels stage={inventoryStage} inventoryY={inventoryY} equipmentY={equipmentY} onPlayerCard={openEquipment} />
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
  preloadArtwork: { opacity: 0 },
  inventoryPanel: { position: 'absolute', zIndex: 22 },
  equipmentPanel: { position: 'absolute', zIndex: 21 },
  diceOverlay: { position: 'absolute', zIndex: 18 },
  panelImage: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  playerCardHotspot: { position: 'absolute', left: '58%', top: '69%', width: '40%', height: '29%', backgroundColor: 'transparent' },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(23, 30, 23, 0.65)' },
  modalCard: { maxWidth: 520, width: '100%', alignSelf: 'center', padding: 24, borderRadius: 12, borderWidth: 3, borderColor: '#77543b', backgroundColor: '#f7e7ca' },
  modalTitle: { color: '#3b291b', fontSize: 26, fontWeight: '700', textAlign: 'center' },
  modalText: { color: '#493622', fontSize: 17, marginTop: 12, marginBottom: 16, textAlign: 'center' },
  modalChoice: { padding: 12, marginTop: 8, borderWidth: 1, borderColor: '#77543b', borderRadius: 5, backgroundColor: '#f0d4a5' },
  modalChoiceText: { color: '#3b291b', fontSize: 16, textAlign: 'center' },
  modalClose: { marginTop: 18, alignSelf: 'center', padding: 8 },
  modalCloseText: { color: '#493622', fontSize: 16 },
});
