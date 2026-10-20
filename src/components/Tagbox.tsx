'use client';

import Link from 'next/link';
import type { Owner, TagListItem, TagSummary } from '@tag-vault/db';
import Avatar from '@/components/Avatar';
import { getTagColor, formatDate } from '@/utils';
import Pill from '@/components/Pill';

export type TagColumn = 'description' | 'owner' | 'uses' | 'created';

export function rowTemplate(columns: TagColumn[]): string {
  const show = (column: TagColumn) => columns.includes(column);
  return [
    show('description') ? 'minmax(0,13rem)' : 'minmax(0,1fr)',
    show('description') && 'minmax(0,1fr)',
    show('owner') && 'minmax(0,9rem)',
    show('uses') && '4.5rem',
    show('created') && '6.5rem'
  ]
    .filter(Boolean)
    .join(' ');
}

export function OwnerLabel({ owner }: { owner: Owner }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      <Avatar owner={owner} size={16} />
      <span className="truncate">{owner.name}</span>
    </span>
  );
}

function TagName({ tag }: { tag: TagSummary }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="truncate font-mono text-sm text-ink">
        {tag.tag_name}
      </span>
      {!tag.shared && <Pill>Private</Pill>}
      {tag.nsfw && <Pill>NSFW</Pill>}
      {tag.hidden && <Pill>Hidden</Pill>}
    </div>
  );
}

export function TagRow({
  tag,
  columns
}: {
  tag: TagListItem;
  columns: TagColumn[];
}) {
  const show = (column: TagColumn) => columns.includes(column);
  return (
    <Link
      href={`/tags/${tag.id}`}
      style={{ gridTemplateColumns: rowTemplate(columns) }}
      className="relative grid items-center gap-x-6 py-4 pr-5 pl-6 text-sm transition-colors hover:bg-subtle focus-visible:-outline-offset-2 max-sm:flex max-sm:flex-wrap max-sm:gap-y-1.5"
    >
      <span
        className={`absolute inset-y-3 left-0 w-[3px] rounded-r bg-${getTagColor(tag.id, Number(tag.owner_id))}`}
        aria-hidden="true"
      />
      <div className="max-sm:w-full">
        <TagName tag={tag} />
      </div>
      {show('description') && (
        <p className="line-clamp-2 text-ink-3 max-sm:w-full sm:line-clamp-1">
          {tag.description || 'No description'}
        </p>
      )}
      {show('owner') && (
        <div className="text-xs text-muted">
          <OwnerLabel owner={tag.owner} />
        </div>
      )}
      {show('uses') && (
        <span className="text-xs text-muted tabular-nums sm:text-right">
          {tag.uses.toLocaleString()}
          <span className="sm:hidden"> uses</span>
        </span>
      )}
      {show('created') && (
        <span className="text-xs text-muted tabular-nums sm:text-right">
          {formatDate(new Date(tag.created_at))}
        </span>
      )}
    </Link>
  );
}

export function TagCard({
  tag,
  columns
}: {
  tag: TagListItem;
  columns: TagColumn[];
}) {
  const show = (column: TagColumn) => columns.includes(column);
  return (
    <Link
      href={`/tags/${tag.id}`}
      className="relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-5 transition hover:border-line-strong hover:shadow-sm"
    >
      <span
        className={`absolute inset-x-0 top-0 h-[3px] bg-${getTagColor(tag.id, Number(tag.owner_id))}`}
        aria-hidden="true"
      />
      <TagName tag={tag} />
      {show('description') && (
        <p className="mt-2 line-clamp-3 text-sm text-ink-3">
          {tag.description || 'No description'}
        </p>
      )}
      {(show('owner') || show('uses') || show('created')) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-muted tabular-nums">
          {show('owner') && <OwnerLabel owner={tag.owner} />}
          {show('uses') && <span>{tag.uses.toLocaleString()} uses</span>}
          {show('created') && (
            <span>{formatDate(new Date(tag.created_at))}</span>
          )}
        </div>
      )}
    </Link>
  );
}

export function TagRowSkeleton() {
  return (
    <div className="flex items-center gap-6 py-4 pr-5 pl-6" aria-hidden="true">
      <div className="h-4 w-32 animate-pulse rounded bg-line" />
      <div className="h-4 flex-1 animate-pulse rounded bg-chip" />
    </div>
  );
}

export function TagCardSkeleton() {
  return (
    <div
      className="h-36 rounded-xl border border-line bg-surface p-5"
      aria-hidden="true"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-line" />
      <div className="mt-4 h-3 w-full animate-pulse rounded bg-chip" />
      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-chip" />
    </div>
  );
}
