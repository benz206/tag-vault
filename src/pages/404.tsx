import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Not Found | TagVault</title>
            </Head>
            <div className="flex justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center w-full gap-6 h-96 lg:h-128 bg-gradient-to-r from-pink-500 to-rose-500">
                    <h1 className="px-4 text-4xl text-center lg:text-7xl">
                        404 - Page Not Found
                    </h1>
                    <Link
                        href="/"
                        className="px-6 py-2 text-center transition-colors duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-rose-500"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </>
    );
}
