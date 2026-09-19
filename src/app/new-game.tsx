import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArtworkCanvas, ArtworkImage, FullArtworkHotspot, FullArtworkScreen, useArtworkScale } from '@/components/menu/FullArtworkScreen';
import { MenuPieceConfig, useLayeredMenuTransition } from '@/components/menu/useLayeredMenuTransition';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { characterLayers, layeredMenuAssets, traitsLayers } from '@/game/layeredMenuAssets';
import { TRAITS } from '@/game/newGameData';
import { useGameStore } from '@/store/gameStore';
const JOURNEY_SCREEN = require('../../assets/ported/menu/choose-journey-menu-highres.png');
const HERO_INFO_BOARD = require('../../assets/ported/menu/character-info-board-blank.png');
const HUNTSMAN_NOTICE_BOARD = require('../../assets/ported/menu/huntsman-notice-board.png');
const HERO_BUTTONS = require('../../assets/ported/menu/character-select-buttons.png');
const HERO_CHARACTERS = [require('../../assets/ported/menu/huntsman-character.png'), require('../../assets/ported/menu/elf-archer-character.png')];
const HERO_PORTRAIT_IMAGES = [require('../../assets/ported/menu/huntsman-portrait.png'), require('../../assets/ported/menu/elf-archer-portrait.png')];
const TRANSITION_ARTWORK = [...layeredMenuAssets, ...HERO_CHARACTERS, ...HERO_PORTRAIT_IMAGES, HERO_INFO_BOARD, HUNTSMAN_NOTICE_BOARD, HERO_BUTTONS];
const CHARACTER_PIECES: MenuPieceConfig[] = [
  { id: 'header', direction: 'right', order: 0, weight: 'large', width: 610 },
  { id: 'character', direction: 'left', order: 1, weight: 'large', width: 250 },
  { id: 'paired-arrows', direction: 'left', order: 2, weight: 'small', width: 760 },
  { id: 'portrait-selector', direction: 'right', order: 3, weight: 'medium', width: 410 },
  { id: 'description', direction: 'left', order: 4, weight: 'large', width: 580 },
  { id: 'bottom-controls', direction: 'right', order: 5, weight: 'medium', width: 650 },
];
const TRAIT_PIECES: MenuPieceConfig[] = [
  { id: 'header', direction: 'right', order: 0, weight: 'large', width: 560 },
  { id: 'card-0', direction: 'left', order: 1, weight: 'medium', width: 600 },
  { id: 'card-1', direction: 'right', order: 2, weight: 'medium', width: 650 },
  { id: 'card-2', direction: 'left', order: 3, weight: 'medium', width: 300 },
  { id: 'card-3', direction: 'right', order: 4, weight: 'medium', width: 300 },
  { id: 'back', direction: 'left', order: 5, weight: 'small', width: 260 },
  { id: 'continue', direction: 'right', order: 5, weight: 'small', width: 260 },
];
const HERO_OPTIONS = [
  { name: 'Huntsman — Human', characterId: 'human-huntsman' },
  { name: 'Archer — Elf', characterId: 'elf-archer' },
] as const;
const HERO_PORTRAITS = [26.5, 39.3].map(left => ({ left, top: 62.0, width: 11.3, height: 6.9 }));
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
  const transition = useLayeredMenuTransition(CHARACTER_PIECES, TRAIT_PIECES, setStep);
  const transitioning = transition.phase !== 'idle';
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
  if (step === 0) return <FullArtworkScreen key="choose-journey" accessibilityLabel="Choose Journey" source={JOURNEY_SCREEN}>
    <JourneyCard rect={JOURNEY_CARDS[0]} title="ELDRANE" subtitle="Begin your journey" disabled={isSaving} onPress={() => setStep(1)} />
    <JourneyCard rect={JOURNEY_CARDS[1]} title="COMING SOON" subtitle="A new land awaits" disabled />
    <JourneyCard rect={JOURNEY_CARDS[2]} title="COMING SOON" subtitle="A new story awaits" disabled />
    <FullArtworkHotspot accessibilityLabel="Back to main menu" disabled={isSaving} left={38.7} top={66} width={23} height={4.7} onPress={back} />
  </FullArtworkScreen>;
  return <ArtworkCanvas assets={TRANSITION_ARTWORK}>
    <Animated.View pointerEvents={step === 1 && !transitioning ? 'auto' : 'none'}
      style={[styles.transitionScene, { opacity: transition.sceneOpacity(1), zIndex: step === 1 ? 2 : 1 }]}>
      <CharacterScene selected={selected[1]} disabled={isSaving || transitioning} pieceValue={id => transition.pieceValue(1, id)}
        select={index => setSelected(current => current.map((value, which) => which === 1 ? index : value))}
        back={back} confirm={() => transition.transitionTo(1, 2)} />
    </Animated.View>
    <Animated.View pointerEvents={step === 2 && !transitioning ? 'auto' : 'none'}
      style={[styles.transitionScene, { opacity: transition.sceneOpacity(2), zIndex: step === 2 ? 2 : 1 }]}>
      <TraitsScene selected={selected[2]} disabled={isSaving || transitioning} pieceValue={id => transition.pieceValue(2, id)}
        select={index => setSelected(current => current.map((value, which) => which === 2 ? index : value))}
        back={() => transition.transitionTo(2, 1)} continueToSummary={() => setStep(3)} />
    </Animated.View>
  </ArtworkCanvas>;
}
function ScenePiece({ value, children }: { value: Animated.Value; children: ReactNode }) {
  return <Animated.View pointerEvents="box-none" style={[styles.transitionPiece, { transform: [{ translateX: value }] }]}>{children}</Animated.View>;
}
function CharacterScene({ selected, disabled, pieceValue, select, back, confirm }: {
  selected: number; disabled: boolean; pieceValue: (id: string) => Animated.Value;
  select: (index: number) => void; back: () => void; confirm: () => void;
}) {
  return <>
    <ArtworkImage source={characterLayers.back} accessibilityLabel="Character Select" />
    <ScenePiece value={pieceValue('header')}><ArtworkImage source={characterLayers[25]} /><ArtworkImage source={characterLayers[24]} /></ScenePiece>
    <ArtworkImage source={characterLayers.mid} />
    <ScenePiece value={pieceValue('header')}><ArtworkImage source={characterLayers[18]} /><ArtworkImage source={characterLayers[17]} /><ArtworkImage source={characterLayers[16]} /></ScenePiece>
    <ScenePiece value={pieceValue('description')}><ArtworkImage source={characterLayers[14]} /></ScenePiece>
    <ScenePiece value={pieceValue('bottom-controls')}><ArtworkImage source={characterLayers[13]} /><ArtworkImage source={characterLayers[12]} /></ScenePiece>
    <ScenePiece value={pieceValue('portrait-selector')}>
      {[10, 9, 8, 7, 6, 4].map(index => <ArtworkImage key={index} source={characterLayers[index as keyof typeof characterLayers]} />)}
      {HERO_PORTRAIT_IMAGES.map((source, index) => <ArtworkImage key={`portrait-${index}`} source={source} />)}
      {HERO_PORTRAITS.map((rect, index) => <FullArtworkHotspot key={index} accessibilityLabel={`Select ${HERO_OPTIONS[index].name}`}
        disabled={disabled} {...rect} onPress={() => select(index)} />)}
    </ScenePiece>
    <ScenePiece value={pieceValue('character')}>
      {HERO_CHARACTERS.map((source, index) => <ArtworkImage key={`character-${index}`} source={source}
        accessibilityLabel={selected === index ? HERO_OPTIONS[index].name : undefined}
        style={{ opacity: selected === index ? 1 : 0 }} />)}
    </ScenePiece>
    <ScenePiece value={pieceValue('paired-arrows')}>
      <ArtworkImage source={characterLayers[1]} /><ArtworkImage source={characterLayers[0]} />
      <FullArtworkHotspot accessibilityLabel="Previous character" disabled={disabled} left={15.0} top={42.3} width={15.5} height={7.0}
        onPress={() => select((selected + HERO_OPTIONS.length - 1) % HERO_OPTIONS.length)} />
      <FullArtworkHotspot accessibilityLabel="Next character" disabled={disabled} left={72.5} top={42.3} width={15.5} height={7.0}
        onPress={() => select((selected + 1) % HERO_OPTIONS.length)} />
    </ScenePiece>
    <ScenePiece value={pieceValue('description')}>
      <ArtworkImage source={HUNTSMAN_NOTICE_BOARD} style={[styles.huntsmanNoticeBoard, { opacity: selected === 0 ? 1 : 0 }]} />
      <ArtworkImage source={HERO_INFO_BOARD} style={{ opacity: selected === 1 ? 1 : 0 }} />
      {selected === 1 && <CharacterDetails />}
    </ScenePiece>
    <ScenePiece value={pieceValue('bottom-controls')}>
      <ArtworkImage source={HERO_BUTTONS} />
      <FullArtworkHotspot accessibilityLabel="Back to Choose Journey" disabled={disabled} left={20.0} top={84.5} width={28.5} height={5.2} onPress={back} />
      <FullArtworkHotspot accessibilityLabel={`Confirm ${HERO_OPTIONS[selected].name}`} disabled={disabled} left={55.0} top={84.5} width={28.5} height={5.2} onPress={confirm} />
    </ScenePiece>
  </>;
}
function TraitsScene({ selected, disabled, pieceValue, select, back, continueToSummary }: {
  selected: number; disabled: boolean; pieceValue: (id: string) => Animated.Value;
  select: (index: number) => void; back: () => void; continueToSummary: () => void;
}) {
  const scale = useArtworkScale();
  const cards = [
    { index: 0, layers: [9, 8] },
    { index: 1, layers: [7, 6] },
    { index: 2, layers: [1, 0] },
    { index: 3, layers: [3, 2] },
  ];
  return <>
    <ArtworkImage source={traitsLayers.scenery} accessibilityLabel="Choose your trait" />
    <ScenePiece value={pieceValue('header')}>
      <ArtworkImage source={traitsLayers[5]} /><ArtworkImage source={traitsLayers[4]} />
      <Text style={[styles.traitHeading, { fontSize: 66 * scale }]}>CHOOSE YOUR TRAIT</Text>
    </ScenePiece>
    {cards.map(card => <ScenePiece key={card.index} value={pieceValue(`card-${card.index}`)}>
      {card.layers.map(index => <ArtworkImage key={index} source={traitsLayers[index as keyof typeof traitsLayers]} />)}
      <TraitCard rect={TRAIT_RECTS[card.index]} index={card.index} selected={selected === card.index}
        disabled={disabled} onPress={() => select(card.index)} />
    </ScenePiece>)}
    <ScenePiece value={pieceValue('back')}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to character selection" disabled={disabled} onPress={back}
        style={({ pressed }) => [styles.traitNav, styles.traitBack, pressed && styles.traitNavPressed]}>
        <Text style={[styles.traitNavText, { fontSize: 39 * scale }]}>← BACK</Text>
      </Pressable>
    </ScenePiece>
    <ScenePiece value={pieceValue('continue')}>
      <Pressable accessibilityRole="button" accessibilityLabel="Continue to summary" disabled={disabled || selected < 0}
        accessibilityState={{ disabled: disabled || selected < 0 }} onPress={continueToSummary}
        style={({ pressed }) => [styles.traitNav, styles.traitContinue, selected < 0 && styles.traitNavDisabled, pressed && styles.traitNavPressed]}>
        <Text style={[styles.traitNavText, { fontSize: 39 * scale }]}>CONTINUE →</Text>
      </Pressable>
    </ScenePiece>
  </>;
}
function CharacterDetails() {
  const scale = useArtworkScale();
  const features = [['➶', 'Ranged'], ['✦', 'High Mobility'], ['♣', 'Nature Bond']];
  return <View style={styles.heroInfoContent}>
    <Text style={[styles.heroName, { fontSize: 33 * scale }]}>Archer — Elf</Text>
    <Text style={[styles.heroDescription, { fontSize: 22 * scale }]}>A keen-eyed elf, skilled with bow and blade.</Text>
    <View style={styles.heroFeatures}>{features.map(([symbol, label]) => <View key={label} style={styles.heroFeature}>
      <Text style={[styles.heroFeatureIcon, { fontSize: 35 * scale }]}>{symbol}</Text>
      <Text style={[styles.heroFeatureLabel, { fontSize: 18 * scale }]}>{label}</Text>
    </View>)}</View>
  </View>;
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
  transitionScene: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  transitionPiece: { position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' },
  journeyCard: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  journeyTitle: { color: GameColors.ink, fontFamily: GameFonts.display, textAlign: 'center' },
  journeySubtitle: { color: GameColors.ink, fontFamily: GameFonts.hand, textAlign: 'center' },
  huntsmanNoticeBoard: { left: '19.5%', top: '69.7%', width: '61%', height: '14.8%' },
  heroInfoContent: { position: 'absolute', left: '27%', top: '71.2%', width: '46%', height: '10.2%', alignItems: 'center' },
  heroName: { color: '#3d2817', fontFamily: 'Georgia', fontWeight: 'bold', textAlign: 'center', width: '100%' },
  heroDescription: { color: '#3d2817', fontFamily: 'Georgia', textAlign: 'center', width: '100%', marginTop: 3, flex: 1 },
  heroFeatures: { width: '100%', height: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  heroFeature: { width: '33%', alignItems: 'center', justifyContent: 'center' },
  heroFeatureIcon: { color: '#423424', fontFamily: 'Georgia', textAlign: 'center' },
  heroFeatureLabel: { color: '#3d2817', fontFamily: 'Georgia', textAlign: 'center' },
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
