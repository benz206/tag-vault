import { useRef, useState } from "react";
import useSWR from "swr";
import type { TagBatchQuery, TagSummary } from "@/types";
import Tagbox, { TagboxSkeleton } from "@/components/Tagbox";
import { buttonClass } from "@/components/buttons";

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

    return (
        <div ref={listRef} className="scroll-mt-20">
            <div className="overflow-hidden bg-white border divide-y rounded-xl border-stone-200 divide-stone-200">
                {error ? (
                    <p className="px-4 py-10 text-sm text-center text-stone-500">
                        Couldn&apos;t load these tags. Refresh the page to try
                        again.
                    </p>
                ) : tags ? (
                    tags.map((tag) => <Tagbox key={tag.id} tag={tag} />)
                ) : (
                    pageIds.map((id) => <TagboxSkeleton key={id} />)
                )}
            </div>
            {pageCount > 1 && (
                <nav
                    className="flex items-center justify-between mt-4 text-sm text-stone-500"
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
