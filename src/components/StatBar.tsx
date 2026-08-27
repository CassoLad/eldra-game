import { StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts } from '@/design/gameTheme';
import type { PlayerStats } from '@/game/gameTypes';

export function StatBar({ stats }: { stats: PlayerStats }) {
  return (
    <View accessibilityLabel={`Health ${stats.health}, Gold ${stats.gold}, Reputation ${stats.reputation}`} style={styles.bar}>
      <Stat accent={GameColors.markerRedWash} icon="♥" label="Health" value={stats.health} />
      <View style={styles.divider} />
      <Stat accent={GameColors.markerGoldWash} icon="◈" label="Gold" value={stats.gold} />
      <View style={styles.divider} />
      <Stat accent={GameColors.markerGreenWash} icon="✦" label="Renown" value={stats.reputation} />
    </View>
  );
}

function Stat({ accent, icon, label, value }: { accent: string; icon: string; label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <View style={[styles.iconWash, { backgroundColor: accent }]}><Text style={styles.icon}>{icon}</Text></View>
      <View><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 6, borderWidth: 1.5, flexDirection: 'row', marginBottom: 14, minHeight: 66, paddingHorizontal: 8, paddingVertical: 8 },
  stat: { alignItems: 'center', flex: 1, flexDirection: 'row', justifyContent: 'center', minWidth: 0 },
  divider: { alignSelf: 'stretch', backgroundColor: GameColors.lineSoft, marginVertical: 3, width: 1 },
  iconWash: { alignItems: 'center', height: 34, justifyContent: 'center', marginRight: 7, transform: [{ rotate: '-4deg' }], width: 34 },
  icon: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 23, lineHeight: 25 },
  label: { color: GameColors.inkMuted, fontFamily: GameFonts.display, fontSize: 18, letterSpacing: 1, lineHeight: 19, textTransform: 'uppercase' },
  value: { color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 15, lineHeight: 18 },
});
