import type { StoryEvent } from './gameTypes';

export const FIRST_EVENT_ID = 'road_001';

export const STORY_EVENTS: Record<string, StoryEvent> = {
  road_001: {
    id: 'road_001',
    title: 'A Stranger on the Road',
    text: 'A wounded traveller rests beside an old milestone. He raises a trembling hand and asks for help.',
    imageRef: 'Roadside traveller',
    choices: [
      {
        text: 'Stop and bind his wound',
        nextEventId: 'road_002',
        effects: { health: -5, reputation: 1 },
      },
      {
        text: 'Ask what his gratitude is worth',
        nextEventId: 'road_003',
        effects: { gold: 5, reputation: -1 },
      },
    ],
  },
  road_002: {
    id: 'road_002',
    title: 'A Small Kindness',
    text: 'Your bandage holds. The traveller thanks you and points toward a sheltered camp beyond the next hill.',
    imageRef: 'A quiet campfire',
    choices: [
      {
        text: 'Rest at the hidden camp',
        nextEventId: 'forest_001',
        effects: { health: 8 },
      },
    ],
  },
  road_003: {
    id: 'road_003',
    title: 'A Bitter Bargain',
    text: 'The traveller pays, though his eyes harden. Before you part, he warns you about strange lights in the forest.',
    imageRef: 'Coins in an open hand',
    choices: [
      {
        text: 'Take the forest path',
        nextEventId: 'forest_001',
      },
    ],
  },
  forest_001: {
    id: 'forest_001',
    title: 'Lanterns Between the Trees',
    text: 'Blue lights drift between the pines. One circles close, then glides toward a narrow trail hidden by brambles.',
    imageRef: 'Blue forest lanterns',
    choices: [
      {
        text: 'Follow the wandering light',
        nextEventId: 'shrine_001',
        effects: { health: -10, gold: 4 },
      },
      {
        text: 'Keep to the safer road',
        nextEventId: 'bridge_001',
        effects: { reputation: -1 },
      },
    ],
  },
  shrine_001: {
    id: 'shrine_001',
    title: 'The Forgotten Shrine',
    text: 'The light leads you to a mossy shrine. A shallow stone bowl waits beneath the watchful face of an old spirit.',
    imageRef: 'Moss-covered shrine',
    choices: [
      {
        text: 'Leave two gold as an offering',
        nextEventId: 'bridge_001',
        effects: { gold: -2, reputation: 2 },
      },
      {
        text: 'Take the blessing and leave',
        nextEventId: 'bridge_001',
        effects: { health: 5 },
      },
    ],
  },
  bridge_001: {
    id: 'bridge_001',
    title: 'The Road Goes On',
    text: 'At dawn, an old stone bridge carries you toward distant towers. Behind you, the forest grows quiet once more.',
    imageRef: 'Bridge at sunrise',
    choices: [
      {
        text: 'Begin the next stretch of road',
        nextEventId: 'road_001',
      },
    ],
  },
};

export function getStoryEvent(eventId: string): StoryEvent {
  return STORY_EVENTS[eventId] ?? STORY_EVENTS[FIRST_EVENT_ID];
}

export function hasStoryEvent(eventId: string): boolean {
  return eventId in STORY_EVENTS;
}
