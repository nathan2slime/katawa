export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export type PaginationArgs = {
  query: string
  page: number
  sortOrder: SortOrder
  sortField: string
  perPage: number
}

export type Pagination<T> = {
  data: T[]
  total: number
  pages: number
  perPage: number
  page: number
}
