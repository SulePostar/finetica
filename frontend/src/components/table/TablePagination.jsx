import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function TablePagination({ page, perPage, total, onPageChange }) {
    const totalPages = Math.ceil(total / perPage);

    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <Pagination className="flex items-center justify-end">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        disabled={page === 1}
                        onClick={() => page > 1 && onPageChange(page - 1)}
                        className="hover:text-table-header hover:dark:bg-white"
                    />
                </PaginationItem>

                {pages.map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            isActive={p === page}
                            onClick={() => onPageChange(p)}
                            className="data-[active=true]:text-table-text-color hover:text-table-header dark:text-white hover:dark:bg-white hover:dark:text-table-header"
                        >
                            {p}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                {totalPages > endPage && (
                    <PaginationItem >
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                <PaginationItem>
                    <PaginationNext
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => page < totalPages && onPageChange(page + 1)}
                        className="hover:text-table-header hover:dark:bg-white"
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination >
    );
}
