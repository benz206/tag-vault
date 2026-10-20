const base =
    "inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap transition disabled:opacity-40 disabled:pointer-events-none";

const variants = {
    primary:
        "bg-linear-to-r from-(--accent-from) to-(--accent-to) text-on-accent hover:brightness-105",
    dark: "bg-ink text-canvas hover:opacity-85",
    secondary: "bg-chip text-ink hover:bg-chip-hover",
};

const sizes = {
    xs: "h-7 px-2.5 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(
    variant: ButtonVariant = "secondary",
    size: ButtonSize = "md"
): string {
    return `${base} ${variants[variant]} ${sizes[size]}`;
}
