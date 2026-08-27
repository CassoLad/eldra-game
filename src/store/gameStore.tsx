import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import type { GameState, PlayerStats, StatEffects, StoryChoice } from '@/game/gameTypes';
import { FIRST_EVENT_ID, hasStoryEvent } from '@/game/storyData';
import { loadSavedGame, saveGame } from '@/storage/saveGame';

const STARTING_STATS: PlayerStats = {
  health: 100,
  gold: 10,
  reputation: 0,
};

export const INITIAL_GAME_STATE: GameState = {
  currentEventId: FIRST_EVENT_ID,
  stats: STARTING_STATS,
};

type GameStoreValue = {
  applyChoice: (choice: StoryChoice) => Promise<void>;
  continueGame: () => Promise<boolean>;
  gameState: GameState;
  hasSave: boolean;
  isHydrating: boolean;
  isSaving: boolean;
  newGame: () => Promise<void>;
};

const GameStoreContext = createContext<GameStoreValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [hasSave, setHasSave] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadSavedGame()
      .then((savedGame) => {
        if (!isMounted || !savedGame || !hasStoryEvent(savedGame.currentEventId)) {
          return;
        }

        setGameState(savedGame);
        setHasSave(true);
      })
      .finally(() => {
        if (isMounted) {
          setIsHydrating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const newGame = async () => {
    setIsSaving(true);
    const freshState = createInitialGameState();
    setGameState(freshState);

    try {
      await saveGame(freshState);
      setHasSave(true);
    } finally {
      setIsSaving(false);
    }
  };

  const continueGame = async () => {
    setIsSaving(true);

    try {
      const savedGame = await loadSavedGame();
      if (!savedGame || !hasStoryEvent(savedGame.currentEventId)) {
        setHasSave(false);
        return false;
      }

      setGameState(savedGame);
      setHasSave(true);
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  const applyChoice = async (choice: StoryChoice) => {
    if (isSaving || !hasStoryEvent(choice.nextEventId)) {
      return;
    }

    setIsSaving(true);
    const nextState: GameState = {
      currentEventId: choice.nextEventId,
      stats: applyStatEffects(gameState.stats, choice.effects),
    };

    setGameState(nextState);

    try {
      await saveGame(nextState);
      setHasSave(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GameStoreContext.Provider
      value={{
        applyChoice,
        continueGame,
        gameState,
        hasSave,
        isHydrating,
        isSaving,
        newGame,
      }}>
      {children}
    </GameStoreContext.Provider>
  );
}

export function useGameStore(): GameStoreValue {
  const store = useContext(GameStoreContext);
  if (!store) {
    throw new Error('useGameStore must be used inside GameProvider.');
  }

  return store;
}

export function applyStatEffects(stats: PlayerStats, effects: StatEffects = {}): PlayerStats {
  return {
    health: clamp(stats.health + (effects.health ?? 0), 0, 100),
    gold: Math.max(0, stats.gold + (effects.gold ?? 0)),
    reputation: stats.reputation + (effects.reputation ?? 0),
  };
}

function createInitialGameState(): GameState {
  return {
    currentEventId: FIRST_EVENT_ID,
    stats: { ...STARTING_STATS },
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
