import { createContext, useCallback, useContext, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View, type ImageStyle, type StyleProp } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameColors, GameFonts } from '@/design/gameTheme';
import { fitArtwork } from '@/game/artworkLayout';

const ArtworkContext = createContext({ scale: 1, loaded: (_source: number) => {}, failed: () => {} });
export const useArtworkScale = () => useContext(ArtworkContext).scale;
type CanvasProps = PropsWithChildren<{ assets: readonly number[]; width?: number; height?: number }>;

// Separate readiness state prevents callbacks from the previous menu revealing this one early.
export function ArtworkCanvas(props: CanvasProps) {
  return <CanvasContents key={props.assets.join(':')} {...props} />;
}
function CanvasContents({ assets, children, width = 853, height = 1844 }: CanvasProps) {
  const [available, setAvailable] = useState({ width: 0, height: 0 });
  const [loadedSources, setLoadedSources] = useState<Set<number>>(() => new Set());
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const fitted = fitArtwork(available.width, available.height, width, height);
  const ready = fitted.scale > 0 && !error && assets.every(source => loadedSources.has(source));
  const loaded = useCallback((source: number) => setLoadedSources(current => current.has(source) ? current : new Set([...current, source])), []);
  const failed = useCallback(() => setError(true), []);
  return <SafeAreaView style={styles.screen}>
    <View style={styles.available} onLayout={event => setAvailable(event.nativeEvent.layout)}>
      <ArtworkContext.Provider value={{ scale: fitted.scale, loaded, failed }}>
        <View key={attempt} pointerEvents={ready ? 'auto' : 'none'} aria-hidden={!ready} accessibilityElementsHidden={!ready}
          importantForAccessibility={ready ? 'auto' : 'no-hide-descendants'}
          style={[styles.page, { width: fitted.width, height: fitted.height, opacity: ready ? 1 : 0 }]}>{children}</View>
      </ArtworkContext.Provider>
      {!ready && <View style={styles.loading}>{error
        ? <Pressable accessibilityRole="button" onPress={() => { setError(false); setLoadedSources(new Set()); setAttempt(value => value + 1); }}><Text style={styles.loadingText}>Artwork could not load. Tap to retry.</Text></Pressable>
        : <ActivityIndicator accessibilityLabel="Loading complete screen" color={GameColors.markerPlum} />}</View>}
    </View>
  </SafeAreaView>;
}
export function ArtworkImage({ source, style, accessibilityLabel }: { source: number; style?: StyleProp<ImageStyle>; accessibilityLabel?: string }) {
  const gate = useContext(ArtworkContext);
  return <Image source={source} resizeMode="stretch" fadeDuration={0} accessibilityLabel={accessibilityLabel} accessible={Boolean(accessibilityLabel)}
    onLoad={() => gate.loaded(source)} onError={gate.failed} style={[styles.image, style]} />;
}
export type FullArtworkHotspotProps = {
  accessibilityLabel: string; disabled?: boolean; selected?: boolean;
  height: number; left: number; onPress?: () => void; top: number; width: number;
};
export function FullArtworkHotspot({ accessibilityLabel, disabled = false, selected, height, left, onPress, top, width }: FullArtworkHotspotProps) {
  return <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole={selected === undefined ? 'button' : 'radio'} aria-checked={selected} aria-disabled={disabled} accessibilityState={{ disabled, checked: selected }} disabled={disabled} onPress={onPress}
    style={[styles.hotspot, { height: `${height}%`, left: `${left}%`, top: `${top}%`, width: `${width}%` }, selected && styles.selection]} />;
}
export function FullArtworkSwapButton({ normalSource, pressedSource, accessibilityLabel, disabled = false, height, left, onPress, top, width }: FullArtworkHotspotProps & { normalSource: number; pressedSource: number }) {
  return <Pressable accessibilityLabel={accessibilityLabel} accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={[styles.hotspot, { height: `${height}%`, left: `${left}%`, top: `${top}%`, width: `${width}%` }]}>
    {({ pressed }) => <><ArtworkImage source={normalSource} style={{ opacity: pressed ? 0 : 1 }} /><ArtworkImage source={pressedSource} style={{ opacity: pressed ? 1 : 0 }} /></>}
  </Pressable>;
}
export function FullArtworkScreen({ accessibilityLabel, children, source, assets = [] }: PropsWithChildren<{ accessibilityLabel: string; source: number; assets?: readonly number[] }>) {
  return <ArtworkCanvas assets={[source, ...assets]}><ArtworkImage accessibilityLabel={accessibilityLabel} source={source} />{children}</ArtworkCanvas>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: GameColors.paper, overflow: 'hidden' },
  available: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  page: { position: 'relative', overflow: 'hidden' },
  image: { position: 'absolute', left: 0, top: 0, height: '100%', width: '100%' },
  hotspot: { position: 'absolute', backgroundColor: 'transparent' },
  selection: { borderColor: '#72507f', borderWidth: 2, borderRadius: 6 },
  loading: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: GameColors.ink, fontFamily: GameFonts.hand, padding: 24, textAlign: 'center' },
});
