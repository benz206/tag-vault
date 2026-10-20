const TOKEN = /((?<=\{[\w=!]*)\([^(){}\n]*\)|[{}:|;])/;

export default function TagScriptCode({ source }: { source: string }) {
    return (
        <code>
            {source.split(TOKEN).map((part, i) => {
                if (i % 2 === 0) return part;
                if (part.startsWith("(")) {
                    return (
                        <span key={i} className="text-rose-600">
                            {part}
                        </span>
                    );
                }
                return (
                    <span key={i} className="text-stone-400">
                        {part}
                    </span>
                );
            })}
        </code>
    );
}
