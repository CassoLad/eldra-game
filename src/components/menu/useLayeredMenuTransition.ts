import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';

export type MenuSide = 'left' | 'right';
export type MenuWeight = 'small' | 'medium' | 'large';
export type MenuPieceConfig = {
  id: string;
  direction?: MenuSide;
  order: number;
  weight: MenuWeight;
  width: number; // Object width in the 853px artwork coordinate system.
};
export type TransitionPhase = 'idle' | 'exiting' | 'switching' | 'entering';

// Auto mode assigns whole pieces alternately: floor(N/2) left, ceil(N/2) right.
export function resolveMenuDirections(pieces: readonly MenuPieceConfig[]) {
  return pieces.map((piece, index) => ({ ...piece, direction: piece.direction ?? (index % 2 === 0 ? 'right' : 'left') as MenuSide }));
}

const DURATION = { small: 310, medium: 350, large: 390 } as const;
const PAGE_WIDTH = 853;
const SAFETY_MARGIN = 48;
const STAGGER = 30;

export function useLayeredMenuTransition(
  characterPieces: readonly MenuPieceConfig[],
  traitPieces: readonly MenuPieceConfig[],
  setStep: (step: number) => void,
) {
  const pieces = useRef({ 1: resolveMenuDirections(characterPieces), 2: resolveMenuDirections(traitPieces) }).current;
  const values = useRef({
    1: Object.fromEntries(pieces[1].map(piece => [piece.id, new Animated.Value(0)])),
    2: Object.fromEntries(pieces[2].map(piece => [piece.id, new Animated.Value(0)])),
  }).current;
  const opacity = useRef({ 1: new Animated.Value(1), 2: new Animated.Value(0) }).current;
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const phaseRef = useRef<TransitionPhase>('idle');
  const reducedMotion = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => { reducedMotion.current = enabled; }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', enabled => { reducedMotion.current = enabled; });
    return () => subscription.remove();
  }, []);

  const setCurrentPhase = (next: TransitionPhase) => { phaseRef.current = next; setPhase(next); };
  const pieceValue = (scene: 1 | 2, id: string) => values[scene][id];
  const sceneOpacity = (scene: 1 | 2) => opacity[scene];
  const distance = (piece: ReturnType<typeof resolveMenuDirections>[number]) =>
    (piece.direction === 'left' ? -1 : 1) * (PAGE_WIDTH + piece.width + SAFETY_MARGIN);

  const transitionTo = (from: 1 | 2, to: 1 | 2) => {
    if (phaseRef.current !== 'idle' || from === to) return;
    setCurrentPhase('exiting');
    if (reducedMotion.current) {
      setStep(to);
      Animated.parallel([
        Animated.timing(opacity[from], { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(opacity[to], { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start(() => setCurrentPhase('idle'));
      return;
    }
    Animated.parallel(pieces[from].map(piece => Animated.timing(values[from][piece.id], {
      toValue: distance(piece), duration: DURATION[piece.weight], delay: piece.order * STAGGER,
      easing: Easing.in(Easing.cubic), useNativeDriver: true,
    }))).start(({ finished }) => {
      if (!finished) { setCurrentPhase('idle'); return; }
      setCurrentPhase('switching');
      pieces[to].forEach(piece => values[to][piece.id].setValue(distance(piece)));
      opacity[from].setValue(0);
      opacity[to].setValue(1);
      setStep(to);
      setTimeout(() => {
        setCurrentPhase('entering');
        Animated.parallel(pieces[to].map(piece => Animated.timing(values[to][piece.id], {
          toValue: 0, duration: DURATION[piece.weight] + 40, delay: piece.order * STAGGER,
          easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }))).start(() => {
          pieces[from].forEach(piece => values[from][piece.id].setValue(0));
          setCurrentPhase('idle');
        });
      }, 75);
    });
  };

  return { phase, pieceValue, sceneOpacity, transitionTo };
}
