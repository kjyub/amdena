
export interface IPaginationResponse {
    itemCount: number
    pageIndex: number
    maxPage: number
    lastId: string
    items: Array<object>
}