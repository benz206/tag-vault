import { useState } from "react";
import {
    buttonClass,
    type ButtonSize,
    type ButtonVariant,
} from "@/components/buttons";

export default function CopyButton({
    text,
    label = "Copy",
    variant = "secondary",
    size = "md",
    className = "",
}: {
    text: string;
    label?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
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
            className={`${buttonClass(variant, size)} ${className}`}
            aria-label={label}
        >
            <svg
                className="size-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
            >
                {copied ? (
                    <path d="m3.5 8.5 3 3 6-7" />
                ) : (
                    <>
                        <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                        <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
                    </>
                )}
            </svg>
            {copied ? "Copied" : label}
        </button>
    );
}
