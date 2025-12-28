import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/shadcnuicomponents/ui/pagination"
import { PaginatedResponse } from "@/types/PaginateTypes"

interface Props<T> {
    pagination: PaginatedResponse<T>
    onPageChange: (page: number) => void
}

export function GeneralPaginator<T>({ pagination, onPageChange }: Props<T>) {
    const {
        current_page,
        last_page,
        prev_page_url,
        next_page_url,
        first_page_url,
        last_page_url,
    } = pagination

    const extractPageFromUrl = (url?: string | null) => {
        if (!url) return null
        try {
            const params = new URL(url).searchParams
            const page = params.get("page")
            return page ? Number(page) : null
        } catch {
            return null
        }
    }

    // Do not render pagination if only one page
    if (last_page <= 1) return null

    return (
        <Pagination>
            <PaginationContent>
                {prev_page_url && (
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                const page = extractPageFromUrl(prev_page_url)
                                if (page) onPageChange(page)
                            }}
                        />
                    </PaginationItem>
                )}

                {current_page > 2 && first_page_url && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                const page = extractPageFromUrl(first_page_url)
                                if (page) onPageChange(page)
                            }}
                        >
                            1
                        </PaginationLink>
                    </PaginationItem>
                )}

                {current_page > 3 && <PaginationEllipsis />}

                <PaginationItem>
                    <PaginationLink href="#" isActive>
                        {current_page}
                    </PaginationLink>
                </PaginationItem>

                {current_page < last_page - 2 && <PaginationEllipsis />}

                {current_page < last_page - 1 && last_page_url && (
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                const page = extractPageFromUrl(last_page_url)
                                if (page) onPageChange(page)
                            }}
                        >
                            {last_page}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {/* Next */}
                {next_page_url && (
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                const page = extractPageFromUrl(next_page_url)
                                if (page) onPageChange(page)
                            }}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    )
}

export default GeneralPaginator
