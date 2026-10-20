import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono } from '../theme';

const tag = 'Tag';
const vault = 'Vault';

export function Intro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const close = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, mass: 0.9 }
  });
  const gap = interpolate(close, [0, 1], [520, 0]);
  const tagline = spring({ frame: frame - 48, fps, config: { damping: 200 } });
  const zoom = interpolate(frame, [0, 150], [1, 1.06]);

  function letter(char: string, i: number, fill: string) {
    const enter = spring({
      frame: frame - 4 - i * 3,
      fps,
      config: { damping: 12, mass: 0.6 }
    });
    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          color: fill,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 80}px) rotate(${(1 - enter) * 12}deg)`
        }}
      >
        {char}
      </span>
    );
  }

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${zoom})`
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 210,
          fontWeight: 600,
          letterSpacing: '-0.045em',
          lineHeight: 1
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontWeight: 400,
            color: color.red,
            opacity: close,
            transform: `translateX(${-gap}px)`,
            marginRight: 28
          }}
        >
          {'{'}
        </span>
        {[...tag].map((char, i) => letter(char, i, color.ink))}
        {[...vault].map((char, i) =>
          letter(
            char,
            tag.length + i,
            interpolateColors(i, [0, vault.length - 1], [color.pink, color.red])
          )
        )}
        <span
          style={{
            fontFamily: mono,
            fontWeight: 400,
            color: color.red,
            opacity: close,
            transform: `translateX(${gap}px)`,
            marginLeft: 28
          }}
        >
          {'}'}
        </span>
      </div>
      <div
        style={{
          marginTop: 36,
          fontSize: 48,
          color: color.muted,
          letterSpacing: '-0.01em',
          opacity: tagline,
          transform: `translateY(${(1 - tagline) * 24}px)`
        }}
      >
        Every Carl-bot tag, in one place.
      </div>
    </AbsoluteFill>
  );
}
