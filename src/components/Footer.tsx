export default function Footer() {
    return (
        <div className="relative bottom-0 flex flex-row flex-wrap content-center w-full h-16 p-8 bg-slate-900">
            <p className="text-xs font-semibold text-slate-700 lg:text-md">
                Copyright ©{" "}
                <a
                    className="text-slate-700"
                    href="https://github.com/Leg3ndary"
                >
                    <span className="text-xs font-bold lg:text-md">
                        Leg3ndary
                    </span>
                </a>
                , 2023
            </p>
            <p className="ml-auto text-xs font-bold text-slate-700 lg:text-md">
                This project is not affiliated with BotLabs or Discord.
            </p>
        </div>
    );
}
