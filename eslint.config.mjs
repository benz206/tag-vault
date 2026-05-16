import next from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
    ...next,
    ...coreWebVitals,
    ...nextTypescript,
    {
        rules: {
            "@next/next/no-img-element": "warn",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
    },
    {
        ignores: [".next/**", "node_modules/**", "out/**", "public/**"],
    },
];

export default config;
