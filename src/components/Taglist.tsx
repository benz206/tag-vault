import { useRef, useState } from "react";
import useSWR from "swr";
import type { TagBatchQuery, TagSummary } from "@/types";
import Tagbox, { TagboxSkeleton } from "@/components/Tagbox";

const PAGE_SIZE = 21;

type TaglistProps = { ids: number[] } | { tags: TagSummary[] };

export default function Taglist(props: TaglistProps) {
    const [page, setPage] = useState(0);
    const listRef = useRef<HTMLDivElement>(null);

    const total = "ids" in props ? props.ids.length : props.tags.length;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const start = page * PAGE_SIZE;
    const pageIds =
        "ids" in props ? props.ids.slice(start, start + PAGE_SIZE) : [];

    const { data, error } = useSWR<TagBatchQuery>(
        pageIds.length > 0 ? `/api/tags/batch?ids=${pageIds.join(",")}` : null
    );

    const tags =
        "tags" in props
            ? props.tags.slice(start, start + PAGE_SIZE)
            : data?.tags;

    function goToPage(next: number) {
        setPage(next);
        listRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    if (error) {
        return (
            <p className="py-10 text-center">
                Sorry, these tags failed to load.
            </p>
        );
    }

    return (
        <div ref={listRef} className="flex flex-col items-center py-8 scroll-mt-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 2xl:grid-cols-3">
                {tags
                    ? tags.map((tag, i) => (
                          <div
                              key={tag.id}
                              className="motion-safe:animate-rise"
                              style={{ animationDelay: `${i * 60}ms` }}
                          >
                              <Tagbox tag={tag} />
                          </div>
                      ))
                    : pageIds.map((id) => <TagboxSkeleton key={id} />)}
            </div>
            {pageCount > 1 && (
                <nav
                    className="flex items-center gap-4 mt-10"
                    aria-label="Pagination"
                >
                    <button
                        type="button"
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 0}
                        className="px-4 py-1 transition-colors border-2 rounded-3xl border-cyan-400 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Previous
                    </button>
                    <span className="text-base text-slate-300">
                        Page {page + 1} of {pageCount}
                    </span>
                    <button
                        type="button"
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= pageCount - 1}
                        className="px-4 py-1 transition-colors border-2 rounded-3xl border-cyan-400 hover:bg-cyan-400 disabled:opacity-40 disabled:pointer-events-none"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}
