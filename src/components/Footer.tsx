export default function Footer() {
    return (
        <footer className="bg-white border-t border-stone-200">
            <div className="flex flex-col max-w-6xl gap-2 px-4 py-8 mx-auto text-sm sm:flex-row sm:px-6 text-stone-500">
                <p>
                    © 2023{" "}
                    <a
                        className="transition-colors hover:text-stone-950"
                        href="https://github.com/Leg3ndary"
                    >
                        Leg3ndary
                    </a>
                </p>
                <p className="sm:ml-auto">
                    Not affiliated with BotLabs or Discord.
                </p>
            </div>
        </footer>
    );
}
