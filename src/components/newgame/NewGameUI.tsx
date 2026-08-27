import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import type { Accent } from '@/game/newGameData';

export const accentWash: Record<Accent, string> = {
  blue: GameColors.markerBlueWash,
  gold: GameColors.markerGoldWash,
  green: GameColors.markerGreenWash,
  plum: '#DED0E1',
  red: GameColors.markerRedWash,
};

export function WizardProgress({ current, labels }: { current: number; labels: string[] }) {
  return (
    <View accessibilityLabel={`Step ${current + 1} of ${labels.length}: ${labels[current]}`} style={styles.progressWrap}>
      <View style={styles.progressLine} />
      {labels.map((label, index) => {
        const active = index === current;
        const complete = index < current;
        return (
          <View key={label} style={styles.progressStep}>
            <View style={[styles.progressDot, (active || complete) && styles.progressDotFilled, active && styles.progressDotActive]}>
              <Text style={[styles.progressNumber, (active || complete) && styles.progressNumberFilled]}>{complete ? '✓' : index + 1}</Text>
            </View>
            <Text numberOfLines={1} style={[styles.progressLabel, active && styles.progressLabelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

type SelectionCardProps = {
  accent: Accent;
  children?: ReactNode;
  description: string;
  detail?: string;
  doodle: string;
  name: string;
  onPress: () => void;
  selected: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SelectionCard({ accent, children, description, detail, doodle, name, onPress, selected, style }: SelectionCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, SketchShadow, selected && styles.cardSelected, pressed && styles.pressed, style]}>
      {selected ? <View pointerEvents="none" style={[styles.selectedWash, { backgroundColor: accentWash[accent] }]} /> : null}
      <View style={[styles.doodleWash, { backgroundColor: accentWash[accent] }]}><Text style={styles.doodle}>{doodle}</Text></View>
      <View style={styles.cardCopy}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{name}</Text>
          {selected ? <Text style={styles.check}>✓</Text> : null}
        </View>
        <Text style={styles.cardDescription}>{description}</Text>
        {detail ? <Text style={styles.cardDetail}>{detail}</Text> : null}
        {children}
      </View>
    </Pressable>
  );
}

export function WorldSelectionCard({ description, onPress, selected }: { description: string; onPress: () => void; selected: boolean }) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.worldCard, SketchShadow, selected && styles.cardSelected, pressed && styles.pressed]}>
      {selected ? <View pointerEvents="none" style={[styles.selectedWash, { backgroundColor: GameColors.markerGreenWash }]} /> : null}
      <View pointerEvents="none" style={styles.worldArt}>
        <View style={styles.worldGreenWash} />
        <View style={styles.worldBlueWash} />
        <View style={styles.worldGoldWash} />
        <Text style={styles.worldStarLeft}>✦</Text>
        <Text style={styles.worldMoon}>☾</Text>
        <Text style={styles.mountainLine}>／＼      ／＼</Text>
        <Text style={styles.ruin}>♜</Text>
        <View style={styles.horizonLine} />
        <Text style={styles.roadLine}>⌁      ╲  ╱      ⌁</Text>
      </View>
      <View style={styles.worldCopy}>
        <View style={styles.worldTitleRow}>
          <Text style={styles.worldTitle}>ELDRANE</Text>
          {selected ? <Text style={styles.worldCheck}>✓</Text> : null}
        </View>
        <View style={styles.worldRule} />
        <Text style={styles.worldDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

export function ChoiceChip({ label, onPress, selected }: { label: string; onPress: () => void; selected: boolean }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function WizardButton({ direction, disabled = false, label, onPress, primary = false }: { direction?: 'back' | 'next'; disabled?: boolean; label: string; onPress: () => void; primary?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.wizardButton, primary && styles.primaryButton, disabled && styles.disabled, pressed && !disabled && styles.pressed]}>
      {direction === 'back' ? <Text style={[styles.buttonArrow, primary && styles.primaryText]}>←</Text> : null}
      <Text style={[styles.buttonText, primary && styles.primaryText]}>{label}</Text>
      {direction === 'next' ? <Text style={[styles.buttonArrow, primary && styles.primaryText]}>→</Text> : null}
    </Pressable>
  );
}

export function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <View style={styles.summaryDots} />
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressWrap: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginHorizontal: 4, position: 'relative' },
  progressLine: { backgroundColor: GameColors.lineSoft, height: 1, left: '9%', position: 'absolute', right: '9%', top: 14 },
  progressStep: { alignItems: 'center', maxWidth: 74, width: '19%' },
  progressDot: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.inkMuted, borderRadius: 15, borderWidth: 1, height: 29, justifyContent: 'center', width: 29 },
  progressDotFilled: { backgroundColor: GameColors.ink, borderColor: GameColors.ink },
  progressDotActive: { borderColor: GameColors.markerPlum, borderWidth: 3, transform: [{ rotate: '-4deg' }] },
  progressNumber: { color: GameColors.inkMuted, fontFamily: GameFonts.handBold, fontSize: 10 },
  progressNumberFilled: { color: GameColors.paperLight },
  progressLabel: { color: GameColors.inkMuted, fontFamily: GameFonts.display, fontSize: 14, letterSpacing: 0.5, marginTop: 4, textAlign: 'center', textTransform: 'uppercase' },
  progressLabelActive: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 16 },
  card: { backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 8, borderWidth: 1.5, flexDirection: 'row', minHeight: 112, overflow: 'hidden', padding: 12, position: 'relative' },
  cardSelected: { borderWidth: 2.5 },
  selectedWash: { bottom: 0, left: 0, opacity: 0.42, position: 'absolute', top: 0, width: 10 },
  doodleWash: { alignItems: 'center', height: 68, justifyContent: 'center', marginRight: 13, transform: [{ rotate: '-4deg' }], width: 68 },
  doodle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 42, lineHeight: 48 },
  cardCopy: { flex: 1, justifyContent: 'center' },
  cardTitleRow: { alignItems: 'center', flexDirection: 'row' },
  cardTitle: { color: GameColors.ink, flex: 1, fontFamily: GameFonts.display, fontSize: 31, letterSpacing: 1, lineHeight: 34, textTransform: 'uppercase' },
  check: { color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 18, marginLeft: 8 },
  cardDescription: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 12, lineHeight: 17 },
  cardDetail: { alignSelf: 'flex-start', color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 10, marginTop: 6, textTransform: 'uppercase' },
  worldCard: { backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 9, borderWidth: 1.5, overflow: 'hidden', padding: 15, position: 'relative' },
  worldArt: { alignSelf: 'center', height: 185, maxWidth: 430, overflow: 'hidden', position: 'relative', width: '100%' },
  worldGreenWash: { backgroundColor: GameColors.markerGreenWash, borderRadius: 70, bottom: 18, height: 74, left: 18, opacity: 0.72, position: 'absolute', transform: [{ rotate: '-8deg' }], width: 154 },
  worldBlueWash: { backgroundColor: GameColors.markerBlueWash, borderRadius: 60, height: 64, opacity: 0.72, position: 'absolute', right: 28, top: 25, transform: [{ rotate: '7deg' }], width: 130 },
  worldGoldWash: { backgroundColor: GameColors.markerGoldWash, bottom: 6, height: 22, left: '38%', opacity: 0.75, position: 'absolute', transform: [{ rotate: '-7deg' }], width: 120 },
  worldStarLeft: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 24, left: 22, position: 'absolute', top: 13, transform: [{ rotate: '-8deg' }] },
  worldMoon: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 28, position: 'absolute', right: 24, top: 10, transform: [{ rotate: '8deg' }] },
  mountainLine: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 36, left: 30, letterSpacing: 3, position: 'absolute', right: 28, textAlign: 'center', top: 44, transform: [{ rotate: '-1deg' }] },
  ruin: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 55, left: '44%', position: 'absolute', top: 48, transform: [{ rotate: '2deg' }] },
  horizonLine: { backgroundColor: GameColors.ink, bottom: 50, height: 1.5, left: 22, opacity: 0.8, position: 'absolute', right: 22, transform: [{ rotate: '-1deg' }] },
  roadLine: { bottom: 13, color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 21, left: 18, position: 'absolute', right: 18, textAlign: 'center' },
  worldCopy: { paddingHorizontal: 3, paddingBottom: 5 },
  worldTitleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  worldTitle: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 43, letterSpacing: 3, lineHeight: 48, textAlign: 'center' },
  worldCheck: { color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 18, marginLeft: 12 },
  worldRule: { alignSelf: 'center', backgroundColor: GameColors.lineSoft, height: 1, marginBottom: 13, marginTop: 3, width: 90 },
  worldDescription: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.72, transform: [{ translateY: 1 }] },
  chip: { backgroundColor: GameColors.paperLight, borderColor: GameColors.inkMuted, borderRadius: 5, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 7 },
  chipSelected: { backgroundColor: GameColors.ink, borderColor: GameColors.ink },
  chipText: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 12 },
  chipTextSelected: { color: GameColors.paperLight, fontFamily: GameFonts.handBold },
  wizardButton: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 6, borderWidth: 1.5, flexDirection: 'row', justifyContent: 'center', minHeight: 48, minWidth: 122, paddingHorizontal: 16 },
  primaryButton: { backgroundColor: GameColors.charcoal, minWidth: 158 },
  buttonText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 25, letterSpacing: 1.1, lineHeight: 29, textTransform: 'uppercase' },
  primaryText: { color: GameColors.paperLight },
  buttonArrow: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 20, marginHorizontal: 7 },
  disabled: { opacity: 0.3 },
  summaryLine: { alignItems: 'flex-end', borderBottomColor: GameColors.lineSoft, borderBottomWidth: 1, flexDirection: 'row', minHeight: 49, paddingVertical: 9 },
  summaryLabel: { color: GameColors.inkMuted, fontFamily: GameFonts.display, fontSize: 22, letterSpacing: 1, textTransform: 'uppercase' },
  summaryDots: { borderBottomColor: GameColors.lineSoft, borderBottomWidth: 1, borderStyle: 'dotted', flex: 1, marginBottom: 6, marginHorizontal: 10 },
  summaryValue: { color: GameColors.ink, flexShrink: 1, fontFamily: GameFonts.handBold, fontSize: 14, textAlign: 'right' },
});
