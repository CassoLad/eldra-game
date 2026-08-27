import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts, SketchShadow } from '@/design/gameTheme';
import type { StoryChoice } from '@/game/gameTypes';

type ChoiceButtonProps = {
  choice: StoryChoice;
  disabled?: boolean;
  index: number;
  onPress: () => void;
};

export function ChoiceButton({ choice, disabled = false, index, onPress }: ChoiceButtonProps) {
  const effectText = describeEffects(choice);

  return (
    <Pressable
      accessibilityHint="Selects this action and continues the story"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, SketchShadow, pressed && !disabled && styles.pressed, disabled && styles.disabled]}>
      <View style={[styles.numberWash, index % 2 === 0 ? styles.greenWash : styles.plumWash]}>
        <Text style={styles.number}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.text}>{choice.text}</Text>
        {effectText ? <Text style={styles.effect}>{effectText}</Text> : <Text style={styles.effect}>The road will remember</Text>}
      </View>
      <Text style={styles.arrow}>→</Text>
    </Pressable>
  );
}

function describeEffects(choice: StoryChoice): string {
  const effects = choice.effects;
  if (!effects) return '';
  const labels: string[] = [];
  if (effects.health) labels.push(`♥ ${signed(effects.health)}`);
  if (effects.gold) labels.push(`◈ ${signed(effects.gold)}`);
  if (effects.reputation) labels.push(`✦ ${signed(effects.reputation)}`);
  return labels.join('   ');
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', backgroundColor: GameColors.paperLight, borderColor: GameColors.ink, borderRadius: 6, borderWidth: 1.5, flexDirection: 'row', minHeight: 70, paddingHorizontal: 12, paddingVertical: 10 },
  pressed: { backgroundColor: '#F2ECD9', opacity: 0.9, transform: [{ translateY: 2 }] },
  disabled: { opacity: 0.5 },
  numberWash: { alignItems: 'center', height: 45, justifyContent: 'center', marginRight: 13, transform: [{ rotate: '-4deg' }], width: 48 },
  greenWash: { backgroundColor: GameColors.markerGreenWash },
  plumWash: { backgroundColor: '#DED0E1' },
  number: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 27, lineHeight: 31 },
  copy: { flex: 1 },
  text: { color: GameColors.ink, fontFamily: GameFonts.handBold, fontSize: 15, lineHeight: 21 },
  effect: { color: GameColors.inkMuted, fontFamily: GameFonts.hand, fontSize: 11, lineHeight: 16, marginTop: 2 },
  arrow: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 31, marginLeft: 9 },
});
