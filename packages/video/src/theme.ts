import { loadFont as loadMono } from '@remotion/google-fonts/GeistMono';
import { loadFont as loadSans } from '@remotion/google-fonts/HankenGrotesk';
import type { TagScriptTokenKind } from '@tag-vault/tagscript';

export const sans = loadSans('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin']
}).fontFamily;

export const mono = loadMono('normal', {
  weights: ['400', '500'],
  subsets: ['latin']
}).fontFamily;

export const color = {
  canvas: '#181825',
  surface: '#1e1e2e',
  subtle: '#11111b',
  chip: '#313244',
  line: '#313244',
  lineStrong: '#45475a',
  ink: '#cdd6f4',
  ink2: '#bac2de',
  muted: '#9399b2',
  faint: '#6c7086',
  rosewater: '#f5e0dc',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe'
};

export const tagColors = [
  color.pink,
  color.mauve,
  color.peach,
  color.green,
  color.sky,
  color.yellow,
  color.lavender,
  color.teal,
  color.red,
  color.blue
];

export const tokenColors: Record<TagScriptTokenKind, string> = {
  text: color.ink2,
  brace: color.red,
  punct: color.blue,
  block: color.green,
  control: color.yellow,
  param: color.mauve,
  compare: color.pink,
  math: color.maroon,
  separator: color.peach,
  literal: color.sky
};
