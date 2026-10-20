import {
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import type { TagSummary } from "@/types";
import {
    TagCard,
    TagCardSkeleton,
    TagRow,
    TagRowSkeleton,
    rowTemplate,
    type TagColumn,
} from "@/components/Tagbox";
import { buttonClass } from "@/components/buttons";

const PAGE_SIZE = 21;
const PREFS_KEY = "taglist-prefs";
const CONTROL_CLASSES =
    "inline-flex items-center gap-1.5 h-8 text-sm border rounded-md bg-surface border-line text-ink hover:bg-subtle transition-colors";

const SORTS = {
    default: "Default",
    uses: "Most used",
    newest: "Newest",
    oldest: "Oldest",
    name: "Name",
};
type SortKey = keyof typeof SORTS;

const COLUMNS: { key: TagColumn; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "owner", label: "Owner" },
    { key: "uses", label: "Uses" },
    { key: "created", label: "Created" },
];

type Prefs = { view: "list" | "grid"; sort: SortKey; columns: TagColumn[] };

const DEFAULT_PREFS: Prefs = {
    view: "list",
    sort: "default",
    columns: COLUMNS.map((c) => c.key),
};

const prefsListeners = new Set<() => void>();
let memoryPrefs: string | null = null;

function subscribePrefs(listener: () => void) {
    prefsListeners.add(listener);
    return () => prefsListeners.delete(listener);
}

function readPrefs(): string | null {
    if (memoryPrefs !== null) return memoryPrefs;
    try {
        return localStorage.getItem(PREFS_KEY);
    } catch {
        return null;
    }
}

function usePrefs() {
    const raw = useSyncExternalStore(subscribePrefs, readPrefs, () => null);
    const prefs: Prefs = raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;

    function update(next: Partial<Prefs>) {
        memoryPrefs = JSON.stringify({ ...prefs, ...next });
        try {
            localStorage.setItem(PREFS_KEY, memoryPrefs);
        } catch {}
        prefsListeners.forEach((listener) => listener());
    }

    return [prefs, update] as const;
}

function sortTags(tags: TagSummary[], sort: SortKey): TagSummary[] {
    const time = (tag: TagSummary) => new Date(tag.created_at).getTime();
    switch (sort) {
        case "uses":
            return [...tags].sort((a, b) => b.uses - a.uses);
        case "newest":
            return [...tags].sort((a, b) => time(b) - time(a));
        case "oldest":
            return [...tags].sort((a, b) => time(a) - time(b));
        case "name":
            return [...tags].sort((a, b) =>
                a.tag_name.localeCompare(b.tag_name)
            );
        default:
            return tags;
    }
}

type TaglistProps = {
    tags: TagSummary[] | undefined;
    error?: unknown;
    summary?: ReactNode;
    defaultSortLabel?: string;
    skeletonCount?: number;
};

export default function Taglist({
    tags,
    error,
    summary,
    defaultSortLabel = SORTS.default,
    skeletonCount = 6,
}: TaglistProps) {
    const [prefs, setPrefs] = usePrefs();
    const [page, setPage] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const sorted = tags ? sortTags(tags, prefs.sort) : undefined;
    const pageCount = Math.ceil((sorted?.length ?? 0) / PAGE_SIZE);
    const pageTags = sorted?.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const grid = prefs.view === "grid";

    function goToPage(next: number) {
        setPage(next);
        listRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <div ref={listRef} className="scroll-mt-24">
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {summary && <div className="text-sm text-muted">{summary}</div>}
                <div className="flex flex-wrap items-center gap-2 ml-auto">
                    <label className="relative">
                        <span className="sr-only">Sort by</span>
                        <select
                            value={prefs.sort}
                            onChange={(e) => {
                                setPrefs({ sort: e.target.value as SortKey });
                                setPage(0);
                            }}
                            className={`${CONTROL_CLASSES} pl-3 pr-8 appearance-none cursor-pointer`}
                        >
                            {Object.entries(SORTS).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {key === "default"
                                        ? defaultSortLabel
                                        : label}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute -translate-y-1/2 pointer-events-none right-2.5 top-1/2 size-3.5 text-muted"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                        >
                            <path d="m4 6 4 4 4-4" />
                        </svg>
                    </label>
                    <ColumnsMenu
                        columns={prefs.columns}
                        onChange={(columns) => setPrefs({ columns })}
                    />
                    <div
                        className="inline-flex p-0.5 rounded-md bg-chip"
                        role="group"
                        aria-label="View"
                    >
                        <ViewButton
                            label="List view"
                            active={!grid}
                            onClick={() => setPrefs({ view: "list" })}
                        >
                            <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
                        </ViewButton>
                        <ViewButton
                            label="Grid view"
                            active={grid}
                            onClick={() => setPrefs({ view: "grid" })}
                        >
                            <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
                            <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
                            <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
                            <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
                        </ViewButton>
                    </div>
                </div>
            </div>
            {error ? (
                <p className="px-4 py-10 text-sm text-center border rounded-xl bg-surface border-line text-muted">
                    Couldn&apos;t load these tags. Refresh the page to try
                    again.
                </p>
            ) : grid ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pageTags
                        ? pageTags.map((tag) => (
                              <TagCard
                                  key={tag.id}
                                  tag={tag}
                                  columns={prefs.columns}
                              />
                          ))
                        : Array.from({ length: skeletonCount }, (_, i) => (
                              <TagCardSkeleton key={i} />
                          ))}
                </div>
            ) : (
                <div className="overflow-hidden border divide-y rounded-xl bg-surface border-line divide-line">
                    <div
                        style={{
                            gridTemplateColumns: rowTemplate(prefs.columns),
                        }}
                        className="hidden py-2.5 pl-6 pr-5 text-xs sm:grid gap-x-6 bg-subtle text-muted"
                    >
                        <span>Name</span>
                        {COLUMNS.filter((c) =>
                            prefs.columns.includes(c.key)
                        ).map((c) => (
                            <span
                                key={c.key}
                                className={
                                    c.key === "uses" || c.key === "created"
                                        ? "text-right"
                                        : ""
                                }
                            >
                                {c.label}
                            </span>
                        ))}
                    </div>
                    {pageTags
                        ? pageTags.map((tag) => (
                              <TagRow
                                  key={tag.id}
                                  tag={tag}
                                  columns={prefs.columns}
                              />
                          ))
                        : Array.from({ length: skeletonCount }, (_, i) => (
                              <TagRowSkeleton key={i} />
                          ))}
                </div>
            )}
            {pageCount > 1 && (
                <nav
                    className="flex items-center justify-between mt-4 text-sm text-muted"
                    aria-label="Pagination"
                >
                    <span className="tabular-nums">
                        Page {page + 1} of {pageCount}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 0}
                            className={buttonClass("secondary", "sm")}
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            onClick={() => goToPage(page + 1)}
                            disabled={page >= pageCount - 1}
                            className={buttonClass("secondary", "sm")}
                        >
                            Next
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
}

function ViewButton({
    label,
    active,
    onClick,
    children,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            className={`grid rounded size-7 place-items-center transition-colors ${
                active
                    ? "bg-surface text-ink shadow-sm"
                    : "text-muted hover:text-ink"
            }`}
        >
            <svg
                className="size-4"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                aria-hidden="true"
            >
                {children}
            </svg>
        </button>
    );
}

function ColumnsMenu({
    columns,
    onChange,
}: {
    columns: TagColumn[];
    onChange: (columns: TagColumn[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function close(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [open]);

    function toggle(key: TagColumn) {
        onChange(
            columns.includes(key)
                ? columns.filter((c) => c !== key)
                : COLUMNS.map((c) => c.key).filter(
                      (c) => c === key || columns.includes(c)
                  )
        );
    }

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={`${CONTROL_CLASSES} px-3`}
            >
                Columns
            </button>
            {open && (
                <div className="absolute right-0 z-10 p-1 mt-2 border shadow-lg w-44 rounded-xl top-full bg-surface border-line shadow-black/5 motion-safe:animate-drop">
                    {COLUMNS.map((column) => (
                        <label
                            key={column.key}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-chip"
                        >
                            <input
                                type="checkbox"
                                checked={columns.includes(column.key)}
                                onChange={() => toggle(column.key)}
                                className="accent-rose-600 size-3.5"
                            />
                            {column.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
