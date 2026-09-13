import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameColors, GameFonts } from '@/design/gameTheme';

export default function CreditsScreen() {
  const router = useRouter();
  return <View style={styles.screen}>
    <Text style={styles.title}>Credits</Text>
    <Text style={styles.copy}>Eldrane: Chronicles of the Road</Text>
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.back}>
      <Text style={styles.backText}>Back</Text>
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: GameColors.paper, padding: 28 },
  title: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 46, marginBottom: 18 },
  copy: { color: GameColors.ink, fontFamily: GameFonts.hand, fontSize: 20, textAlign: 'center' },
  back: { borderColor: GameColors.ink, borderWidth: 2, marginTop: 36, paddingHorizontal: 34, paddingVertical: 12 },
  backText: { color: GameColors.ink, fontFamily: GameFonts.display, fontSize: 24 },
});
