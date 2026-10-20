'use client';

import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import RandomTagButton from '@/components/RandomTagButton';
import { buttonClass } from '@/components/buttons';

export default function HeroActions() {
  const { data: session } = useSession();

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/search" className={buttonClass('primary')}>
        Search tags
      </Link>
      {session ? (
        <Link href="/dashboard" className={buttonClass()}>
          View your tags
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
          className={buttonClass()}
        >
          Sign in with Discord
        </button>
      )}
      <RandomTagButton />
    </div>
  );
}
