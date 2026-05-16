import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
                <link rel="preconnect" href="https://cdn.discordapp.com" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
