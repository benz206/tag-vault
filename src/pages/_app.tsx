import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { Fira_Sans } from "next/font/google";

const firaSans = Fira_Sans({
    weight: ["400", "700"],
    subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={firaSans.className}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </main>
    );
}
