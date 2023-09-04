// This is some fancy magic I thought about... How do we actually get a color for a tag?

export function getTagColor(tagID: number, ownerID: number): string {
    const colors = [
        "red",
        "orange",
        "amber",
        "yellow",
        "lime",
        "green",
        "emerald",
        "teal",
        "cyan",
        "sky",
        "blue",
        "indigo",
        "violet",
        "purple",
        "fuchsia",
        "pink",
        "rose",
    ];

    const shades = [500, 600, 700];
    const magicNumber = (tagID + ownerID) % 51;
    const color = colors[Math.floor(magicNumber / 3)];
    const shade = shades[magicNumber % 3];

    return `${color}-${shade}`;
}
