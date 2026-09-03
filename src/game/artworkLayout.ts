export function fitArtwork(availableWidth: number, availableHeight: number, designWidth: number, designHeight: number) {
  const scale = Math.max(0, Math.min(availableWidth / designWidth, availableHeight / designHeight));
  return { width: designWidth * scale, height: designHeight * scale, scale };
}
export function pixelRectStyle(rect: { x: number; y: number; width: number; height: number }, width: number, height: number) {
  return {
    left: `${rect.x / width * 100}%` as `${number}%`, top: `${rect.y / height * 100}%` as `${number}%`,
    width: `${rect.width / width * 100}%` as `${number}%`, height: `${rect.height / height * 100}%` as `${number}%`,
  };
}
