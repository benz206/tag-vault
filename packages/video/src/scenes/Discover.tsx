import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono, tagColors } from '../theme';

const tabs = ['Featured', 'Most used', 'Newest'];
const tabFrames = [0, 55, 110];

const pool = [
  {
    name: 'buildembed',
    detail: 'Build an embed from arguments',
    owner: 'nova',
    uses: '48.2k'
  },
  {
    name: '8ball',
    detail: 'Ask the magic 8-ball anything',
    owner: 'kai',
    uses: '31.9k'
  },
  {
    name: 'giveaway',
    detail: 'Run a reaction giveaway with a timer',
    owner: 'mira',
    uses: '22.4k'
  },
  {
    name: 'rps',
    detail: 'Rock, paper, scissors against the bot',
    owner: 'jun',
    uses: '19.7k'
  },
  {
    name: 'serverinfo',
    detail: 'Members, roles and boosts at a glance',
    owner: 'ash',
    uses: '17.1k'
  },
  {
    name: 'ship',
    detail: 'Calculate the love between two members',
    owner: 'lux',
    uses: '15.3k'
  },
  {
    name: 'welcome',
    detail: 'Greet new members with a random line',
    owner: 'rio',
    uses: '12.8k'
  },
  {
    name: 'trivia',
    detail: 'A random question with hidden answer',
    owner: 'sol',
    uses: '9.6k'
  },
  {
    name: 'countdown',
    detail: 'Time left until any date',
    owner: 'eve',
    uses: '8.1k'
  },
  {
    name: 'slots',
    detail: 'Spin the slot machine',
    owner: 'zed',
    uses: '6.4k'
  },
  {
    name: 'roleinfo',
    detail: 'Color, position and member count',
    owner: 'ivy',
    uses: '4.9k'
  },
  {
    name: 'verify',
    detail: 'Hand out a role after a check',
    owner: 'oak',
    uses: '3.2k'
  }
];

const cardWidth = 540;
const cardHeight = 250;
const gap = 40;
const gridLeft = (1920 - (cardWidth * 3 + gap * 2)) / 2;
const gridTop = 340;
const favoriteCard = 1;
const heart = {
  x: gridLeft + favoriteCard * (cardWidth + gap) + cardWidth - 56,
  y: gridTop + cardHeight - 52
};
const clickAt = 166;

function Heart({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M12 20.5s-7.5-4.6-9.4-9.3C1.4 8.1 3.5 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.5 0 5.6 3.6 4.4 6.7-1.9 4.7-9.4 9.3-9.4 9.3Z"
        fill={filled ? color.pink : 'none'}
        stroke={filled ? color.pink : color.faint}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cursor() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const move = spring({
    frame: frame - 122,
    fps,
    config: { damping: 22, mass: 1.2 }
  });
  const press = frame >= clickAt && frame < clickAt + 6 ? 0.85 : 1;
  const x = interpolate(move, [0, 1], [1700, heart.x + 6]);
  const y = interpolate(move, [0, 1], [1100, heart.y + 10]);
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 24 24"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${press})`,
        transformOrigin: 'top left',
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
      }}
    >
      <path
        d="M4 2.5v17.2l4.6-4.4 3 6.6 3-1.3-3-6.5h6.4L4 2.5Z"
        fill={color.ink}
        stroke={color.subtle}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Discover() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const tab = tabFrames.filter((at) => frame >= at).length - 1;
  const since = frame - tabFrames[tab];
  const slide = spring({
    frame: since,
    fps,
    config: { damping: 18 }
  });
  const pillX = interpolate(
    slide,
    [0, 1],
    [Math.max(0, tab - 1) * 200, tab * 200]
  );
  const liked = frame >= clickAt;
  const pop = spring({
    frame: frame - clickAt,
    fps,
    config: { damping: 8, mass: 0.5 }
  });
  const burst = interpolate(frame, [clickAt, clickAt + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: gridLeft,
          top: 130,
          fontSize: 60,
          fontWeight: 600,
          letterSpacing: '-0.035em',
          opacity: enter,
          transform: `translateY(${(1 - enter) * 24}px)`
        }}
      >
        Discover tags.{' '}
        <span style={{ color: color.faint }}>
          Hand-picked, most used, and newest.
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: gridLeft,
          top: 238,
          display: 'flex',
          padding: 6,
          borderRadius: 999,
          background: color.chip,
          opacity: enter
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 6 + pillX,
            width: 200,
            height: 52,
            borderRadius: 999,
            background: color.ink
          }}
        />
        {tabs.map((label, i) => (
          <div
            key={label}
            style={{
              position: 'relative',
              width: 200,
              height: 52,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 500,
              color: i === tab ? color.subtle : color.muted
            }}
          >
            {label}
          </div>
        ))}
      </div>
      {Array.from({ length: 6 }, (_, i) => {
        const tag = pool[(tab * 4 + i) % pool.length];
        const fill = tagColors[(tab * 4 + i) % tagColors.length];
        const show = spring({
          frame: since - i * 3,
          fps,
          config: { damping: 15 }
        });
        const isFavorite = tab === 2 && i === favoriteCard;
        return (
          <div
            key={`${tab}-${i}`}
            style={{
              position: 'absolute',
              left: gridLeft + (i % 3) * (cardWidth + gap),
              top: gridTop + Math.floor(i / 3) * (cardHeight + gap),
              width: cardWidth,
              height: cardHeight,
              overflow: 'hidden',
              borderRadius: 20,
              background: color.surface,
              border: `1.5px solid ${isFavorite && liked ? color.pink : color.line}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              opacity: show,
              transform: `translateY(${(1 - show) * 40}px) scale(${0.94 + show * 0.06})`
            }}
          >
            <div style={{ height: 5, background: fill }} />
            <div style={{ padding: '26px 30px' }}>
              <div style={{ fontFamily: mono, fontSize: 32 }}>{tag.name}</div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 24,
                  lineHeight: 1.35,
                  color: color.muted
                }}
              >
                {tag.detail}
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                left: 30,
                right: 30,
                bottom: 28,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 22,
                color: color.ink2
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: fill,
                  color: color.subtle,
                  fontSize: 18,
                  fontWeight: 600
                }}
              >
                {tag.owner[0].toUpperCase()}
              </span>
              {tag.owner}
              <span style={{ color: color.faint }}>· {tag.uses} uses</span>
              <span
                style={{
                  position: 'relative',
                  marginLeft: 'auto',
                  display: 'flex',
                  transform:
                    isFavorite && liked
                      ? `scale(${0.6 + pop * 0.4})`
                      : undefined
                }}
              >
                {isFavorite && liked && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      border: `3px solid ${color.pink}`,
                      opacity: 1 - burst,
                      transform: `scale(${0.6 + burst * 1.6})`
                    }}
                  />
                )}
                <Heart filled={isFavorite && liked} size={34} />
              </span>
            </div>
          </div>
        );
      })}
      <Cursor />
    </AbsoluteFill>
  );
}
