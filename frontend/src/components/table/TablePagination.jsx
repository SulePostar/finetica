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

    if (totalPages === 1) return null;

    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, startPage + 2);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const navBtnClass = "min-w-0 w-8 p-0 sm:min-w-[95px] sm:w-auto sm:px-3 hover:text-table-header hover:dark:bg-white";

    return (
        <Pagination className="flex items-center justify-end">
            <PaginationContent>
                {totalPages > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            disabled={page === 1}
                            onClick={() => page > 1 && onPageChange(page - 1)}
                            className={navBtnClass}
                        />
                    </PaginationItem>
                )}

                {pages.map((p) => (
                    <PaginationItem key={p}>
                        <PaginationLink
                            isActive={p === page}
                            onClick={() => onPageChange(p)}
                            className=" data-[active=true]:text-table-text-color hover:text-table-header dark:text-white hover:dark:bg-white hover:dark:text-table-header"
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

                {totalPages > 1 && (
                    <PaginationItem>
                        <PaginationNext
                            disabled={page === totalPages}
                            onClick={() => page < totalPages && onPageChange(page + 1)}
                            className={navBtnClass}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination >
    );
}