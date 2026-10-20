import { tokenizeTagScript } from '@tag-vault/tagscript';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import { color, mono, tokenColors } from '../theme';

const source = `{=(COMMENT):User Settings}
{=(prefix):!}
{=(tagName):buildembed|be}
{=(defaultColor):2f3136}
{=(example):{prefix}{tagName} title:My title|desc:My description}
{if({args}==):Try {example}|Building your embed…}
{user(name)} made an embed in {server(name)}`;

const legend = [
  { label: 'Blocks', fill: tokenColors.block },
  { label: 'Control flow', fill: tokenColors.control },
  { label: 'Parameters', fill: tokenColors.param },
  { label: 'Comparisons', fill: tokenColors.compare },
  { label: 'Braces', fill: tokenColors.brace }
];

const typeStart = 24;
const typeEnd = 210;

export function Code() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 20 } });
  const typed = Math.round(
    interpolate(frame, [typeStart, typeEnd], [0, source.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    })
  );
  const caret = Math.floor(frame / 15) % 2 === 0 || typed < source.length;

  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 110px',
        gap: 80
      }}
    >
      <div style={{ width: 600, flexShrink: 0 }}>
        <div
          style={{
            fontSize: 78,
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            opacity: enter,
            transform: `translateY(${(1 - enter) * 30}px)`
          }}
        >
          Read it
          <br />
          <span style={{ color: color.faint }}>before you</span>
          <br />
          run it.
        </div>
        <div
          style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 14 }}
        >
          {legend.map((item, i) => {
            const pop = spring({
              frame: frame - 40 - i * 8,
              fps,
              config: { damping: 12 }
            });
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: color.chip,
                  fontSize: 24,
                  color: color.ink2,
                  opacity: pop,
                  transform: `scale(${pop})`
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: item.fill
                  }}
                />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: 1, perspective: 1800 }}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 20,
            border: `1.5px solid ${color.line}`,
            background: color.surface,
            boxShadow: `0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px ${color.subtle}`,
            opacity: enter,
            transform: `translateX(${(1 - enter) * 120}px) rotateY(${interpolate(frame, [0, 270], [-16, -4])}deg)`
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              height: 5,
              background: `linear-gradient(90deg, ${color.pink}, ${color.red})`
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 76,
              padding: '0 32px',
              borderBottom: `1.5px solid ${color.line}`,
              fontSize: 26
            }}
          >
            <span style={{ fontFamily: mono }}>buildembed</span>
            <span style={{ marginLeft: 'auto', color: color.muted }}>
              Open tag
            </span>
          </div>
          <pre
            style={{
              margin: 0,
              height: 440,
              padding: '28px 32px',
              background: color.subtle,
              fontFamily: mono,
              fontSize: 25,
              lineHeight: 1.75,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {tokenizeTagScript(source.slice(0, typed)).map((token, i) => (
              <span key={i} style={{ color: tokenColors[token.kind] }}>
                {token.text}
              </span>
            ))}
            <span
              style={{
                display: 'inline-block',
                width: 13,
                height: 30,
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                background: color.rosewater,
                opacity: caret ? 1 : 0
              }}
            />
          </pre>
        </div>
      </div>
    </AbsoluteFill>
  );
}
