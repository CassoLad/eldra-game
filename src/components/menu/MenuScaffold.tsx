import { useState } from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import {
  Animated,
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
  mainMenu?: boolean;
  onPress?: () => void;
  showArrow?: boolean;
  showLock?: boolean;
  subtitle?: string;
  tilt?: 'left' | 'right' | 'none';
};

export function SketchMenuButton({
  accent = 'green', disabled = false, icon, label, mainMenu = false, onPress, showArrow = false,
  showLock = false, subtitle, tilt = 'none',
}: SketchMenuButtonProps) {
  const [pressProgress] = useState(() => new Animated.Value(0));

  const animatePress = (toValue: number) => {
    Animated.spring(pressProgress, {
      damping: 17,
      mass: 0.5,
      stiffness: 360,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const surfaceTransform = {
    transform: [
      { translateY: pressProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }) },
      { scale: pressProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.985] }) },
    ],
  };
  const iconTransform = {
    transform: [
      { rotate: pressProgress.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '1deg'] }) },
      { scale: pressProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] }) },
    ],
  };
  const arrowTransform = {
    transform: [{ translateX: pressProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 5] }) }],
  };

  return (
    <Animated.View
      style={[
        styles.menuButtonWrap,
        mainMenu && styles.mainMenuButtonWrap,
        tilt === 'left' && styles.tiltLeft,
        tilt === 'right' && styles.tiltRight,
        disabled && styles.disabled,
        surfaceTransform,
      ]}>
      <View pointerEvents="none" style={[styles.roughBorderOffset, mainMenu && styles.mainRoughBorderOffset]} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => animatePress(1)}
        onPressOut={() => animatePress(0)}
        style={({ pressed }) => [
          styles.menuButton,
          mainMenu && styles.mainMenuButton,
          SketchShadow,
          pressed && !disabled && styles.buttonPressed,
        ]}>
        {mainMenu ? <View pointerEvents="none" style={styles.mainInnerBorder} /> : null}
        <Animated.View style={[styles.buttonIconWash, mainMenu && styles.mainButtonIconWash, accentStyles[accent], iconTransform]}>
          <View pointerEvents="none" style={[styles.washBleed, accentStyles[accent]]} />
          <Text style={[styles.buttonIcon, mainMenu && styles.mainButtonIcon]}>{icon}</Text>
        </Animated.View>
        <View style={[styles.buttonCopy, mainMenu && styles.mainButtonCopy]}>
          <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82} style={[styles.buttonLabel, mainMenu && styles.mainButtonLabel]}>{label}</Text>
          {subtitle ? <Text style={[styles.buttonSubtitle, mainMenu && styles.mainButtonSubtitle]}>{subtitle}</Text> : null}
        </View>
        {showArrow ? <Animated.Text style={[styles.arrow, mainMenu && styles.mainArrow, arrowTransform]}>→</Animated.Text> : null}
        {mainMenu ? (
          <View pointerEvents="none" style={styles.sideOrnament}>
            <View style={styles.sideOrnamentLine} />
            <Text style={styles.sideOrnamentDiamond}>◇</Text>
            <View style={styles.sideOrnamentLine} />
          </View>
        ) : null}
        {mainMenu && showLock ? (
          <View pointerEvents="none" style={styles.lockBanner}>
            <Text style={styles.lockIcon}>▣</Text>
            <View style={styles.lockBannerPoint} />
          </View>
        ) : null}
        <View pointerEvents="none" style={styles.inkNotchLeft} />
        <View pointerEvents="none" style={styles.inkNotchRight} />
        {mainMenu ? (
          <>
            <View pointerEvents="none" style={[styles.cornerStroke, styles.cornerTopLeft]} />
            <View pointerEvents="none" style={[styles.cornerStroke, styles.cornerTopRight]} />
            <View pointerEvents="none" style={[styles.cornerStroke, styles.cornerBottomLeft]} />
            <View pointerEvents="none" style={[styles.cornerStroke, styles.cornerBottomRight]} />
          </>
        ) : null}
      </Pressable>
    </Animated.View>
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
  menuButtonWrap: {
    minHeight: 70,
    position: 'relative',
    width: '100%',
  },
  mainMenuButtonWrap: { minHeight: 84 },
  tiltLeft: { transform: [{ rotate: '-0.18deg' }] },
  tiltRight: { transform: [{ rotate: '0.16deg' }] },
  roughBorderOffset: {
    borderColor: 'rgba(30, 28, 24, 0.42)',
    borderRadius: 7,
    borderWidth: 0.8,
    bottom: -2,
    left: 2,
    position: 'absolute',
    right: -1,
    top: 2,
    transform: [{ rotate: '0.25deg' }],
  },
  mainRoughBorderOffset: {
    borderColor: 'rgba(30, 28, 24, 0.66)',
    borderRadius: 4,
    borderWidth: 1,
    bottom: -3,
    left: 2,
    right: -2,
    top: 3,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 249, 238, 0.92)',
    borderColor: GameColors.ink,
    borderRadius: 7,
    borderWidth: 1.4,
    flexDirection: 'row',
    flex: 1,
    minHeight: 70,
    overflow: 'hidden',
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  mainMenuButton: {
    backgroundColor: 'rgba(247, 241, 230, 0.78)',
    borderRadius: 4,
    borderWidth: 1.7,
    minHeight: 82,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  mainInnerBorder: {
    borderColor: 'rgba(30, 28, 24, 0.3)',
    borderRadius: 2,
    borderWidth: 0.7,
    bottom: 4,
    left: 4,
    position: 'absolute',
    right: 4,
    top: 4,
  },
  buttonPressed: { backgroundColor: GameColors.paperDeep },
  disabled: { opacity: 0.42 },
  buttonIconWash: { alignItems: 'center', height: 46, justifyContent: 'center', marginRight: 16, position: 'relative', width: 52 },
  mainButtonIconWash: { height: 58, marginLeft: 2, marginRight: 18, width: 62 },
  washBleed: {
    bottom: -3,
    left: 5,
    opacity: 0.45,
    position: 'absolute',
    right: -4,
    top: 4,
    transform: [{ rotate: '7deg' }],
  },
  buttonIcon: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 28 },
  mainButtonIcon: { fontFamily: GameFonts.hand, fontSize: 32, lineHeight: 38 },
  buttonCopy: { flex: 1 },
  mainButtonCopy: { justifyContent: 'center', paddingBottom: 1 },
  buttonLabel: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 29, letterSpacing: 1.5, lineHeight: 34, textTransform: 'uppercase' },
  mainButtonLabel: { fontSize: 33, letterSpacing: 2, lineHeight: 35 },
  buttonSubtitle: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 14, marginTop: 3 },
  mainButtonSubtitle: { fontSize: 13, letterSpacing: 0.25, lineHeight: 18, marginTop: 0 },
  arrow: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 27, marginLeft: 8, marginRight: 2 },
  mainArrow: { fontFamily: GameFonts.displayRegular, fontSize: 40, lineHeight: 42, marginLeft: 6, marginRight: 25 },
  sideOrnament: { alignItems: 'center', bottom: 13, justifyContent: 'center', position: 'absolute', right: 11, top: 13, width: 9 },
  sideOrnamentLine: { backgroundColor: GameColors.inkMuted, flex: 1, opacity: 0.65, width: 1 },
  sideOrnamentDiamond: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 10, lineHeight: 12 },
  lockBanner: {
    alignItems: 'center',
    backgroundColor: GameColors.paperDeep,
    borderColor: GameColors.inkMuted,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 13,
    top: -1,
    width: 24,
    zIndex: 4,
  },
  lockIcon: { color: GameColors.inkMuted, fontFamily: GameFonts.handBold, fontSize: 12, lineHeight: 15 },
  lockBannerPoint: {
    backgroundColor: GameColors.paperDeep,
    borderBottomColor: GameColors.inkMuted,
    borderBottomWidth: 1,
    borderRightColor: GameColors.inkMuted,
    borderRightWidth: 1,
    bottom: -5,
    height: 10,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 10,
  },
  cornerStroke: { backgroundColor: GameColors.ink, height: 1, opacity: 0.75, position: 'absolute', width: 11 },
  cornerTopLeft: { left: 0, top: 4, transform: [{ rotate: '-42deg' }] },
  cornerTopRight: { right: 0, top: 4, transform: [{ rotate: '42deg' }] },
  cornerBottomLeft: { bottom: 4, left: 0, transform: [{ rotate: '42deg' }] },
  cornerBottomRight: { bottom: 4, right: 0, transform: [{ rotate: '-42deg' }] },
  inkNotchLeft: { backgroundColor: GameColors.ink, height: 1, left: -1, opacity: 0.5, position: 'absolute', top: 15, transform: [{ rotate: '-12deg' }], width: 8 },
  inkNotchRight: { backgroundColor: GameColors.ink, bottom: 11, height: 1, opacity: 0.45, position: 'absolute', right: -2, transform: [{ rotate: '9deg' }], width: 10 },
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
