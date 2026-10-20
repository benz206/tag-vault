export default function Footer() {
    return (
        <footer className="bg-canvas border-t border-line">
            <div className="flex flex-col max-w-6xl gap-2 px-4 py-8 mx-auto text-sm sm:flex-row sm:px-6 text-muted">
                <p>
                    © 2023{" "}
                    <a
                        className="transition-colors hover:text-ink"
                        href="https://github.com/benz206"
                    >
                        benz206
                    </a>
                </p>
                <p className="sm:ml-auto">
                    Not affiliated with BotLabs or Discord.
                </p>
            </div>
        </footer>
    );
}
