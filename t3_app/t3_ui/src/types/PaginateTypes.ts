



export interface PaginatedResponse<T> {
    data: T[];
    current_page: number
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: PaginationLink[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
}

export interface PaginationLink {
    url?: string
    label: string
    active: boolean
}

