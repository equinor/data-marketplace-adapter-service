export type Optional<T> = T | null

declare namespace Net {
  type Method = string
  type RequestOpts = {
    method: Method
    params: URLSearchParams
  }
  interface Client {
    request<T>(url: string, opts: RequestOpts): Promise<T>
  }

  type Result<T> = {
    status?: number
    statusText?: string
    error: Optional<string>
    value: Optional<T>
  }
}
