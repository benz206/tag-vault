import { useState } from 'react';
import { useRouter } from 'next/router';
import { buttonClass, type ButtonSize } from '@/components/buttons';

export async function openRandomTag(push: (url: string) => unknown) {
  const res = await fetch('/api/tags/random');
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  const { id } = (await res.json()) as { id: number };
  await push(`/tags/${id}`);
}

export default function RandomTagButton({
  size = 'md'
}: {
  size?: ButtonSize;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await openRandomTag(router.push);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={buttonClass('secondary', size)}
    >
      <svg
        className="size-4"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 4.5h2.5c3 0 4 7 7 7H14M2 11.5h2.5c1.2 0 2-1.1 2.7-2.4M11.5 9.5l2.5 2-2.5 2M11.5 2.5l2.5 2-2.5 2M9.5 6.4c.6-1 1.2-1.9 2-1.9H14" />
      </svg>
      {loading ? 'Finding…' : 'Surprise me'}
    </button>
  );
}
