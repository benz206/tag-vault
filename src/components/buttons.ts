const base =
    "inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap transition disabled:opacity-40 disabled:pointer-events-none";

const variants = {
    primary:
        "bg-linear-to-r from-pink-600 to-rose-600 text-white hover:brightness-110",
    dark: "bg-stone-950 text-white hover:bg-stone-800",
    secondary: "bg-stone-100 text-stone-950 hover:bg-stone-200",
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
