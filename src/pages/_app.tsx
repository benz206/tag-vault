import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Fira_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const firaSans = Fira_Sans({
    weight: ["400", "700"],
    subsets: ["latin"],
});

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <main className={firaSans.className}>
            <Layout>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </Layout>
        </main>
    );
}
