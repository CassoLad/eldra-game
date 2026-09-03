import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArtworkCanvas, FullArtworkHotspot, FullArtworkScreen, FullArtworkSwapButton, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { CHARACTERS, TRAITS } from '@/game/newGameData';
import { useGameStore } from '@/store/gameStore';
const SCREENS = [require('../../assets/ported/menu/world-screen-clean.png'), require('../../assets/ported/menu/hero-screen-clean.png'), require('../../assets/ported/menu/trait-screen-final.png'), require('../../assets/ported/menu/past-screen-a.png')];
const CONTINUE = [require('../../assets/ported/menu/world-continue-a-final.png'), require('../../assets/ported/menu/world-continue-b-final.png')];
const PAST_CONTINUE = [require('../../assets/ported/menu/past-continue-a.png'), require('../../assets/ported/menu/past-continue-b.png')];
const PASTS = ['Village-Born', 'Former Soldier', 'Criminal Past', 'Relic Scavenger', 'Survivor of a Destroyed Settlement'];
const CARDS = [
  [{ left: 8.5, top: 34.4, width: 83, height: 48 }],
  [{ left: 4, top: 38.8, width: 92, height: 15.5 }, { left: 4, top: 55.1, width: 92, height: 15 }, { left: 4, top: 70.7, width: 92, height: 15 }],
  [44.8, 57.7, 70.3, 82.9].map(top => ({ left: 14.8, top, width: 70.4, height: 10.8 })),
  [37.5, 49.3, 59.4, 69.4, 79.4].map((top, index) => ({ left: 11.6, top, width: 76.8, height: index === 0 ? 10.3 : 8.9 })),
];
const CONTINUE_RECTS = [
  { left: 5.99, top: 85.9, width: 88.01, height: 8.46 }, { left: 5.99, top: 86.3, width: 88.01, height: 8.46 },
  { left: 15, top: 94.3, width: 70, height: 5.2 }, { left: 52.8, top: 90.4, width: 34.2, height: 5.75 },
];
export default function NewGameScreen() {
  const router = useRouter();
  const { newGame, isSaving } = useGameStore();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([0, 0, -1, 0]);
  const [error, setError] = useState('');
  const beginning = useRef(false);
  const labels = [['Eldrane'], CHARACTERS.map(hero => hero.name), TRAITS.slice(0, 4).map(trait => trait.name), PASTS];
  const back = () => step === 0 ? router.replace('/') : setStep(step - 1);
  const begin = async () => {
    if (beginning.current || isSaving) return;
    beginning.current = true; setError('');
    try {
      await newGame({ worldId: 'eldrane', characterId: CHARACTERS[selected[1]].id, traitId: TRAITS[selected[2]].id, pastId: PASTS[selected[3]] });
      router.replace('/game');
    } catch { setError('Your journey could not be saved. Please try again.'); }
    finally { beginning.current = false; }
  };
  if (step === 4) return <ArtworkCanvas assets={[]}><Summary labels={labels.map((options, index) => options[selected[index]])} busy={isSaving} error={error} back={back} begin={begin} /></ArtworkCanvas>;
  const pair = step === 3 ? PAST_CONTINUE : CONTINUE;
  const backRect = step === 3 ? { left: 12.8, top: 90.5, width: 26.2, height: 5.5 }
    : step === 2 ? { left: 9, top: 9.8, width: 17, height: 7 } : { left: 5, top: 5, width: 20, height: 9 };
  return <FullArtworkScreen key={step} accessibilityLabel={['Choose your world', 'Choose your hero', 'Choose trait', 'Choose your past'][step]} source={SCREENS[step]} assets={pair}>
    <FullArtworkHotspot accessibilityLabel="Back" disabled={isSaving} onPress={back} {...backRect} />
    {CARDS[step].map((rect, index) => <FullArtworkHotspot key={index} accessibilityLabel={`Select ${labels[step][index]}`}
      disabled={isSaving} selected={step === 0 ? undefined : selected[step] === index} {...rect}
      onPress={() => setSelected(current => current.map((value, which) => which === step ? index : value))} />)}
    <FullArtworkSwapButton accessibilityLabel={step === 2 ? 'Continue to Past' : 'Continue Journey'} {...CONTINUE_RECTS[step]}
      normalSource={pair[0]} pressedSource={pair[1]} disabled={isSaving || selected[step] < 0} onPress={() => setStep(step + 1)} />
  </FullArtworkScreen>;
}
function Summary({ labels, busy, error, back, begin }: { labels: string[]; busy: boolean; error: string; back: () => void; begin: () => void }) {
  const scale = useArtworkScale();
  return <View style={styles.summary}>
    <Text style={[styles.progress, { fontSize: 25 * scale }]}>✓ WORLD    ✓ HERO    ✓ TRAIT    ✓ PAST    5 SUMMARY</Text>
    <Text style={[styles.title, { fontSize: 65 * scale }]}>JOURNEY SUMMARY</Text>
    <Text style={[styles.subtitle, { fontSize: 27 * scale }]}>One last look before the road begins.</Text>
    <View style={styles.card}>{labels.map((label, index) => <View key={index} style={styles.row}>
      <Text style={[styles.label, { fontSize: 35 * scale }]}>{['WORLD', 'HERO', 'TRAIT', 'PAST'][index]}</Text>
      <Text style={[styles.value, { fontSize: 27 * scale }]}>{label}</Text>
    </View>)}</View>
    <View style={styles.footer}>
      <Pressable accessibilityRole="button" disabled={busy} onPress={back} style={styles.button}><Text style={[styles.label, { fontSize: 35 * scale }]}>← BACK</Text></Pressable>
      <Pressable accessibilityRole="button" disabled={busy} onPress={begin} style={[styles.button, styles.primary]}><Text style={[styles.label, { fontSize: 35 * scale }]}>{busy ? 'SAVING…' : 'BEGIN JOURNEY →'}</Text></Pressable>
    </View>
    {!!error && <Text accessibilityRole="alert" style={[styles.error, { fontSize: 25 * scale }]}>{error}</Text>}
  </View>;
}
const styles = StyleSheet.create({
  summary: { flex: 1, backgroundColor: GameColors.paper },
  progress: { position: 'absolute', top: '10%', width: '100%', textAlign: 'center', fontFamily: GameFonts.display, color: GameColors.ink },
  title: { position: 'absolute', top: '20%', width: '100%', textAlign: 'center', fontFamily: GameFonts.display, color: GameColors.ink },
  subtitle: { position: 'absolute', top: '29%', width: '100%', textAlign: 'center', fontFamily: GameFonts.hand, color: GameColors.ink },
  card: { position: 'absolute', left: '8%', top: '38%', width: '84%', height: '40%', paddingHorizontal: '6%', backgroundColor: GameColors.paperLight, borderRadius: 6 },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  label: { fontFamily: GameFonts.display, color: GameColors.ink },
  value: { fontFamily: GameFonts.hand, color: GameColors.ink, flex: 1, textAlign: 'right' },
  footer: { position: 'absolute', left: '8%', top: '85%', width: '84%', height: '7%', flexDirection: 'row', gap: 12 },
  button: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#d6bfc7', borderRadius: 5 },
  primary: { flex: 1.4, backgroundColor: '#b3bd8c' },
  error: { position: 'absolute', top: '94%', width: '100%', textAlign: 'center', color: '#822929', fontFamily: GameFonts.hand },
});
