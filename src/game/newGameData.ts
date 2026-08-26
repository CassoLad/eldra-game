export type Accent = 'blue' | 'gold' | 'green' | 'plum' | 'red';

export type WorldOption = {
  accent: Accent;
  description: string;
  doodle: string;
  id: string;
  name: string;
};

export type CharacterOption = {
  accent: Accent;
  description: string;
  discoveryRole: string;
  doodle: string;
  id: string;
  name: string;
  role: string;
  species: 'Elf' | 'Human';
  strengths: string[];
};

export type CharacterPairing = {
  core: string;
  dynamic: string;
  id: string;
  members: [string, string];
  sequence: string;
};

export type SimpleOption = {
  accent: Accent;
  description: string;
  doodle: string;
  id: string;
  name: string;
};

export const WORLDS: WorldOption[] = [
  {
    accent: 'green',
    description: 'A world built over forgotten histories. Kingdoms rise where older names have vanished, roads lead through ruins no one remembers building, and relics remain from ages that survive only as fragments, myths and half-understood stories.',
    doodle: '♜',
    id: 'eldrane',
    name: 'ELDRANE',
  },
];

export const CHARACTERS: CharacterOption[] = [
  {
    accent: 'green',
    description: 'A practical wilderness survivor who finds forgotten places by accident.',
    discoveryRole: 'An accidental doorway into Eldrane’s hidden history. He uncovers concealed places because survival takes him there, then judges each discovery by one question: can this help me survive?',
    doodle: '⌁',
    id: 'human-huntsman',
    name: 'Human Huntsman',
    role: 'Huntsman',
    species: 'Human',
    strengths: [
      'Ranged combat and bowcraft',
      'Tracking animals, people, and environmental signs',
      'Finding food, water, shelter, and safer routes',
      'Spotting ambushes and disturbed or unnatural areas',
      'Setting simple traps and locating concealed places',
    ],
  },
  {
    accent: 'plum',
    description: 'A self-taught improviser who experiments with strange mechanisms and relics.',
    discoveryRole: 'Turns discoveries into practical experiments without understanding their technological origin.',
    doodle: '✦',
    id: 'human-self-taught-mage',
    name: 'Human Self-Taught Mage',
    role: 'Self-Taught Mage',
    species: 'Human',
    strengths: [
      'Activating damaged mechanisms',
      'Repairing and dismantling unusual objects',
      'Repurposing relic components',
      'Combining strange parts with crude materials',
      'Learning through practical experimentation',
    ],
  },
  {
    accent: 'gold',
    description: 'A patient builder who recognises patterns in forgotten structures and relics.',
    discoveryRole: 'Interprets what others find, connects separate discoveries, and recognises when a ruin belongs to something much older.',
    doodle: '⌘',
    id: 'elf-relic-builder',
    name: 'Elf Relic Builder',
    role: 'Relic Builder',
    species: 'Elf',
    strengths: [
      'Identifying unusual mechanisms',
      'Recognising construction patterns',
      'Repairing damaged relics',
      'Connecting separate historical discoveries',
      'Building advanced devices from relic components',
    ],
  },
];

export const CHARACTER_PAIRINGS: CharacterPairing[] = [
  {
    core: 'Finder + Improviser',
    dynamic: 'The Huntsman may find the Mage too curious and reckless; the Mage may feel the Huntsman overlooks discoveries and throws useful relics away.',
    id: 'huntsman-mage',
    members: ['human-huntsman', 'human-self-taught-mage'],
    sequence: 'The Huntsman finds sealed chambers, tunnels, machinery, and buried objects. The Mage experiments with, repairs, dismantles, or repurposes them.',
  },
  {
    core: 'Finder + Interpreter',
    dynamic: 'The Huntsman may become impatient with long study; the Builder may be frustrated when an important relic is treated as an ordinary tool.',
    id: 'huntsman-builder',
    members: ['human-huntsman', 'elf-relic-builder'],
    sequence: 'The Huntsman locates hidden entrances, forgotten routes, and nature-covered ruins. The Builder studies, interprets, repairs, and connects what is found.',
  },
];

export const BACKGROUNDS: SimpleOption[] = [
  { accent: 'red', description: 'Disciplined and battle-tested.', doodle: '⚔', id: 'soldier', name: 'Soldier' },
  { accent: 'green', description: 'At home beyond the city walls.', doodle: '⌁', id: 'hunter', name: 'Hunter' },
  { accent: 'blue', description: 'A patient keeper of old knowledge.', doodle: '▤', id: 'scholar', name: 'Scholar' },
  { accent: 'plum', description: 'Quick hands and quicker instincts.', doodle: '◇', id: 'thief', name: 'Thief' },
  { accent: 'gold', description: 'A practiced reader of people and prices.', doodle: '◉', id: 'merchant', name: 'Merchant' },
  { accent: 'red', description: 'Unbound by home, title, or expectation.', doodle: '☾', id: 'outcast', name: 'Outcast' },
];

export const TRAITS: SimpleOption[] = [
  { accent: 'red', description: 'Stand firm when others falter.', doodle: '♥', id: 'brave', name: 'Brave' },
  { accent: 'plum', description: 'Words open doors that steel cannot.', doodle: '✦', id: 'silver-tongued', name: 'Silver-Tongued' },
  { accent: 'blue', description: 'Notice the detail everyone else missed.', doodle: '◉', id: 'observant', name: 'Observant' },
  { accent: 'gold', description: 'Fortune has a habit of finding you.', doodle: '◇', id: 'lucky', name: 'Lucky' },
  { accent: 'green', description: 'Do what must be done, whatever the cost.', doodle: '†', id: 'ruthless', name: 'Ruthless' },
];

export const CUSTOM_ROLES = ['Huntsman', 'Self-Taught Mage', 'Relic Builder'];
export const CUSTOM_PORTRAITS = ['☽', '✦', '♙'];
