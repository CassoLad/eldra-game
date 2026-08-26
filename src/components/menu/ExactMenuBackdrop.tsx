import type { PropsWithChildren } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { GameColors } from '@/design/gameTheme';

type ExactMenuBackdropProps = PropsWithChildren<{
  accessibilityLabel: string;
  source: ImageSourcePropType;
}>;

export function ExactMenuBackdrop({ accessibilityLabel, children, source }: ExactMenuBackdropProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.canvas}>
          <Image
            accessibilityLabel={accessibilityLabel}
            resizeMode="contain"
            source={source}
            style={styles.image}
          />
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type MenuHotspotProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  height: number;
  left: number;
  onPress?: () => void;
  top: number;
  width: number;
};

export function MenuHotspot({
  accessibilityLabel,
  disabled = false,
  height,
  left,
  onPress,
  top,
  width,
}: MenuHotspotProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.hotspot,
        {
          height: `${height}%`,
          left: `${left}%`,
          top: `${top}%`,
          width: `${width}%`,
        },
        pressed && !disabled ? styles.pressed : null,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: GameColors.paper,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  canvas: {
    aspectRatio: 720 / 1280,
    maxWidth: 720,
    position: 'relative',
    width: '100%',
  },
  image: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  hotspot: {
    backgroundColor: 'transparent',
    position: 'absolute',
  },
  pressed: {
    backgroundColor: 'rgba(30, 28, 24, 0.08)',
  },
});
