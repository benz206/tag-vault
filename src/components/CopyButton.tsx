import { useState } from "react";

export default function CopyButton({
    text,
    label = "Copy",
    className = "",
}: {
    text: string;
    label?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`px-3 py-1 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors text-sm ${className}`}
            aria-label={label}
            title={label}
        >
            {copied ? "Copied" : label}
        </button>
    );
}
