export type PlayerStats = {
  gold: number;
  health: number;
  reputation: number;
};

export type StatEffects = Partial<PlayerStats>;

export type StoryChoice = {
  effects?: StatEffects;
  nextEventId: string;
  text: string;
};

export type StoryEvent = {
  choices: StoryChoice[];
  id: string;
  imageRef?: string;
  text: string;
  title: string;
};

export type GameState = {
  currentEventId: string;
  stats: PlayerStats;
};
