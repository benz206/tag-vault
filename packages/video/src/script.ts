import cues from './cues.json';

export const fps = 30;

export type SceneId =
  | 'intro'
  | 'scatter'
  | 'code'
  | 'search'
  | 'discover'
  | 'outro';

export type Scene = { id: SceneId; at: number; until: number; line: string };

export const scenes: Scene[] = [
  {
    id: 'intro',
    at: 0,
    until: 5,
    line: 'Meet TagVault. Every Carl-bot tag, in one place.'
  },
  {
    id: 'scatter',
    at: 5,
    until: 11,
    line: "Thousands of tags are scattered across Discord servers, buried in channels you'll never find."
  },
  {
    id: 'code',
    at: 11,
    until: 20,
    line: 'TagVault archives them and highlights the TagScript, so you know exactly what a tag does before you use it.'
  },
  {
    id: 'search',
    at: 20,
    until: 28,
    line: "Press Command K, type what you're after, and jump straight to it."
  },
  {
    id: 'discover',
    at: 28,
    until: 35,
    line: 'Browse featured, most used, and newest tags, then favorite the ones you love.'
  },
  {
    id: 'outro',
    at: 35,
    until: 41,
    line: 'TagVault. TagScript tags, ready to copy.'
  }
];

export const seconds = scenes[scenes.length - 1].until;

export const narration = {
  source: 'audio/narration-source.mp3',
  file: 'audio/narration-aligned.wav',
  cues: cues as { scene: SceneId; start: number; end: number }[]
};
