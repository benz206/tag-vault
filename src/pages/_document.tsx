import { Html, Head, Main, NextScript } from "next/document";

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="dns-prefetch" href="https://cdn.discordapp.com" />
                <link rel="preconnect" href="https://cdn.discordapp.com" />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
