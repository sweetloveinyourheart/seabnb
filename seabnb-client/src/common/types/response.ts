export interface Response<T> {
    data: T | null
    error: string | string[] | null
}