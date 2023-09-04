/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            spacing: {
                0: "2.00rem",
                128: "32rem",
            },
        },
        backgroundSize: {
            auto: "auto",
            cover: "cover",
            contain: "contain",
            "400%": "400%",
        },
    },
    safelist: [
        {
            pattern: /(border|shadow)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(500|600|700)/,
        },
    ],
    plugins: [],
};
