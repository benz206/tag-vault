import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono, tagColors } from '../theme';

const names = [
  '8ball',
  'rps',
  'coinflip',
  'buildembed',
  'welcome',
  'rules',
  'giveaway',
  'poll',
  'avatar',
  'serverinfo',
  'userinfo',
  'roll',
  'hug',
  'ship',
  'rate',
  'choose',
  'remind',
  'color',
  'afk',
  'quote',
  'timer',
  'calc',
  'roleinfo',
  'countdown',
  'slots',
  'trivia',
  'banner',
  'verify'
];

const columns = 7;
const cellWidth = 230;
const cellHeight = 86;
const gridLeft = (1920 - columns * cellWidth) / 2;
const gridTop = 400;
const converge = 96;

export function Scatter() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const swap = interpolate(frame, [converge, converge + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 150,
          width: '100%',
          textAlign: 'center',
          fontSize: 76,
          fontWeight: 600,
          letterSpacing: '-0.035em',
          opacity: headline,
          transform: `translateY(${(1 - headline) * 30}px)`
        }}
      >
        <div style={{ opacity: 1 - swap, position: 'absolute', width: '100%' }}>
          Thousands of tags.{' '}
          <span style={{ color: color.faint }}>Everywhere.</span>
        </div>
        <div
          style={{
            opacity: swap,
            transform: `translateY(${(1 - swap) * 20}px)`
          }}
        >
          Now in <span style={{ color: color.pink }}>one vault.</span>
        </div>
      </div>
      {names.map((name, i) => {
        const pop = spring({
          frame: frame - i * 2,
          fps,
          config: { damping: 11, mass: 0.5 }
        });
        const gather = spring({
          frame: frame - converge - (i % columns) * 1.5,
          fps,
          config: { damping: 16, mass: 0.8 }
        });
        const wobble = (1 - gather) * 14;
        const fromX =
          random(`x${i}`) * 1720 + Math.sin(frame / 22 + i) * wobble;
        const fromY =
          random(`y${i}`) * 720 + 290 + Math.cos(frame / 26 + i) * wobble;
        const toX = gridLeft + (i % columns) * cellWidth + 8;
        const toY = gridTop + Math.floor(i / columns) * cellHeight;
        const tilt = (random(`r${i}`) - 0.5) * 30 * (1 - gather);
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: interpolate(gather, [0, 1], [fromX, toX]),
              top: interpolate(gather, [0, 1], [fromY, toY]),
              width: cellWidth - 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderRadius: 14,
              background: color.surface,
              border: `1.5px solid ${color.line}`,
              boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
              fontFamily: mono,
              fontSize: 24,
              color: color.ink2,
              opacity: pop * interpolate(gather, [0, 1], [0.75, 1]),
              transform: `scale(${pop}) rotate(${tilt}deg)`
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                flexShrink: 0,
                background: tagColors[i % tagColors.length]
              }}
            />
            {name}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
