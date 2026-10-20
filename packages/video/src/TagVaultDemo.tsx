import type { ReactNode } from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame
} from 'remotion';
import { Code } from './scenes/Code';
import { Discover } from './scenes/Discover';
import { Intro } from './scenes/Intro';
import { Outro } from './scenes/Outro';
import { Scatter } from './scenes/Scatter';
import { Search } from './scenes/Search';
import { fps, narration, scenes, type SceneId } from './script';
import { color, sans } from './theme';

const components: Record<SceneId, () => ReactNode> = {
  intro: Intro,
  scatter: Scatter,
  code: Code,
  search: Search,
  discover: Discover,
  outro: Outro
};

function Backdrop() {
  const frame = useCurrentFrame();
  const drift = frame / fps;
  return (
    <AbsoluteFill style={{ background: color.canvas, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 1100,
          height: 1100,
          left: 1100 + Math.sin(drift * 0.4) * 160,
          top: -500 + Math.cos(drift * 0.3) * 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color.pink}2e, transparent 65%)`
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 1200,
          height: 1200,
          left: -500 + Math.cos(drift * 0.35) * 160,
          top: 300 + Math.sin(drift * 0.25) * 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color.mauve}24, transparent 65%)`
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${color.line} 1.5px, transparent 1.5px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: `0 ${-drift * 12}px`,
          opacity: 0.55,
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)'
        }}
      />
    </AbsoluteFill>
  );
}

function Fade({
  duration,
  children
}: {
  duration: number;
  children: ReactNode;
}) {
  const frame = useCurrentFrame();
  const ease = { easing: Easing.out(Easing.cubic) };
  const opacity = interpolate(
    frame,
    [0, 10, duration - 10, duration],
    [0, 1, 1, 0],
    { ...ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const blur = interpolate(
    frame,
    [0, 10, duration - 10, duration],
    [12, 0, 0, 12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return (
    <AbsoluteFill style={{ opacity, filter: `blur(${blur}px)` }}>
      {children}
    </AbsoluteFill>
  );
}

export function TagVaultDemo() {
  return (
    <AbsoluteFill style={{ fontFamily: sans, color: color.ink }}>
      <Backdrop />
      {narration.cues.length > 0 && <Audio src={staticFile(narration.file)} />}
      {scenes.map((scene) => {
        const Scene = components[scene.id];
        const duration = Math.round((scene.until - scene.at) * fps);
        return (
          <Sequence
            key={scene.id}
            name={scene.id}
            from={Math.round(scene.at * fps)}
            durationInFrames={duration}
          >
            <Fade duration={duration}>
              <Scene />
            </Fade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
