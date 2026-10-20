import { ImageResponse } from 'next/og';
import { canView, findTag } from '@tag-vault/db';
import SiteImage from '@/app/opengraph-image';

export const alt = 'A TagScript tag on TagVault';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export default async function Image({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tag = /^\d+$/.test(id) ? await findTag(Number(id)) : null;
  if (!tag || tag === 'removed' || !canView(tag)) return SiteImage();

  const lines = tag.content
    .split('\n')
    .filter((line) => line.trim())
    .slice(0, 4)
    .map((line) => clip(line, 64));

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 72,
        background: '#181825',
        color: '#cdd6f4'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 12,
            height: 40,
            borderRadius: 6,
            background: 'linear-gradient(#f5c2e7, #f38ba8)'
          }}
        />
        <div style={{ fontSize: 36, letterSpacing: -1 }}>TagVault</div>
        <div style={{ marginLeft: 'auto', fontSize: 28, color: '#9399b2' }}>
          {`${tag.uses.toLocaleString()} uses`}
        </div>
      </div>
      <div
        style={{
          marginTop: 48,
          fontSize: 80,
          letterSpacing: -3,
          lineHeight: 1.05
        }}
      >
        {clip(tag.tag_name, 28)}
      </div>
      {tag.description && (
        <div style={{ marginTop: 16, fontSize: 32, color: '#9399b2' }}>
          {clip(tag.description.replace(/\s+/g, ' '), 60)}
        </div>
      )}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          padding: '20px 28px',
          borderRadius: 16,
          border: '2px solid #313244',
          background: '#11111b',
          fontSize: 22,
          color: '#bac2de'
        }}
      >
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex' }}>
            {line}
          </div>
        ))}
      </div>
    </div>,
    size
  );
}
