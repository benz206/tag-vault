import { writeFileSync } from 'node:fs';
import { narration, scenes } from '../src/script';

const voice = 'cgSgspJ2msm6clMCkdW9';
const text = scenes.map((scene) => scene.line).join(' <break time="1.0s" /> ');

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY!,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15 }
    })
  }
);
if (!response.ok)
  throw new Error(`${response.status} ${await response.text()}`);

const { audio_base64, alignment } = (await response.json()) as {
  audio_base64: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
};
writeFileSync(
  `public/${narration.source}`,
  Buffer.from(audio_base64, 'base64')
);

const spoken = alignment.characters.join('');
let cursor = 0;
const spans = scenes.map((scene) => {
  const first = spoken.indexOf(scene.line, cursor);
  if (first < 0) throw new Error(`Line not found in alignment: ${scene.line}`);
  cursor = first + scene.line.length;
  return {
    scene: scene.id,
    start: alignment.character_start_times_seconds[first],
    end: alignment.character_end_times_seconds[cursor - 1]
  };
});
const total = alignment.character_end_times_seconds.at(-1)!;
const cues = spans.map((span, i) => ({
  scene: span.scene,
  start: +Math.max(0, span.start - 0.05).toFixed(3),
  end: +Math.min(span.end + 0.2, spans[i + 1]?.start ?? total + 0.2).toFixed(3)
}));
writeFileSync('src/cues.json', JSON.stringify(cues, null, 2) + '\n');
console.table(cues);
