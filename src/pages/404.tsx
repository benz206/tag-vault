import Head from "next/head";
import Link from "next/link";
import { buttonClass } from "@/components/buttons";

export default function Custom404() {
    return (
        <>
            <Head>
                <title>Not Found | TagVault</title>
            </Head>
            <div className="max-w-6xl px-4 py-32 mx-auto text-center sm:px-6">
                <h1 className="text-3xl font-semibold tracking-tight">
                    Page not found
                </h1>
                <p className="mt-2 text-neutral-400">
                    Check the address, or head back to the homepage.
                </p>
                <Link href="/" className={`${buttonClass("primary")} mt-8`}>
                    Go to homepage
                </Link>
            </div>
        </>
    );
}
