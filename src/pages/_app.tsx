import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Geist_Mono, Hanken_Grotesk } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";

const hanken = Hanken_Grotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-hanken",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist-mono",
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
        <div
            className={`${hanken.variable} ${geistMono.variable} font-sans`}
        >
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
