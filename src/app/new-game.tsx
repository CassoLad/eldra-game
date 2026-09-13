import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArtworkCanvas, FullArtworkHotspot, FullArtworkScreen, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { TRAITS } from '@/game/newGameData';
import { useGameStore } from '@/store/gameStore';
const SCREENS = [require('../../assets/ported/menu/choose-journey-menu-highres.png'), require('../../assets/ported/menu/character-select-menu-highres.png'), require('../../assets/ported/menu/traits-menu-v2.png')];
const HERO_OPTIONS = [
  { name: 'Ranger', characterId: 'human-huntsman' },
  { name: 'Warrior', characterId: 'human-warrior' },
  { name: 'Mage', characterId: 'human-self-taught-mage' },
  { name: 'Rogue', characterId: 'human-rogue' },
] as const;
const HERO_PORTRAITS = [25.3, 38, 50.7, 63.4].map(left => ({ left, top: 66.5, width: 12.4, height: 7.2 }));
const JOURNEY_CARDS = [33.7, 44.0, 54.2].map(top => ({ left: 25.5, top, width: 49.5, height: 9.7 }));
const TRAIT_RECTS = [
  { left: 18, top: 28.6, width: 64, height: 10.5 },
  { left: 16.5, top: 41.0, width: 67, height: 15.0 },
  { left: 19, top: 59.0, width: 29, height: 14.0 },
  { left: 52, top: 59.0, width: 29, height: 14.0 },
];
export default function NewGameScreen() {
  const router = useRouter();
  const { newGame, isSaving } = useGameStore();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([0, 0, -1]);
  const [error, setError] = useState('');
  const beginning = useRef(false);
  const labels = [['Eldrane'], HERO_OPTIONS.map(hero => hero.name), TRAITS.slice(0, 4).map(trait => trait.name)];
  const back = () => step === 0 ? router.replace('/') : setStep(step - 1);
  const begin = async () => {
    if (beginning.current || isSaving) return;
    beginning.current = true; setError('');
    try {
      await newGame({ worldId: 'eldrane', characterId: HERO_OPTIONS[selected[1]].characterId, traitId: TRAITS[selected[2]].id });
      router.replace('/game');
    } catch { setError('Your journey could not be saved. Please try again.'); }
    finally { beginning.current = false; }
  };
  if (step === 3) return <ArtworkCanvas assets={[]}><Summary labels={labels.map((options, index) => options[selected[index]])} busy={isSaving} error={error} back={back} begin={begin} /></ArtworkCanvas>;
  if (step === 0) return <FullArtworkScreen key="choose-journey" accessibilityLabel="Choose Journey" source={SCREENS[0]}>
    <JourneyCard rect={JOURNEY_CARDS[0]} title="ELDRANE" subtitle="Begin your journey" disabled={isSaving} onPress={() => setStep(1)} />
    <JourneyCard rect={JOURNEY_CARDS[1]} title="COMING SOON" subtitle="A new land awaits" disabled />
    <JourneyCard rect={JOURNEY_CARDS[2]} title="COMING SOON" subtitle="A new story awaits" disabled />
    <FullArtworkHotspot accessibilityLabel="Back to main menu" disabled={isSaving} left={38.7} top={66} width={23} height={4.7} onPress={back} />
  </FullArtworkScreen>;
  if (step === 1) return <FullArtworkScreen key="character-select" accessibilityLabel="Character Select" source={SCREENS[1]}>
    <FullArtworkHotspot accessibilityLabel="Previous character" disabled={isSaving} left={20} top={46.5} width={16} height={8}
      onPress={() => setSelected(current => current.map((value, which) => which === 1 ? (value + HERO_OPTIONS.length - 1) % HERO_OPTIONS.length : value))} />
    <FullArtworkHotspot accessibilityLabel="Next character" disabled={isSaving} left={67} top={46.5} width={16} height={8}
      onPress={() => setSelected(current => current.map((value, which) => which === 1 ? (value + 1) % HERO_OPTIONS.length : value))} />
    {HERO_PORTRAITS.map((rect, index) => <FullArtworkHotspot key={index} accessibilityLabel={`Select ${HERO_OPTIONS[index].name}`}
      disabled={isSaving} selected={selected[1] === index} {...rect}
      onPress={() => setSelected(current => current.map((value, which) => which === 1 ? index : value))} />)}
    <FullArtworkHotspot accessibilityLabel="Back to Choose Journey" disabled={isSaving} left={19.5} top={89.8} width={29} height={5.2} onPress={back} />
    <FullArtworkHotspot accessibilityLabel="Confirm character" disabled={isSaving} left={53.5} top={89.8} width={30} height={5.2} onPress={() => setStep(2)} />
  </FullArtworkScreen>;
  return <FullArtworkScreen key="traits" accessibilityLabel="Choose your trait" source={SCREENS[2]}>
    <TraitsMenu selected={selected[2]} disabled={isSaving} back={back} continueToSummary={() => setStep(3)}
      select={index => setSelected(current => current.map((value, which) => which === 2 ? index : value))} />
  </FullArtworkScreen>;
}
function TraitsMenu({ selected, disabled, back, continueToSummary, select }: { selected: number; disabled: boolean; back: () => void; continueToSummary: () => void; select: (index: number) => void }) {
  const scale = useArtworkScale();
  return <>
    <Text style={[styles.traitHeading, { fontSize: 66 * scale }]}>CHOOSE YOUR TRAIT</Text>
    {TRAIT_RECTS.map((rect, index) => <TraitCard key={TRAITS[index].id} rect={rect} index={index}
      selected={selected === index} disabled={disabled} onPress={() => select(index)} />)}
    <Pressable accessibilityRole="button" accessibilityLabel="Back to character selection" disabled={disabled} onPress={back}
      style={({ pressed }) => [styles.traitNav, styles.traitBack, pressed && styles.traitNavPressed]}>
      <Text style={[styles.traitNavText, { fontSize: 39 * scale }]}>← BACK</Text>
    </Pressable>
    <Pressable accessibilityRole="button" accessibilityLabel="Continue to summary" disabled={disabled || selected < 0}
      accessibilityState={{ disabled: disabled || selected < 0 }} onPress={continueToSummary}
      style={({ pressed }) => [styles.traitNav, styles.traitContinue, selected < 0 && styles.traitNavDisabled, pressed && styles.traitNavPressed]}>
      <Text style={[styles.traitNavText, { fontSize: 39 * scale }]}>CONTINUE →</Text>
    </Pressable>
  </>;
}
function TraitCard({ rect, index, selected, disabled, onPress }: { rect: { left: number; top: number; width: number; height: number }; index: number; selected: boolean; disabled: boolean; onPress: () => void }) {
  const scale = useArtworkScale();
  const trait = TRAITS[index];
  const compact = index > 1;
  return <Pressable accessibilityRole="radio" accessibilityLabel={trait.name} accessibilityState={{ checked: selected, disabled }}
    disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.traitCard,
      { left: `${rect.left}%`, top: `${rect.top}%`, width: `${rect.width}%`, height: `${rect.height}%` },
      selected && styles.traitSelected, pressed && styles.traitCardPressed]}>
    <Text style={[styles.traitName, { fontSize: (compact ? 43 : 55) * scale }]}>{trait.name.toUpperCase()}</Text>
    <Text style={[styles.traitDescription, { fontSize: (compact ? 24 : 31) * scale }]}>{trait.description}</Text>
  </Pressable>;
}
function JourneyCard({ rect, title, subtitle, disabled, onPress }: { rect: { left: number; top: number; width: number; height: number }; title: string; subtitle: string; disabled: boolean; onPress?: () => void }) {
  const scale = useArtworkScale();
  return <Pressable accessibilityLabel={title} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={[styles.journeyCard, { left: `${rect.left}%`, top: `${rect.top}%`, width: `${rect.width}%`, height: `${rect.height}%` }]}>
    <Text style={[styles.journeyTitle, { fontSize: 72 * scale }]}>{title}</Text>
    <Text style={[styles.journeySubtitle, { fontSize: 34 * scale }]}>{subtitle}</Text>
  </Pressable>;
}
function Summary({ labels, busy, error, back, begin }: { labels: string[]; busy: boolean; error: string; back: () => void; begin: () => void }) {
  const scale = useArtworkScale();
  return <View style={styles.summary}>
    <Text style={[styles.progress, { fontSize: 25 * scale }]}>✓ WORLD    ✓ HERO    ✓ TRAIT    4 SUMMARY</Text>
    <Text style={[styles.title, { fontSize: 65 * scale }]}>JOURNEY SUMMARY</Text>
    <Text style={[styles.subtitle, { fontSize: 27 * scale }]}>One last look before the road begins.</Text>
    <View style={styles.card}>{labels.map((label, index) => <View key={index} style={styles.row}>
      <Text style={[styles.label, { fontSize: 35 * scale }]}>{['WORLD', 'HERO', 'TRAIT'][index]}</Text>
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
  journeyCard: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  journeyTitle: { color: GameColors.ink, fontFamily: GameFonts.display, textAlign: 'center' },
  journeySubtitle: { color: GameColors.ink, fontFamily: GameFonts.hand, textAlign: 'center' },
  traitHeading: { position: 'absolute', left: '23%', top: '18.5%', width: '54%', textAlign: 'center', color: GameColors.paperLight, fontFamily: GameFonts.display },
  traitCard: { position: 'absolute', alignItems: 'center', justifyContent: 'center', paddingHorizontal: '2%' },
  traitSelected: { borderColor: '#72507f', borderWidth: 3, borderRadius: 9 },
  traitCardPressed: { transform: [{ scale: 0.99 }] },
  traitName: { color: GameColors.ink, fontFamily: GameFonts.display, textAlign: 'center' },
  traitDescription: { color: GameColors.ink, fontFamily: GameFonts.hand, textAlign: 'center', marginTop: 6 },
  traitNav: { position: 'absolute', top: '77%', width: '28%', height: '4.3%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecd3a7', borderColor: '#4e3725', borderWidth: 2, borderRadius: 8 },
  traitBack: { left: '19%' },
  traitContinue: { right: '19%' },
  traitNavDisabled: { opacity: 0.55 },
  traitNavPressed: { transform: [{ scale: 0.985 }], backgroundColor: '#dbc099' },
  traitNavText: { color: GameColors.ink, fontFamily: GameFonts.display },
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
