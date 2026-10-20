import Link from 'next/link';
import { buttonClass } from '@/components/buttons';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center sm:px-6">
      <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 text-xl text-muted">
        Check the address, or head back to the homepage.
      </p>
      <Link href="/" className={`${buttonClass('primary')} mt-8`}>
        Go to homepage
      </Link>
    </div>
  );
}
