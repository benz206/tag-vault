import Head from "next/head";

export default function PageHead() {
    return (
        <Head>
            <title>TagVault</title>
            <meta
                name="description"
                content="The best place to find TagScript tags."
                key="desc"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, minimum-scale=1"
            />
            <meta
                name="theme-color"
                content="#ffffff"
                media="(prefers-color-scheme: light)"
            />
            <meta
                name="theme-color"
                content="#0c0a09"
                media="(prefers-color-scheme: dark)"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}
