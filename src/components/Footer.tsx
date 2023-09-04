export default function Footer() {
    return (
        <div className="flex flex-row w-full h-16 bg-slate-900 top-28 relative content-center flex-wrap p-8">
            <p className="text-slate-700 text-xs lg:text-md font-semibold">
                Copyright ©{" "}
                <a
                    className="text-slate-700"
                    href="https://github.com/Leg3ndary"
                >
                    <span className="text-xs lg:text-md font-bold">
                        Leg3ndary
                    </span>
                </a>
                , 2023
            </p>
            <p className="text-slate-700 text-xs lg:text-md font-bold ml-auto">
                This project is not affiliated with BotLabs or Discord.
            </p>
        </div>
    );
}
