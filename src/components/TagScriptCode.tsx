const TOKEN = /((?<=\{[\w=!]*)\([^(){}\n]*\)|[{}:|;])/;

export default function TagScriptCode({ source }: { source: string }) {
    return (
        <code>
            {source.split(TOKEN).map((part, i) => {
                if (i % 2 === 0) return part;
                if (part.startsWith("(")) {
                    return (
                        <span key={i} className="text-accent">
                            {part}
                        </span>
                    );
                }
                return (
                    <span key={i} className="text-neutral-500">
                        {part}
                    </span>
                );
            })}
        </code>
    );
}
