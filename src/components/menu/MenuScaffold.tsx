import type { PropsWithChildren, ReactNode } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';

export function PaperScreen({
  children,
  contentStyle,
}: PropsWithChildren<{ contentStyle?: StyleProp<ViewStyle> }>) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.page, contentStyle]}>
          <View pointerEvents="none" style={styles.innerFrame} />
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function CornerMotifs() {
  return (
    <View pointerEvents="none" style={styles.motifRow}>
      <View style={[styles.motifWash, styles.goldWash]}><Text style={styles.motif}>✦</Text></View>
      <View style={[styles.motifWash, styles.plumWash]}><Text style={styles.motif}>☾</Text></View>
    </View>
  );
}

export function MenuHeading({
  dark = false,
  large = false,
  subtitle,
  title,
}: {
  dark?: boolean;
  large?: boolean;
  subtitle?: string;
  title: string;
}) {
  return (
    <View style={styles.headingGroup}>
      <View style={[styles.headingPlate, dark && styles.darkHeadingPlate]}>
        <Text style={[styles.heading, large && styles.largeHeading, dark && styles.darkHeading]}>{title}</Text>
      </View>
      <View style={styles.ruleRow}><View style={styles.rule} /><Text style={styles.diamond}>◇</Text><View style={styles.rule} /></View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

type SketchMenuButtonProps = {
  accent?: 'gold' | 'green' | 'plum' | 'red';
  disabled?: boolean;
  icon: string;
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  subtitle?: string;
};

export function SketchMenuButton({
  accent = 'green', disabled = false, icon, label, onPress, showArrow = false, subtitle,
}: SketchMenuButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuButton,
        SketchShadow,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}>
      <View style={[styles.buttonIconWash, accentStyles[accent]]}><Text style={styles.buttonIcon}>{icon}</Text></View>
      <View style={styles.buttonCopy}>
        <Text style={styles.buttonLabel}>{label}</Text>
        {subtitle ? <Text style={styles.buttonSubtitle}>{subtitle}</Text> : null}
      </View>
      {showArrow ? <Text style={styles.arrow}>→</Text> : null}
    </Pressable>
  );
}

export function JourneyEmblem({
  empty = false,
  label,
  compact = false,
}: {
  empty?: boolean;
  label?: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.emblemWrap, compact && styles.emblemCompact]}>
      <View style={[styles.emblemWash, empty && styles.emblemEmpty]}>
        <Text style={[styles.emblemIcon, empty && styles.emblemPlus]}>{empty ? '+' : '✦'}</Text>
      </View>
      {label ? <Text style={styles.emblemLabel}>{label}</Text> : null}
    </View>
  );
}

export function DetailLine({ children, icon }: { children: ReactNode; icon: string }) {
  return (
    <View style={styles.detailLine}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <Text style={styles.detailText}>{children}</Text>
    </View>
  );
}

export function SectionBrush({ children }: PropsWithChildren) {
  return <View style={styles.sectionBrush}><Text style={styles.sectionBrushText}>{children}</Text></View>;
}

const accentStyles = StyleSheet.create({
  gold: { backgroundColor: GameColors.markerGoldWash },
  green: { backgroundColor: GameColors.markerGreenWash },
  plum: { backgroundColor: '#DED0E1' },
  red: { backgroundColor: GameColors.markerRedWash },
});

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: GameColors.paperDeep },
  scrollContent: { flexGrow: 1, alignItems: 'center', padding: 8 },
  page: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 680,
    minHeight: '100%',
    backgroundColor: GameColors.paper,
    borderColor: GameColors.ink,
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 22,
    paddingBottom: 32,
    paddingTop: 24,
    overflow: 'hidden',
  },
  innerFrame: {
    bottom: 0,
    borderColor: GameColors.lineSoft,
    borderRadius: 14,
    borderWidth: 1,
    left: 0,
    margin: 5,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  motifRow: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 50, paddingHorizontal: 12 },
  motifWash: { alignItems: 'center', height: 46, justifyContent: 'center', width: 54 },
  goldWash: { backgroundColor: GameColors.markerGoldWash, transform: [{ rotate: '-5deg' }] },
  plumWash: { backgroundColor: '#DED0E1', transform: [{ rotate: '5deg' }] },
  motif: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 38, lineHeight: 42 },
  headingGroup: { alignItems: 'center', marginBottom: 24 },
  headingPlate: { paddingHorizontal: 18, paddingVertical: 4 },
  darkHeadingPlate: { backgroundColor: GameColors.charcoal, paddingHorizontal: 34, transform: [{ rotate: '-1deg' }] },
  heading: {
    color: GameColors.ink,
    fontFamily: GameFonts.display,
    fontSize: 48,
    fontWeight: '500',
    letterSpacing: 2.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  largeHeading: { fontSize: 72, letterSpacing: 4 },
  darkHeading: { color: GameColors.paperLight },
  ruleRow: { alignItems: 'center', flexDirection: 'row', gap: 9, justifyContent: 'center', marginTop: 8 },
  rule: { backgroundColor: GameColors.lineSoft, height: 1, width: 78 },
  diamond: { color: GameColors.ink, fontSize: 15 },
  subtitle: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 16, letterSpacing: 0.5, marginTop: 9, textAlign: 'center' },
  menuButton: {
    alignItems: 'center',
    backgroundColor: GameColors.paperLight,
    borderColor: GameColors.ink,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    minHeight: 70,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pressed: { opacity: 0.75, transform: [{ translateY: 2 }] },
  disabled: { opacity: 0.42 },
  buttonIconWash: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: 14, transform: [{ rotate: '-4deg' }], width: 50 },
  buttonIcon: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 28 },
  buttonCopy: { flex: 1 },
  buttonLabel: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 31, letterSpacing: 1.3, lineHeight: 35, textTransform: 'uppercase' },
  buttonSubtitle: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 14, marginTop: 3 },
  arrow: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 28, marginLeft: 8 },
  emblemWrap: { alignItems: 'center', justifyContent: 'center', minHeight: 132, width: 132 },
  emblemCompact: { minHeight: 92, width: 92 },
  emblemWash: {
    alignItems: 'center',
    backgroundColor: GameColors.markerGreenWash,
    borderColor: GameColors.ink,
    borderRadius: 54,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    height: 82,
    justifyContent: 'center',
    transform: [{ rotate: '-3deg' }],
    width: 82,
  },
  emblemEmpty: { backgroundColor: 'transparent' },
  emblemIcon: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 38 },
  emblemPlus: { fontSize: 42, fontWeight: '300' },
  emblemLabel: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 9, letterSpacing: 1, marginTop: 7, textAlign: 'center', textTransform: 'uppercase' },
  detailLine: { alignItems: 'flex-start', flexDirection: 'row', marginTop: 5 },
  detailIcon: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 16, lineHeight: 22, marginRight: 8, textAlign: 'center', width: 20 },
  detailText: { color: GameColors.inkMuted, flex: 1, fontFamily: GameFonts.hand, fontSize: 14, lineHeight: 21 },
  sectionBrush: { alignSelf: 'flex-start', backgroundColor: GameColors.markerGreenWash, marginBottom: 14, marginLeft: 10, paddingHorizontal: 16, paddingVertical: 5, transform: [{ rotate: '-1deg' }] },
  sectionBrushText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 24, letterSpacing: 1.4, lineHeight: 27, textTransform: 'uppercase' },
});
