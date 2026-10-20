'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { buttonClass } from '@/components/buttons';

export default function SignInRequired({
  callbackUrl
}: {
  callbackUrl: string;
}) {
  useEffect(() => {
    signIn('discord', { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
      <p className="text-xl text-muted">
        Redirecting you to Discord to sign in…
      </p>
      <button
        type="button"
        onClick={() => signIn('discord', { callbackUrl })}
        className={`${buttonClass('primary')} mt-6`}
      >
        Sign in with Discord
      </button>
    </div>
  );
}
