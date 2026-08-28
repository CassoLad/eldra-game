import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { FullArtworkHotspot, FullArtworkScreen, FullArtworkSwapButton } from '@/components/menu/FullArtworkScreen';
import { CornerMotifs, MenuHeading, PaperScreen } from '@/components/menu/MenuScaffold';
import { SummaryLine, WizardButton, WizardProgress } from '@/components/newgame/NewGameUI';
import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import { CHARACTERS, TRAITS, WORLDS } from '@/game/newGameData';
import { useGameStore } from '@/store/gameStore';

const STEP_LABELS = ['World', 'Hero', 'Trait', 'Summary'];
const STEP_TITLES = ['Choose Your World', 'Choose Your Character', 'Choose Trait', 'Journey Summary'];
const STEP_SUBTITLES = [
  undefined,
  'Every journey needs a wanderer.',
  'What quality guides your choices?',
  'One last look before the road begins.',
];

const WORLD_SCREEN = require('../../assets/menu-art/world-screen-clean.png');
const WORLD_CONTINUE_A = require('../../assets/menu-art/buttons/world-continue-a-final.png');
const WORLD_CONTINUE_B = require('../../assets/menu-art/buttons/world-continue-b-final.png');
const HERO_SCREEN = require('../../assets/menu-art/hero-screen-clean.png');
const TRAIT_SCREEN = require('../../assets/menu-art/trait-screen-final.png');

const HERO_CARD_LAYOUTS = [
  { height: 15.5, left: 4, top: 38.8, width: 92 },
  { height: 15, left: 4, top: 55.1, width: 92 },
  { height: 15, left: 4, top: 70.7, width: 92 },
] as const;

const TRAIT_CARD_LAYOUTS = [
  { height: 10.8, left: 14.8, top: 44.8, width: 70.4 },
  { height: 10.8, left: 14.8, top: 57.7, width: 70.4 },
  { height: 10.8, left: 14.8, top: 70.3, width: 70.4 },
  { height: 10.8, left: 14.8, top: 82.9, width: 70.4 },
] as const;

export default function NewGameScreen() {
  const router = useRouter();
  const { isSaving, newGame } = useGameStore();
  const [step, setStep] = useState(0);
  const [worldId, setWorldId] = useState<string | null>(WORLDS[0].id);
  const [characterId, setCharacterId] = useState<string | null>(CHARACTERS[0].id);
  const [traitId, setTraitId] = useState<string | null>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const [isWorldScreenReady, setIsWorldScreenReady] = useState(false);
  const [isHeroScreenReady, setIsHeroScreenReady] = useState(false);
  const [isTraitScreenReady, setIsTraitScreenReady] = useState(false);
  const loadedWorldAssetGroups = useRef(new Set<string>());
  const loadedHeroAssetGroups = useRef(new Set<string>());
  const world = useMemo(() => WORLDS.find((item) => item.id === worldId), [worldId]);
  const character = useMemo(() => CHARACTERS.find((item) => item.id === characterId), [characterId]);
  const trait = useMemo(() => TRAITS.find((item) => item.id === traitId), [traitId]);
  const characterName = character?.name;
  const characterRole = character?.role;
  const canContinue = [Boolean(world), Boolean(character), Boolean(trait), true][step];
  const isBusy = isBeginning || isSaving;

  const markWorldAssetGroupLoaded = (group: string) => {
    loadedWorldAssetGroups.current.add(group);
    if (loadedWorldAssetGroups.current.size === 2) {
      setIsWorldScreenReady(true);
    }
  };

  const markHeroAssetGroupLoaded = (group: string) => {
    loadedHeroAssetGroups.current.add(group);
    if (loadedHeroAssetGroups.current.size === 2) {
      setIsHeroScreenReady(true);
    }
  };

  const goBack = () => {
    if (step === 0) return router.replace('/');
    setStep((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    if (!canContinue || step >= STEP_LABELS.length - 1) return;
    setStep((current) => current + 1);
  };

  const beginJourney = async () => {
    if (isBusy) return;
    setIsBeginning(true);
    await newGame();
    router.replace('/game');
  };

  const chooseHero = (id: string) => {
    if (isBusy) return;
    setCharacterId(id);
  };

  if (step === 0) {
    return (
      <FullArtworkScreen accessibilityLabel="Choose your world: Eldrane" onArtworkLoad={() => markWorldAssetGroupLoaded('artwork')} source={WORLD_SCREEN}>
        <FullArtworkHotspot accessibilityLabel="Back to main menu" disabled={isBusy} height={5.5} left={5} onPress={goBack} top={6.6} width={18} />
        <FullArtworkHotspot accessibilityLabel="Select Eldrane" disabled={isBusy} height={48} left={8.5} onPress={() => setWorldId(WORLDS[0].id)} top={34.4} width={83} />
        <FullArtworkSwapButton accessibilityLabel="Continue Journey" disabled={isBusy} height={8.46} left={5.99} normalSource={WORLD_CONTINUE_A} onAssetsLoaded={() => markWorldAssetGroupLoaded('button')} onPress={goNext} pressedSource={WORLD_CONTINUE_B} top={85.9} width={88.01} />
        {!isWorldScreenReady ? <View pointerEvents="auto" style={styles.artworkLoadingCover} /> : null}
      </FullArtworkScreen>
    );
  }

  if (step === 1) {
    const selectedHeroIndex = CHARACTERS.findIndex((item) => item.id === characterId);
    const selectedHeroLayout = HERO_CARD_LAYOUTS[selectedHeroIndex];

    return (
      <FullArtworkScreen accessibilityLabel="Choose your hero" onArtworkLoad={() => markHeroAssetGroupLoaded('artwork')} source={HERO_SCREEN}>
        <Image onLoad={() => setIsTraitScreenReady(true)} source={TRAIT_SCREEN} style={styles.hiddenPreload} />
        <FullArtworkHotspot accessibilityLabel="Previous step" disabled={isBusy} height={9} left={5} onPress={goBack} top={5} width={20} />
        <FullArtworkHotspot accessibilityLabel="Choose Human Huntsman" disabled={isBusy} height={HERO_CARD_LAYOUTS[0].height} left={HERO_CARD_LAYOUTS[0].left} onPress={() => chooseHero(CHARACTERS[0].id)} top={HERO_CARD_LAYOUTS[0].top} width={HERO_CARD_LAYOUTS[0].width} />
        <FullArtworkHotspot accessibilityLabel="Choose Human Self-Taught Mage" disabled={isBusy} height={HERO_CARD_LAYOUTS[1].height} left={HERO_CARD_LAYOUTS[1].left} onPress={() => chooseHero(CHARACTERS[1].id)} top={HERO_CARD_LAYOUTS[1].top} width={HERO_CARD_LAYOUTS[1].width} />
        <FullArtworkHotspot accessibilityLabel="Choose Elf Relic Builder" disabled={isBusy} height={HERO_CARD_LAYOUTS[2].height} left={HERO_CARD_LAYOUTS[2].left} onPress={() => chooseHero(CHARACTERS[2].id)} top={HERO_CARD_LAYOUTS[2].top} width={HERO_CARD_LAYOUTS[2].width} />
        {selectedHeroLayout ? (
          <View
            pointerEvents="none"
            style={[
              styles.artworkSelection,
              {
                height: `${selectedHeroLayout.height}%`,
                left: `${selectedHeroLayout.left}%`,
                top: `${selectedHeroLayout.top}%`,
                width: `${selectedHeroLayout.width}%`,
              },
            ]}
          />
        ) : null}
        <FullArtworkSwapButton accessibilityLabel="Continue with selected hero" disabled={isBusy || !characterId} height={8.46} left={5.99} normalSource={WORLD_CONTINUE_A} onAssetsLoaded={() => markHeroAssetGroupLoaded('button')} onPress={goNext} pressedSource={WORLD_CONTINUE_B} top={86.3} width={88.01} />
        {!isHeroScreenReady ? <View pointerEvents="auto" style={styles.artworkLoadingCover} /> : null}
      </FullArtworkScreen>
    );
  }

  if (step === 2) {
    const visibleTraits = TRAITS.slice(0, TRAIT_CARD_LAYOUTS.length);
    const selectedTraitIndex = visibleTraits.findIndex((item) => item.id === traitId);
    const selectedTraitLayout = TRAIT_CARD_LAYOUTS[selectedTraitIndex];

    return (
      <FullArtworkScreen accessibilityLabel="Choose your trait" artworkHeight={1844} artworkWidth={853} onArtworkLoad={() => setIsTraitScreenReady(true)} source={TRAIT_SCREEN}>
        <FullArtworkHotspot accessibilityLabel="Previous step" disabled={isBusy} height={7} left={9} onPress={goBack} top={9.8} width={17} />
        {visibleTraits.map((item, index) => {
          const layout = TRAIT_CARD_LAYOUTS[index];
          return (
            <FullArtworkHotspot
              accessibilityLabel={`Choose ${item.name}`}
              disabled={isBusy}
              height={layout.height}
              key={item.id}
              left={layout.left}
              onPress={() => setTraitId(item.id)}
              top={layout.top}
              width={layout.width}
            />
          );
        })}
        {selectedTraitLayout ? (
          <View
            pointerEvents="none"
            style={[
              styles.artworkSelection,
              {
                height: `${selectedTraitLayout.height}%`,
                left: `${selectedTraitLayout.left}%`,
                top: `${selectedTraitLayout.top}%`,
                width: `${selectedTraitLayout.width}%`,
              },
            ]}
          />
        ) : null}
        <FullArtworkHotspot accessibilityLabel="Continue to summary" disabled={isBusy || !traitId} height={8} left={74} onPress={goNext} top={15.3} width={18} />
        {!isTraitScreenReady ? <View pointerEvents="auto" style={styles.artworkLoadingCover} /> : null}
      </FullArtworkScreen>
    );
  }

  return (
    <PaperScreen key={step} contentStyle={styles.page}>
      <View style={styles.topRow}>
        <Pressable accessibilityLabel={step === 0 ? 'Back to main menu' : 'Previous step'} accessibilityRole="button" disabled={isBusy} onPress={goBack} style={({ pressed }) => [styles.topBack, pressed && styles.pressed]}>
          <Text style={styles.topBackText}>←</Text>
        </Pressable>
        <CornerMotifs />
      </View>

      <WizardProgress current={step} labels={STEP_LABELS} />
      <MenuHeading title={STEP_TITLES[step]} subtitle={STEP_SUBTITLES[step]} />

      <View style={styles.content}>
        {step === 3 ? (
          <View style={[styles.summaryCard, SketchShadow]}>
            <View style={styles.summaryWash}><Text style={styles.summaryDoodle}>{character?.doodle ?? '✦'}</Text></View>
            <Text style={styles.summaryTitle}>{characterName}</Text>
            <Text style={styles.summarySubtitle}>The road waits. Your choices will write the rest.</Text>
            <View style={styles.summaryDetails}>
              <SummaryLine label="World" value={world?.name ?? '—'} />
              <SummaryLine label="Character" value={characterName ?? '—'} />
              <SummaryLine label="Role" value={characterRole ?? '—'} />
              <SummaryLine label="Trait" value={trait?.name ?? '—'} />
            </View>
            <View style={styles.summaryRule}><View style={styles.rule} /><Text style={styles.diamond}>◇</Text><View style={styles.rule} /></View>
            <Text style={styles.summaryNote}>These choices are local placeholders for the New Game flow.</Text>
          </View>
        ) : null}

        <View style={styles.footer}>
          {step > 0 ? <WizardButton direction="back" disabled={isBusy} label="Back" onPress={goBack} /> : <View />}
          {step < STEP_LABELS.length - 1 ? (
            <WizardButton direction="next" disabled={!canContinue || isBusy} label="Continue" onPress={goNext} primary />
          ) : (
            <WizardButton direction="next" disabled={isBusy} label="Begin Journey" onPress={beginJourney} primary />
          )}
        </View>
        {isBusy ? <ActivityIndicator color={GameColors.markerGreen} style={styles.loader} /> : null}
      </View>
    </PaperScreen>
  );
}

const styles = StyleSheet.create({
  artworkLoadingCover: { backgroundColor: GameColors.paper, bottom: 0, left: 0, position: 'absolute', right: 0, top: 0, zIndex: 100 },
  artworkSelection: { backgroundColor: 'transparent', borderColor: '#72507f', borderRadius: 7, borderWidth: 3, position: 'absolute' },
  hiddenPreload: { height: 1, opacity: 0, position: 'absolute', width: 1 },
  page: { paddingHorizontal: 18 },
  topRow: { minHeight: 54 },
  topBack: { alignItems: 'center', height: 48, justifyContent: 'center', left: 0, position: 'absolute', top: 0, width: 52, zIndex: 2 },
  topBackText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 44 },
  content: { alignSelf: 'center', maxWidth: 560, width: '100%' },
  list: { gap: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { width: '48.7%' },
  fullCard: { width: '100%' },
  customPanel: { backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 8, borderWidth: 1.5, marginTop: 18, padding: 16 },
  characterProfile: { backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 8, borderWidth: 1.5, marginTop: 18, padding: 16 },
  discoveryRole: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 13, lineHeight: 20 },
  strengthList: { borderTopColor: GameColors.lineSoft, borderTopWidth: 1, marginTop: 12, paddingTop: 7 },
  fieldLabel: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 23, letterSpacing: 1, marginBottom: 5, marginTop: 12, textTransform: 'uppercase' },
  nameInput: { backgroundColor: GameColors.paper, borderBottomColor: GameColors.ink, borderBottomWidth: 1.5, color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 17, minHeight: 46, paddingHorizontal: 10, paddingVertical: 8 },
  portraitRow: { flexDirection: 'row', gap: 12 },
  portraitChoice: { alignItems: 'center', backgroundColor: GameColors.paper, borderColor: GameColors.inkMuted, borderRadius: 38, borderStyle: 'dashed', borderWidth: 1.5, height: 68, justifyContent: 'center', width: 68 },
  portraitSelected: { backgroundColor: GameColors.markerBlueWash, borderStyle: 'solid', borderWidth: 2.5 },
  portraitDoodle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 38 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  summaryCard: { alignSelf: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 9, borderWidth: 1.5, maxWidth: 500, padding: 18, width: '100%' },
  summaryWash: { alignItems: 'center', alignSelf: 'center', backgroundColor: GameColors.markerGreenWash, height: 78, justifyContent: 'center', transform: [{ rotate: '-4deg' }], width: 88 },
  summaryDoodle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 48 },
  summaryTitle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 43, letterSpacing: 2, lineHeight: 48, marginTop: 12, textAlign: 'center', textTransform: 'uppercase' },
  summarySubtitle: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 13, lineHeight: 19, textAlign: 'center' },
  summaryDetails: { marginTop: 18 },
  summaryRule: { alignItems: 'center', flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 19 },
  rule: { backgroundColor: GameColors.lineSoft, height: 1, width: 62 },
  diamond: { color: GameColors.ink, fontSize: 14 },
  summaryNote: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 10, marginTop: 9, textAlign: 'center' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginTop: 26 },
  loader: { marginTop: 14 },
  pressed: { opacity: 0.7, transform: [{ translateY: 1 }] },
});
