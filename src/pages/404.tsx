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
                <h1 className="text-4xl tracking-[-0.03em] sm:text-5xl">
                    Page not found
                </h1>
                <p className="mt-3 text-xl text-muted">
                    Check the address, or head back to the homepage.
                </p>
                <Link href="/" className={`${buttonClass("primary")} mt-8`}>
                    Go to homepage
                </Link>
            </div>
        </>
    );
}
