export type TagScriptTokenKind =
    | "text"
    | "brace"
    | "punct"
    | "block"
    | "control"
    | "param"
    | "compare"
    | "math"
    | "separator"
    | "literal";

export type TagScriptToken = { kind: TagScriptTokenKind; text: string };

const BLOCKS = new Set([
    "=", "var", "let", "assign", "user", "target", "server", "channel",
    "unix", "uses", "args", "message", "join", "mention", "replace",
    "contains", "strf", "#", "random", "rand", "urlencode", "td", "index",
    "list", "cycle", "in", "upper", "lower", "math", "m", "range", "?",
    "rangef", "embed",
]);

const CONTROL = new Set([
    "if", "any", "break", "all", "and", "or", "delete", "del", "silence",
    "dm", "override", "blacklist", "require", "redirect", "react", "reactu",
]);

const PARAMS = new Set([
    "avatar", "id", "created_at", "joined_at", "roleids", "color", "name",
    "proper", "position", "icon", "owner", "randomonline", "randomoffline",
    "members", "bots", "humans", "roles", "channels", "topic", "slowmode",
    "mention", "title", "url", "description", "timestamp", "trunc", "round",
    "abs",
]);

const LITERALS = new Set(["true", "false", "now"]);

const MATH_BLOCKS = new Set(["math", "m", "?"]);

const DECLARATION = /^[\w#?=]+/;
const WORD = /^\w+/;
const COMPARE = /^(==|!=|>=|<=|>|<)/;

export function tokenizeTagScript(source: string): TagScriptToken[] {
    const tokens: TagScriptToken[] = [];
    let i = 0;

    function push(kind: TagScriptTokenKind, text: string) {
        const last = tokens[tokens.length - 1];
        if (last && last.kind === kind) last.text += text;
        else tokens.push({ kind, text });
    }

    function readInner(stop: string, math: boolean) {
        while (
            i < source.length &&
            source[i] !== stop &&
            !(stop === ")" && source[i] === "}")
        ) {
            const rest = source.slice(i);
            if (source[i] === "{") {
                readBlock();
                continue;
            }
            const compare = COMPARE.exec(rest);
            if (compare && stop === ")") {
                push("compare", compare[0]);
                i += compare[0].length;
                continue;
            }
            if (source[i] === "|") {
                push("compare", "|");
                i++;
                continue;
            }
            if ("+-*/^".includes(source[i]) && (math || stop === ")")) {
                push("math", source[i]);
                i++;
                continue;
            }
            if (source[i] === "~" || source[i] === ",") {
                push("separator", source[i]);
                i++;
                continue;
            }
            const word = WORD.exec(rest);
            if (word) {
                const lower = word[0].toLowerCase();
                if (LITERALS.has(lower)) push("literal", word[0]);
                else if (stop === ")" && PARAMS.has(lower))
                    push("param", word[0]);
                else push("text", word[0]);
                i += word[0].length;
                continue;
            }
            push("text", source[i]);
            i++;
        }
    }

    function readBlock() {
        push("brace", "{");
        i++;
        const declaration = DECLARATION.exec(source.slice(i));
        const isMath = MATH_BLOCKS.has(declaration?.[0].toLowerCase() ?? "");
        if (declaration) {
            const lower = declaration[0].toLowerCase();
            push(
                CONTROL.has(lower)
                    ? "control"
                    : BLOCKS.has(lower)
                      ? "block"
                      : "text",
                declaration[0]
            );
            i += declaration[0].length;
        }
        if (source[i] === "(") {
            push("punct", "(");
            i++;
            readInner(")", false);
            if (source[i] === ")") {
                push("punct", ")");
                i++;
            }
        }
        if (source[i] === ":") {
            push("punct", ":");
            i++;
        }
        readInner("}", isMath);
        if (source[i] === "}") {
            push("brace", "}");
            i++;
        }
    }

    while (i < source.length) {
        if (source[i] === "{") readBlock();
        else {
            push("text", source[i]);
            i++;
        }
    }
    return tokens;
}
