import { StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import type { StoryEvent } from '@/game/gameTypes';

export function StoryCard({ event }: { event: StoryEvent }) {
  return (
    <View style={[styles.card, SketchShadow]}>
      <View pointerEvents="none" style={styles.innerFrame} />
      <View accessibilityLabel={event.imageRef ?? 'Story artwork'} style={styles.artPanel}>
        <View style={styles.blueWash} />
        <View style={styles.goldWash} />
        <Text style={styles.artMark}>⌁  ✦  ⌁</Text>
        <Text style={styles.artLabel}>{event.imageRef ?? 'THE ROAD AHEAD'}</Text>
        <Text style={styles.artNote}>ILLUSTRATION SPACE</Text>
      </View>

      <View style={styles.copy}>
        <View style={styles.kicker}><Text style={styles.kickerText}>STORY EVENT</Text></View>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.rule} />
        <Text style={styles.body}>{event.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 7, borderWidth: 1.5, overflow: 'hidden', position: 'relative' },
  innerFrame: { bottom: 5, borderColor: GameColors.lineSoft, borderRadius: 4, borderWidth: 0.7, left: 5, position: 'absolute', right: 5, top: 5, zIndex: 3 },
  artPanel: { alignItems: 'center', aspectRatio: 16 / 7.8, backgroundColor: GameColors.paperDeep, borderBottomColor: GameColors.ink, borderBottomWidth: 1.5, justifyContent: 'center', overflow: 'hidden' },
  blueWash: { backgroundColor: GameColors.markerBlueWash, borderRadius: 60, height: 88, left: '18%', opacity: 0.8, position: 'absolute', top: '25%', transform: [{ rotate: '-8deg' }], width: 125 },
  goldWash: { backgroundColor: GameColors.markerGoldWash, borderRadius: 60, bottom: '16%', height: 60, opacity: 0.65, position: 'absolute', right: '17%', transform: [{ rotate: '6deg' }], width: 105 },
  artMark: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 45, letterSpacing: 5, lineHeight: 50 },
  artLabel: { color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 14, marginTop: 4, textTransform: 'capitalize' },
  artNote: { color: GameColors.inkMuted, fontFamily: GameFonts.display, fontSize: 16, letterSpacing: 2, marginTop: 1 },
  copy: { paddingBottom: 24, paddingHorizontal: 22, paddingTop: 20 },
  kicker: { alignSelf: 'center', backgroundColor: GameColors.charcoal, paddingHorizontal: 20, paddingVertical: 2, transform: [{ rotate: '-1deg' }] },
  kickerText: { color: GameColors.paperLight, fontFamily: GameFonts.display, fontSize: 23, letterSpacing: 2, lineHeight: 27 },
  title: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 43, letterSpacing: 1, lineHeight: 48, marginTop: 13, textAlign: 'center', textTransform: 'uppercase' },
  rule: { alignSelf: 'center', backgroundColor: GameColors.markerRed, height: 3, marginBottom: 15, marginTop: 9, transform: [{ rotate: '-1deg' }], width: '31%' },
  body: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 16, lineHeight: 25 },
});
