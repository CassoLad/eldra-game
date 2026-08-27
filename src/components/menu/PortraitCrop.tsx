import { useState } from 'react';
import { Image, StyleSheet, View, type ImageSourcePropType, type LayoutChangeEvent } from 'react-native';

type CropRect = { height: number; width: number; x: number; y: number };

type PortraitCropProps = {
  crop: CropRect;
  source: ImageSourcePropType;
  sourceHeight?: number;
  sourceWidth?: number;
};

export function PortraitCrop({
  crop,
  source,
  sourceHeight = 1280,
  sourceWidth = 720,
}: PortraitCropProps) {
  const [frameWidth, setFrameWidth] = useState(0);
  const scale = frameWidth > 0 ? frameWidth / crop.width : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setFrameWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={handleLayout} style={styles.frame}>
      {scale > 0 ? (
        <Image
          resizeMode="stretch"
          source={source}
          style={{
            height: sourceHeight * scale,
            left: -crop.x * scale,
            position: 'absolute',
            top: -crop.y * scale,
            width: sourceWidth * scale,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 0.92,
    overflow: 'hidden',
    width: '100%',
  },
});
