import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";
function Pagination({
  className,
  ...props
}) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props} />
  );
}
function PaginationContent({
  className,
  ...props
}) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props} />
  );
}
function PaginationItem({
  ...props
}) {
  return <li data-slot="pagination-item" className="cursor-pointer" {...props} />;
}
function PaginationLink({
  className,
  disabled = false,
  isActive,
  size = "icon",
  ...props
}) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive ? "true" : "false"}
      className={cn(buttonVariants({
        variant: disabled ? "disabled" : isActive ? "outline" : "ghost",
        size,
      }), className)}
      {...props} />
  );
}
function PaginationPrevious({
  className,
  disabled = false,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      disabled={disabled}
      className={cn(
        `
        flex items-center justify-center gap-1
        min-w-[95px] px-3 py-1

        rounded-full border 
        bg-white text-table-text-color
        dark:bg-card dark:text-white
        border-table-border-light dark:border-[#3a3a3a]

        hover:bg-spurple hover:!text-white 
        dark:hover:!text-black
        transition-colors duration-150

        disabled:opacity-40 
        disabled:hover:bg-white disabled:dark:hover:bg-card
        disabled:cursor-not-allowed
        `,
        className
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  disabled = false,
  ...props
}) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      disabled={disabled}
      className={cn(
        `
        flex items-center justify-center gap-1
        min-w-[95px] px-3 py-1

        rounded-full border
        bg-white text-table-text-color 
        dark:bg-card dark:text-white
        border-table-border-light dark:border-[#3a3a3a]

        hover:bg-spurple hover:!text-white
        dark:hover:bg-white dark:hover:!text-black

        transition-colors duration-150

        disabled:opacity-40 
        disabled:hover:bg-white disabled:dark:hover:bg-card
        disabled:cursor-not-allowed
        `,
        className
      )}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}>
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}