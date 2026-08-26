import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { CornerMotifs, DetailLine, MenuHeading, PaperScreen, SectionBrush } from '@/components/menu/MenuScaffold';
import { ChoiceChip, SelectionCard, SummaryLine, WizardButton, WizardProgress, WorldSelectionCard } from '@/components/newgame/NewGameUI';
import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import { BACKGROUNDS, CHARACTERS, CUSTOM_PORTRAITS, CUSTOM_ROLES, TRAITS, WORLDS } from '@/game/newGameData';
import { useGameStore } from '@/store/gameStore';

const STEP_LABELS = ['World', 'Hero', 'Past', 'Trait', 'Summary'];
const STEP_TITLES = ['Choose Your World', 'Choose Your Character', 'Choose Background', 'Choose Trait', 'Journey Summary'];
const STEP_SUBTITLES = [
  undefined,
  'Every journey needs a wanderer.',
  'What life did you leave behind?',
  'What quality guides your choices?',
  'One last look before the road begins.',
];

export default function NewGameScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { isSaving, newGame } = useGameStore();
  const [step, setStep] = useState(0);
  const [worldId, setWorldId] = useState<string | null>(null);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [backgroundId, setBackgroundId] = useState<string | null>(null);
  const [traitId, setTraitId] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customPortrait, setCustomPortrait] = useState<string | null>(null);
  const [customRole, setCustomRole] = useState<string | null>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const isWide = width >= 560;

  const world = useMemo(() => WORLDS.find((item) => item.id === worldId), [worldId]);
  const character = useMemo(() => CHARACTERS.find((item) => item.id === characterId), [characterId]);
  const background = useMemo(() => BACKGROUNDS.find((item) => item.id === backgroundId), [backgroundId]);
  const trait = useMemo(() => TRAITS.find((item) => item.id === traitId), [traitId]);
  const customReady = characterId === 'custom' && customName.trim().length > 0 && customPortrait && customRole;
  const characterName = characterId === 'custom' ? customName.trim() : character?.name;
  const characterRole = characterId === 'custom' ? customRole : character?.role;
  const canContinue = [Boolean(world), Boolean(character || customReady), Boolean(background), Boolean(trait), true][step];
  const isBusy = isBeginning || isSaving;

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
        {step === 0 ? (
          <View accessibilityRole="radiogroup" style={styles.list}>
            <WorldSelectionCard description={WORLDS[0].description} onPress={() => setWorldId(WORLDS[0].id)} selected={worldId === WORLDS[0].id} />
          </View>
        ) : null}

        {step === 1 ? (
          <>
            <View accessibilityRole="radiogroup" style={styles.grid}>
              {CHARACTERS.map((item) => (
                <SelectionCard
                  key={item.id}
                  accent={item.accent}
                  description={item.description}
                  detail={`${item.species} · ${item.role}`}
                  doodle={item.doodle}
                  name={item.name}
                  onPress={() => setCharacterId(item.id)}
                  selected={characterId === item.id}
                  style={isWide ? styles.gridCard : styles.fullCard}
                />
              ))}
              <SelectionCard
                accent="blue"
                description="Name, portrait, and role only."
                doodle="+"
                name="Create Your Own"
                onPress={() => setCharacterId('custom')}
                selected={characterId === 'custom'}
                style={isWide ? styles.gridCard : styles.fullCard}
              />
            </View>

            {character ? (
              <View style={[styles.characterProfile, SketchShadow]}>
                <SectionBrush>Role on the Road</SectionBrush>
                <Text style={styles.discoveryRole}>{character.discoveryRole}</Text>
                <View style={styles.strengthList}>
                  {character.strengths.map((strength) => <DetailLine key={strength} icon="—">{strength}</DetailLine>)}
                </View>
              </View>
            ) : null}

            {characterId === 'custom' ? (
              <View style={[styles.customPanel, SketchShadow]}>
                <SectionBrush>Your Wanderer</SectionBrush>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  accessibilityLabel="Character name"
                  autoCapitalize="words"
                  maxLength={24}
                  onChangeText={setCustomName}
                  placeholder="Write a name..."
                  placeholderTextColor={GameColors.lineSoft}
                  style={styles.nameInput}
                  value={customName}
                />

                <Text style={styles.fieldLabel}>Choose Portrait</Text>
                <View accessibilityRole="radiogroup" style={styles.portraitRow}>
                  {CUSTOM_PORTRAITS.map((portrait, index) => (
                    <Pressable
                      key={portrait}
                      accessibilityLabel={`Portrait ${index + 1}`}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: customPortrait === portrait }}
                      onPress={() => setCustomPortrait(portrait)}
                      style={({ pressed }) => [styles.portraitChoice, customPortrait === portrait && styles.portraitSelected, pressed && styles.pressed]}>
                      <Text style={styles.portraitDoodle}>{portrait}</Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>Choose Role</Text>
                <View accessibilityRole="radiogroup" style={styles.chipRow}>
                  {CUSTOM_ROLES.map((role) => <ChoiceChip key={role} label={role} onPress={() => setCustomRole(role)} selected={customRole === role} />)}
                </View>
              </View>
            ) : null}
          </>
        ) : null}

        {step === 2 ? (
          <View accessibilityRole="radiogroup" style={styles.grid}>
            {BACKGROUNDS.map((item) => (
              <SelectionCard
                key={item.id}
                accent={item.accent}
                description={item.description}
                doodle={item.doodle}
                name={item.name}
                onPress={() => setBackgroundId(item.id)}
                selected={backgroundId === item.id}
                style={isWide ? styles.gridCard : styles.fullCard}
              />
            ))}
          </View>
        ) : null}

        {step === 3 ? (
          <View accessibilityRole="radiogroup" style={styles.list}>
            {TRAITS.map((item) => (
              <SelectionCard
                key={item.id}
                accent={item.accent}
                description={item.description}
                doodle={item.doodle}
                name={item.name}
                onPress={() => setTraitId(item.id)}
                selected={traitId === item.id}
              />
            ))}
          </View>
        ) : null}

        {step === 4 ? (
          <View style={[styles.summaryCard, SketchShadow]}>
            <View style={styles.summaryWash}><Text style={styles.summaryDoodle}>{customPortrait ?? character?.doodle ?? '✦'}</Text></View>
            <Text style={styles.summaryTitle}>{characterName}</Text>
            <Text style={styles.summarySubtitle}>The road waits. Your choices will write the rest.</Text>
            <View style={styles.summaryDetails}>
              <SummaryLine label="World" value={world?.name ?? '—'} />
              <SummaryLine label="Character" value={characterName ?? '—'} />
              <SummaryLine label="Role" value={characterRole ?? '—'} />
              <SummaryLine label="Background" value={background?.name ?? '—'} />
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
