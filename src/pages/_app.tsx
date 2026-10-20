import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Fira_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

const firaSans = Fira_Sans({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 60_000,
    fetcher: async (resource: string, init?: RequestInit) => {
        const r = await fetch(resource, init);
        if (!r.ok) throw new Error(`Request failed ${r.status}`);
        return r.json();
    },
};

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <div className={firaSans.className}>
            <SessionProvider session={session}>
                <SWRConfig value={swrConfig}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SWRConfig>
            </SessionProvider>
        </div>
    );
}
