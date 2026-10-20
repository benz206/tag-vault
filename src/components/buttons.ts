const base =
    "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors disabled:opacity-40 disabled:pointer-events-none";

const variants = {
    primary: "bg-white text-black hover:bg-neutral-200",
    secondary:
        "border border-neutral-800 text-neutral-200 hover:bg-neutral-900 hover:text-white",
};

const sizes = {
    xs: "h-7 px-2.5 text-xs",
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
};

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClass(
    variant: ButtonVariant = "secondary",
    size: ButtonSize = "md"
): string {
    return `${base} ${variants[variant]} ${sizes[size]}`;
}
