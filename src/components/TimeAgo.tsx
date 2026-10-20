'use client';

import { getTimeSince } from '@/utils';

export default function TimeAgo({ date }: { date: string }) {
  return (
    <span suppressHydrationWarning>{getTimeSince(new Date(date))} ago</span>
  );
}
