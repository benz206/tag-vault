import {
    tokenizeTagScript,
    type TagScriptTokenKind,
} from "@/utils/functions/tokenizeTagScript";

const TOKEN_CLASSES: Record<TagScriptTokenKind, string> = {
    text: "",
    brace: "text-red-600 dark:text-red-400",
    punct: "text-blue-600 dark:text-blue-400",
    block: "text-green-700 dark:text-green-400",
    control: "text-amber-600 dark:text-amber-300",
    param: "text-fuchsia-600 dark:text-fuchsia-400",
    compare: "text-fuchsia-600 dark:text-fuchsia-400",
    math: "text-red-600 dark:text-red-400",
    separator: "text-amber-600 dark:text-amber-300",
    literal: "text-cyan-700 dark:text-cyan-400",
};

export default function TagScriptCode({ source }: { source: string }) {
    return (
        <code>
            {tokenizeTagScript(source).map((token, i) =>
                token.kind === "text" ? (
                    token.text
                ) : (
                    <span key={i} className={TOKEN_CLASSES[token.kind]}>
                        {token.text}
                    </span>
                )
            )}
        </code>
    );
}
