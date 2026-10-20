export default function Footer() {
    return (
        <footer className="flex flex-col gap-1 w-full px-8 py-5 sm:flex-row sm:items-center bg-slate-900">
            <p className="text-xs font-semibold text-slate-400 lg:text-sm">
                Copyright ©{" "}
                <a
                    className="text-xs font-bold text-slate-300 hover:text-white lg:text-sm"
                    href="https://github.com/Leg3ndary"
                >
                    Leg3ndary
                </a>
                , 2023
            </p>
            <p className="text-xs font-bold sm:ml-auto text-slate-400 lg:text-sm">
                This project is not affiliated with BotLabs or Discord.
            </p>
        </footer>
    );
}
