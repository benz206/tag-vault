import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono } from '../theme';

const copyAt = 62;

export function Outro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const button = spring({ frame: frame - 26, fps, config: { damping: 14 } });
  const copied = frame >= copyAt;
  const press = copied && frame < copyAt + 6 ? 0.94 : 1;
  const check = spring({ frame: frame - copyAt, fps, config: { damping: 10 } });
  const mark = spring({ frame: frame - 96, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          fontSize: 120,
          fontWeight: 600,
          letterSpacing: '-0.045em',
          textAlign: 'center',
          lineHeight: 1.02,
          opacity: headline,
          transform: `translateY(${(1 - headline) * 40}px)`
        }}
      >
        TagScript tags,
        <br />
        <span
          style={{
            backgroundImage: `linear-gradient(90deg, ${color.pink}, ${color.red})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          ready to copy.
        </span>
      </div>
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          height: 84,
          padding: '0 40px',
          borderRadius: 18,
          background: copied ? color.green : color.ink,
          color: color.subtle,
          fontSize: 32,
          fontWeight: 600,
          opacity: button,
          transform: `translateY(${(1 - button) * 30}px) scale(${press})`
        }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color.subtle}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {copied ? (
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              strokeDasharray="22"
              strokeDashoffset={22 * (1 - check)}
            />
          ) : (
            <>
              <rect x="8" y="8" width="12" height="12" rx="2" />
              <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
            </>
          )}
        </svg>
        {copied ? 'Copied' : 'Copy TagScript'}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          opacity: mark,
          transform: `translateY(${(1 - mark) * 20}px)`
        }}
      >
        <div
          style={{ fontSize: 44, fontWeight: 600, letterSpacing: '-0.03em' }}
        >
          <span style={{ fontFamily: mono, fontWeight: 400, color: color.red }}>
            {'{ '}
          </span>
          TagVault
          <span style={{ fontFamily: mono, fontWeight: 400, color: color.red }}>
            {' }'}
          </span>
        </div>
        <div
          style={{
            fontSize: 20,
            color: color.faint,
            opacity: interpolate(frame, [110, 130], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp'
            })
          }}
        >
          Not affiliated with or endorsed by BotLabs.
        </div>
      </div>
    </AbsoluteFill>
  );
}
