import { cache, type ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { countTagFavorites, findTag, isFavorite } from '@tag-vault/db';
import CopyButton from '@/components/CopyButton';
import FavoriteButton from '@/components/FavoriteButton';
import { buttonClass } from '@/components/buttons';
import Pill from '@/components/Pill';
import TagOwnerActions from '@/components/TagOwnerActions';
import TagScriptCode from '@/components/TagScriptCode';
import { OwnerLabel } from '@/components/Tagbox';
import { getSession } from '@/lib/auth';
import { getOwner } from '@/lib/owners';
import { isPublic } from '@/lib/tags';
import { formatDate, getTagColor } from '@/utils';

type Params = Promise<{ id: string }>;

const loadTag = cache(async (rawId: string) =>
  /^\d+$/.test(rawId) ? findTag(Number(rawId)) : null
);

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const tag = await loadTag((await params).id);
  if (tag === 'removed') {
    return { title: 'Tag removed', robots: { index: false } };
  }
  if (!tag || !isPublic(tag)) return { title: 'Tag not found' };
  const description = tag.description ?? undefined;
  return {
    title: tag.tag_name,
    description,
    alternates: { canonical: `/tags/${tag.id}` },
    openGraph: {
      type: 'article',
      siteName: 'TagVault',
      title: tag.tag_name,
      description,
      url: `/tags/${tag.id}`
    }
  };
}

export default async function TagPage({ params }: { params: Params }) {
  const [tag, session] = await Promise.all([
    loadTag((await params).id),
    getSession()
  ]);
  if (tag === 'removed') return <TagRemoved />;
  const isOwner = !!tag && session?.user?.id === tag.owner_id;
  if (
    !tag ||
    tag.safe === 'not_safe' ||
    (!isOwner && (tag.deleted || tag.nsfw || tag.hidden))
  ) {
    notFound();
  }

  const hasEmbed = !!tag.embed && tag.embed !== '{}';
  const [owner, favoriteCount, favorited] = await Promise.all([
    getOwner(tag.owner_id),
    countTagFavorites(tag.id),
    session?.user?.id ? isFavorite(session.user.id, tag.id) : false
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 lg:pt-20">
      <header className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-end">
        <div className="relative min-w-0 pl-5">
          <span
            className={`absolute inset-y-1 left-0 w-[3px] rounded-full bg-${getTagColor(
              tag.id,
              Number(tag.owner_id)
            )}`}
            aria-hidden="true"
          />
          <h1 className="text-4xl tracking-[-0.03em] break-all sm:text-5xl">
            {tag.tag_name}
          </h1>
          {tag.description && (
            <p className="mt-3 max-w-2xl text-lg break-words whitespace-pre-line text-muted">
              {tag.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Pill>{tag.shared ? 'Shared' : 'Private'}</Pill>
            {tag.nsfw && <Pill>NSFW</Pill>}
            {tag.restricted && <Pill>Restricted</Pill>}
            {tag.deleted && <Pill>Deleted</Pill>}
            {tag.hidden && <Pill>Hidden</Pill>}
            {tag.safe && <Pill>{tag.safe}</Pill>}
          </div>
        </div>
        <div className="flex shrink-0 gap-2 self-start sm:ml-auto sm:self-auto">
          <FavoriteButton
            tagId={tag.id}
            favorited={favorited}
            count={favoriteCount}
          />
          <CopyButton
            text={tag.content}
            label="Copy content"
            variant="primary"
          />
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <CodePanel title="Content" text={tag.content} />
          {hasEmbed && <CodePanel title="Embed" text={tag.embed} />}
          <details className="group text-sm">
            <summary className="cursor-pointer text-muted select-none hover:text-ink">
              Raw JSON
            </summary>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-surface p-4 font-mono text-xs leading-5 whitespace-pre-wrap text-ink-3">
              {JSON.stringify(tag, null, 2)}
            </pre>
          </details>
        </div>
        <aside className="space-y-6">
          {isOwner && <TagOwnerActions tagId={tag.id} hidden={tag.hidden} />}
          <dl className="divide-y divide-line self-start rounded-xl border border-line bg-surface text-sm">
            <Detail label="Owner">
              <span className="flex justify-end">
                <OwnerLabel owner={owner} />
              </span>
            </Detail>
            <Detail label="Uses">{tag.uses.toLocaleString()}</Detail>
            <Detail label="Created">
              {formatDate(new Date(tag.created_at))}
            </Detail>
            <Detail label="Last fetched">
              {formatDate(new Date(tag.last_fetched))}
            </Detail>
            <Detail label="Tag ID" mono>
              {String(tag.id)}
            </Detail>
            <Detail label="Owner ID" mono>
              {tag.owner_id}
            </Detail>
            <Detail label="Guild ID" mono>
              {tag.guild_id || 'None'}
            </Detail>
            <Detail label="Sharer ID" mono>
              {tag.sharer || 'None'}
            </Detail>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function TagRemoved() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
        This tag was removed
      </h1>
      <p className="mt-3 text-xl text-muted">
        It no longer exists on Carl-bot or its owner deleted it.
      </p>
      <Link href="/search" className={`${buttonClass('primary')} mt-8`}>
        Search tags
      </Link>
    </div>
  );
}

function CodePanel({ title, text }: { title: string; text: string }) {
  const lineCount = text.split('\n').length;
  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex h-12 items-center gap-3 border-b border-line px-5">
        <h2 className="text-[15px]">{title}</h2>
        <span className="text-xs text-muted tabular-nums">
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
        <CopyButton text={text} label="Copy" size="xs" className="ml-auto" />
      </div>
      <pre className="max-h-[36rem] overflow-auto bg-subtle px-5 py-4 font-mono text-[13px] leading-6 break-words whitespace-pre-wrap text-ink-2">
        <TagScriptCode source={text} />
      </pre>
    </section>
  );
}

function Detail({
  label,
  mono = false,
  children
}: {
  label: string;
  mono?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd
        className={`min-w-0 truncate text-right ${
          mono ? 'font-mono text-xs select-all' : ''
        }`}
      >
        {children}
      </dd>
    </div>
  );
}
