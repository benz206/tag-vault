import { ImageResponse } from 'next/og';

export const alt = 'TagVault: TagScript tags, ready to copy.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const snippet = [
  ['{=(prefix):', '!', '}'],
  ['{=(tagName):', 'buildembed|be', '}'],
  ['{=(defaultColor):', '2f3136', '}']
];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: '#181825',
        color: '#cdd6f4'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            width: 16,
            height: 56,
            borderRadius: 8,
            background: 'linear-gradient(#f5c2e7, #f38ba8)'
          }}
        />
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2 }}>
          TagVault
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 72, letterSpacing: -3, lineHeight: 1.05 }}>
          TagScript tags, ready to copy.
        </div>
        <div style={{ fontSize: 32, color: '#9399b2' }}>
          Browse thousands of Carl-bot tags shared across Discord servers.
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '24px 32px',
          borderRadius: 16,
          border: '2px solid #313244',
          background: '#11111b',
          fontSize: 26
        }}
      >
        {snippet.map(([open, value, close]) => (
          <div key={value} style={{ display: 'flex' }}>
            <span style={{ color: '#cba6f7' }}>{open}</span>
            <span style={{ color: '#a6e3a1' }}>{value}</span>
            <span style={{ color: '#cba6f7' }}>{close}</span>
          </div>
        ))}
      </div>
    </div>,
    size
  );
}
