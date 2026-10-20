import Link from 'next/link';
import { buttonClass } from '@/components/buttons';

export default function TagNotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">Tag not found</h1>
      <p className="mt-3 text-xl text-muted">
        It may have been deleted, made private, or be under review.
      </p>
      <Link href="/search" className={`${buttonClass('primary')} mt-8`}>
        Search tags
      </Link>
    </div>
  );
}
