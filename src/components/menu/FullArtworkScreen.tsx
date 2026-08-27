import { type PropsWithChildren } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View, type ImageSourcePropType } from 'react-native';

import { GameColors } from '@/design/gameTheme';

const ARTWORK_WIDTH = 1418;
const ARTWORK_HEIGHT = 3072;

export type FullArtworkHotspotProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  height: number;
  left: number;
  onPress?: () => void;
  top: number;
  width: number;
};

type FullArtworkSwapButtonProps = FullArtworkHotspotProps & {
  normalSource: ImageSourcePropType;
  pressedSource: ImageSourcePropType;
};

export function FullArtworkHotspot({ accessibilityLabel, disabled = false, height, left, onPress, top, width }: FullArtworkHotspotProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={3}
      onPress={onPress}
      style={[
        styles.hotspot,
        { height: `${height}%`, left: `${left}%`, top: `${top}%`, width: `${width}%` },
      ]}
    />
  );
}

export function FullArtworkSwapButton({ accessibilityLabel, disabled = false, height, left, normalSource, onPress, pressedSource, top, width }: FullArtworkSwapButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={3}
      onPress={disabled ? undefined : onPress}
      style={[styles.swapButton, { height: `${height}%`, left: `${left}%`, top: `${top}%`, width: `${width}%` }]}
    >
      {({ pressed }) => (
        <>
          <Image fadeDuration={0} resizeMode="stretch" source={normalSource} style={[styles.swapImage, pressed && styles.swapImageHidden]} />
          <Image fadeDuration={0} resizeMode="stretch" source={pressedSource} style={[styles.swapImage, !pressed && styles.swapImageHidden]} />
        </>
      )}
    </Pressable>
  );
}

export function FullArtworkScreen({ accessibilityLabel, children, source }: PropsWithChildren<{ accessibilityLabel: string; source: ImageSourcePropType }>) {
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width, ARTWORK_WIDTH);
  const pageHeight = pageWidth * ARTWORK_HEIGHT / ARTWORK_WIDTH;

  return (
    <View style={styles.screen}>
      <ScrollView alwaysBounceVertical bounces contentContainerStyle={styles.scrollContent} decelerationRate="fast" overScrollMode="always" showsVerticalScrollIndicator={false}>
        <View style={[styles.page, { height: pageHeight, width: pageWidth }]}>
          <Image accessibilityLabel={accessibilityLabel} resizeMode="stretch" source={source} style={styles.image} />
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: GameColors.paper, flex: 1 },
  scrollContent: { alignItems: 'center', flexGrow: 1 },
  page: { aspectRatio: ARTWORK_WIDTH / ARTWORK_HEIGHT, maxWidth: ARTWORK_WIDTH, position: 'relative' },
  image: { bottom: 0, height: '100%', left: 0, position: 'absolute', right: 0, top: 0, width: '100%' },
  hotspot: { backgroundColor: 'transparent', position: 'absolute' },
  swapButton: { position: 'absolute' },
  swapImage: { bottom: 0, height: '100%', left: 0, position: 'absolute', right: 0, top: 0, width: '100%' },
  swapImageHidden: { opacity: 0 },
});
