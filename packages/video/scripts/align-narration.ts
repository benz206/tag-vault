import { spawnSync } from 'node:child_process';
import { narration, scenes, seconds } from '../src/script';

const filters = narration.cues.map((cue, i) => {
  const scene = scenes.find((s) => s.id === cue.scene)!;
  const window = scene.until - scene.at;
  const rate = Math.max(1, (cue.end - cue.start) / window);
  return `[0:a]atrim=start=${cue.start}:end=${cue.end},asetpts=PTS-STARTPTS,atempo=${rate},apad,atrim=duration=${window},adelay=${Math.round(scene.at * 1000)}:all=1[a${i}]`;
});
filters.push(
  `${narration.cues.map((_, i) => `[a${i}]`).join('')}amix=inputs=${narration.cues.length}:normalize=0,apad,atrim=duration=${seconds}[out]`
);
const result = spawnSync(
  'ffmpeg',
  [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    `public/${narration.source}`,
    '-filter_complex',
    filters.join(';'),
    '-map',
    '[out]',
    '-ar',
    '44100',
    '-c:a',
    'pcm_s16le',
    `public/${narration.file}`
  ],
  { stdio: 'inherit' }
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
