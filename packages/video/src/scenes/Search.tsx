import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono, tagColors } from '../theme';

const query = 'embed';

const items = [
  {
    section: 'Actions',
    label: `Search for “${query}”`,
    detail: 'See every matching tag'
  },
  {
    section: 'Tags',
    label: 'buildembed',
    detail: 'Build an embed from arguments',
    fill: tagColors[0]
  },
  {
    section: 'Tags',
    label: 'embedcolor',
    detail: 'Preview any hex color',
    fill: tagColors[4]
  },
  {
    section: 'Tags',
    label: 'welcome-embed',
    detail: 'Greet new members in style',
    fill: tagColors[3]
  },
  {
    section: 'Tags',
    label: 'rules-embed',
    detail: 'Server rules, formatted',
    fill: tagColors[2]
  },
  {
    section: 'Tags',
    label: 'poll-embed',
    detail: 'Quick reaction poll',
    fill: tagColors[1]
  }
];

const pressAt = 14;
const openAt = 34;
const typeAt = 56;
const framesPerChar = 6;
const downAt = 140;
const enterAt = 178;

function Key({ label, at }: { label: string; at: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - at, fps, config: { damping: 12 } });
  const pressed = frame >= at + 8 && frame < at + 16;
  return (
    <div
      style={{
        minWidth: 120,
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 30px',
        borderRadius: 24,
        background: color.surface,
        border: `2px solid ${color.lineStrong}`,
        boxShadow: pressed
          ? `0 2px 0 ${color.lineStrong}`
          : `0 10px 0 ${color.lineStrong}`,
        fontSize: 60,
        fontWeight: 500,
        opacity: pop,
        transform: `translateY(${pressed ? 8 : 0}px) scale(${pop})`
      }}
    >
      {label}
    </div>
  );
}

function Page() {
  return (
    <AbsoluteFill style={{ padding: '0 140px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 110,
          borderBottom: `1.5px solid ${color.line}`,
          fontSize: 32,
          fontWeight: 600
        }}
      >
        TagVault
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 60,
            width: 420,
            padding: '14px 22px',
            borderRadius: 12,
            background: color.chip,
            fontSize: 24,
            fontWeight: 400,
            color: color.faint
          }}
        >
          Search tags…
          <span style={{ marginLeft: 'auto', fontFamily: mono }}>⌘K</span>
        </div>
      </div>
      <div
        style={{
          marginTop: 70,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 36
        }}
      >
        {tagColors.slice(0, 6).map((fill) => (
          <div
            key={fill}
            style={{
              height: 260,
              borderRadius: 18,
              background: color.surface,
              border: `1.5px solid ${color.line}`,
              borderTop: `5px solid ${fill}`
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
}

export function Search() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = spring({ frame: frame - openAt, fps, config: { damping: 18 } });
  const leave = spring({
    frame: frame - enterAt - 14,
    fps,
    config: { damping: 200 }
  });
  const keysOut = interpolate(frame, [openAt - 4, openAt + 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });
  const typed = query.slice(
    0,
    Math.max(0, Math.floor((frame - typeAt) / framesPerChar) + 1)
  );
  const resultsAt = typeAt + framesPerChar * 2;
  const active = frame >= downAt ? 1 : 0;
  const flash = interpolate(
    frame,
    [enterAt, enterAt + 5, enterAt + 14],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          filter: `blur(${open * 6}px)`,
          opacity: 1 - open * 0.55
        }}
      >
        <Page />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 28,
          opacity: keysOut
        }}
      >
        <Key label="⌘" at={pressAt} />
        <Key label="K" at={pressAt + 4} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: (1920 - 1080) / 2,
          top: 170,
          width: 1080,
          overflow: 'hidden',
          borderRadius: 22,
          background: color.surface,
          border: `1.5px solid ${color.lineStrong}`,
          boxShadow: '0 50px 140px rgba(0,0,0,0.6)',
          opacity: open * (1 - leave),
          transform: `translateY(${(1 - open) * -40 + leave * -30}px) scale(${0.96 + open * 0.04 + leave * 0.04})`
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            height: 96,
            padding: '0 32px',
            borderBottom: `1.5px solid ${color.line}`,
            fontSize: 34
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 20 20"
            fill="none"
            stroke={color.faint}
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m17 17-3.5-3.5" />
          </svg>
          {typed ? (
            <span>
              {typed}
              <span
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 38,
                  marginLeft: 3,
                  verticalAlign: 'middle',
                  background: color.ink,
                  opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0
                }}
              />
            </span>
          ) : (
            <span style={{ color: color.faint }}>
              Search tags or type a command…
            </span>
          )}
          <span
            style={{
              marginLeft: 'auto',
              padding: '2px 12px',
              borderRadius: 8,
              border: `1.5px solid ${color.line}`,
              fontFamily: mono,
              fontSize: 22,
              color: color.faint
            }}
          >
            Esc
          </span>
        </div>
        <div style={{ padding: 14, minHeight: 640 }}>
          {items.map((item, i) => {
            const show = spring({
              frame: frame - resultsAt - i * 4,
              fps,
              config: { damping: 18 }
            });
            const heading =
              i === 0 || items[i - 1].section !== item.section
                ? item.section
                : null;
            const isActive = i === active;
            return (
              <div key={item.label} style={{ opacity: show }}>
                {heading && (
                  <div
                    style={{
                      padding: '14px 20px 8px',
                      fontSize: 20,
                      fontWeight: 500,
                      color: color.faint
                    }}
                  >
                    {heading}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    height: 76,
                    padding: '0 20px',
                    borderRadius: 14,
                    background: isActive
                      ? `color-mix(in srgb, ${color.chip}, ${color.pink} ${flash * 30}%)`
                      : 'transparent',
                    transform: `translateY(${(1 - show) * 16}px) scale(${isActive ? 1 - flash * 0.02 : 1})`
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 7,
                      background: item.fill ?? 'transparent',
                      border: item.fill ? 'none' : `2px solid ${color.faint}`
                    }}
                  />
                  <span
                    style={{
                      fontFamily: item.fill ? mono : undefined,
                      fontSize: 30
                    }}
                  >
                    {item.label}
                  </span>
                  <span style={{ fontSize: 24, color: color.muted }}>
                    {item.detail}
                  </span>
                  {isActive && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontFamily: mono,
                        fontSize: 26,
                        color: color.faint
                      }}
                    >
                      ↵
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}
