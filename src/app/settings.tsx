import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GameColors, GameFonts } from '@/design/gameTheme';

export default function SettingsScreen() {
  const router = useRouter();
  return <View style={styles.screen}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.copy}>Settings options will be added here.</Text>
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
      <Text style={styles.backText}>Back</Text>
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: GameColors.paper, padding: 32 },
  title: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 52 },
  copy: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 22, marginTop: 16, textAlign: 'center' },
  back: { borderColor: GameColors.ink, borderWidth: 2, marginTop: 40, paddingHorizontal: 42, paddingVertical: 14 },
  backText: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 24 },
  pressed: { opacity: 0.7, transform: [{ scaleY: 0.86 }] },
});
