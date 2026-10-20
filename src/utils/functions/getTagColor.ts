// This is some fancy magic I thought about... How do we actually get a color for a tag?

export function getTagColor(tagID: number, ownerID: number): string {
    const colors = [
        "rosewater",
        "flamingo",
        "pink",
        "mauve",
        "red",
        "maroon",
        "peach",
        "yellow",
        "green",
        "teal",
        "sky",
        "sapphire",
        "blue",
        "lavender",
    ];

    const magicNumber = (tagID + ownerID) % colors.length;

    return `ctp-${colors[magicNumber]}`;
}
