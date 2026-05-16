import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Not Found | TagVault</title>
            </Head>
            <div className="flex justify-center w-full h-full">
                <div className="flex flex-col flex-wrap content-center justify-center w-full h-128 bg-cyan-400 gap-4">
                    <h1>404 - Page Not Found</h1>
                    <Link
                        href="/"
                        className="px-6 py-2 text-center transition-colors duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-cyan-500"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </>
    );
}
