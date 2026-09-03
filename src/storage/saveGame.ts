import AsyncStorage from '@react-native-async-storage/async-storage';

import type { GameState, JourneySelection } from '@/game/gameTypes';

const SAVE_KEY = '@untitled-adventure/game-save';
const SAVE_VERSION = 1;

type StoredGameState = GameState & {
  version: typeof SAVE_VERSION;
};

export async function saveGame(gameState: GameState): Promise<void> {
  const storedState: StoredGameState = {
    ...gameState,
    version: SAVE_VERSION,
  };

  await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(storedState));
}

export async function loadSavedGame(): Promise<GameState | null> {
  try {
    const rawSave = await AsyncStorage.getItem(SAVE_KEY);
    if (!rawSave) {
      return null;
    }

    const parsed: unknown = JSON.parse(rawSave);
    return isStoredGameState(parsed)
      ? { currentEventId: parsed.currentEventId, stats: parsed.stats, selection: isJourneySelection(parsed.selection) ? parsed.selection : undefined }
      : null;
  } catch (error) {
    console.warn('The local game save could not be read.', error);
    return null;
  }
}

function isStoredGameState(value: unknown): value is StoredGameState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const stats = candidate.stats;
  if (!stats || typeof stats !== 'object') {
    return false;
  }

  const statValues = stats as Record<string, unknown>;

  return (
    candidate.version === SAVE_VERSION &&
    typeof candidate.currentEventId === 'string' &&
    isFiniteNumber(statValues.health) &&
    isFiniteNumber(statValues.gold) &&
    isFiniteNumber(statValues.reputation)
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isJourneySelection(value: unknown): value is JourneySelection {
  if (!value || typeof value !== 'object') return false;
  const selection = value as Record<string, unknown>;
  return ['worldId', 'characterId', 'traitId', 'pastId'].every(key => typeof selection[key] === 'string');
}
