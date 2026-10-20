export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>
          © 2023{' '}
          <a
            className="transition-colors hover:text-ink"
            href="https://github.com/benz206"
          >
            benz206
          </a>
        </p>
        <p className="sm:ml-auto">Not affiliated with BotLabs or Discord.</p>
      </div>
    </footer>
  );
}
