'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Owner } from '@tag-vault/db';

export default function Avatar({
  owner,
  size
}: {
  owner: Owner;
  size: number;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <Image
      className="shrink-0 rounded-full"
      src={failed ? owner.fallbackAvatarUrl : owner.avatarUrl}
      onError={() => setFailed(true)}
      alt=""
      width={size}
      height={size}
      unoptimized
    />
  );
}
