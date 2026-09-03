import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArtworkCanvas, ArtworkImage, FullArtworkHotspot, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { pixelRectStyle } from '@/game/artworkLayout';
import { LAYER_SETS } from '@/game/layerAssets';
import { getStoryEvent } from '@/game/storyData';
import { useGameStore } from '@/store/gameStore';

const SET = LAYER_SETS.gameplay;
const LAYERS = [...SET.layers].filter(layer => !layer.hidden).sort((a, b) => b.order - a.order);
const SOURCES = LAYERS.map(layer => layer.source);

export default function GameScreen() {
  const router = useRouter();
  const { hasSave, isHydrating } = useGameStore();
  useEffect(() => { if (!isHydrating && !hasSave) router.replace('/'); }, [hasSave, isHydrating, router]);
  if (isHydrating || !hasSave) return <View style={styles.loading}><ActivityIndicator color={GameColors.markerPlum} /></View>;
  return <ArtworkCanvas assets={SOURCES} width={SET.width} height={SET.height}>
    {LAYERS.map(layer => <ArtworkImage key={layer.id} source={layer.source}
      style={[pixelRectStyle(layer.rect, SET.width, SET.height), { opacity: layer.opacity }]} />)}
    <GameplayControls />
  </ArtworkCanvas>;
}

function GameplayControls() {
  const router = useRouter();
  const scale = useArtworkScale();
  const { gameState, applyChoice, isSaving } = useGameStore();
  const event = getStoryEvent(gameState.currentEventId);
  const lock = useRef(false);
  const [notice, setNotice] = useState('');
  const rect = (x: number, y: number, width: number, height: number) => [styles.positioned, pixelRectStyle({ x, y, width, height }, SET.width, SET.height)];
  const choose = async (index: number) => {
    if (lock.current || isSaving) return;
    lock.current = true; setNotice('');
    try { await applyChoice(event.choices[index]); }
    catch { setNotice('Could not save. Please try again.'); }
    finally { lock.current = false; }
  };
  return <>
    <FullArtworkHotspot accessibilityLabel="Return to main menu" left={5} top={3} width={23} height={10} onPress={() => router.replace('/')} />
    <View style={rect(140, 1600, 1160, 250)}>
      <Text style={[styles.title, { fontSize: 43 * scale }]}>{event.title}</Text>
      <Text style={[styles.copy, { fontSize: 32 * scale }]}>{event.text}</Text>
    </View>
    <View style={[...rect(185, 1970, 1060, 105), styles.center]}>
      <Text accessibilityLiveRegion="polite" style={[styles.copy, { fontSize: 28 * scale }]}>{notice || (isSaving ? 'Saving your journey…' : `Health ${gameState.stats.health} · Gold ${gameState.stats.gold} · Reputation ${gameState.stats.reputation}`)}</Text>
    </View>
    {event.choices.slice(0, 4).map((choice, index) => <Pressable key={`${event.id}-${index}`} accessibilityRole="button" accessibilityLabel={choice.text}
      disabled={isSaving} onPress={() => choose(index)} style={({ pressed }) => [
        ...rect(index % 2 ? 750 : 71, index < 2 ? 2136 : 2335, 619, 199), styles.choice,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.copy, { fontSize: 31 * scale }]}>{choice.text}</Text>
    </Pressable>)}
    {[97, 390, 690, 995].map((left, index) => <FullArtworkHotspot key={left} accessibilityLabel={`Inventory slot ${index + 1}`}
      left={left / SET.width * 100} top={2640 / SET.height * 100} width={290 / SET.width * 100} height={408 / SET.height * 100}
      onPress={() => setNotice(`Inventory slot ${index + 1} is empty.`)} />)}
  </>;
}
const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: GameColors.paper },
  positioned: { position: 'absolute' },
  title: { color: GameColors.ink, fontFamily: GameFonts.display, textAlign: 'center' },
  copy: { color: GameColors.ink, fontFamily: GameFonts.hand, textAlign: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  choice: { justifyContent: 'center', paddingLeft: '10%', paddingRight: '2%' },
  pressed: { backgroundColor: '#72507f22', borderColor: '#72507f', borderWidth: 1, borderRadius: 6 },
});
