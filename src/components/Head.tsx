import Head from "next/head";

function Header() {
    return (
        <div>
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
            </Head>
        </div>
    );
}

export default Header;
