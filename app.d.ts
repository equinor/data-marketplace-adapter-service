import type { OutgoingHttpHeader } from "http"

declare global {
  type Optional<T> = T | null

  namespace Net {
    export type Method = "GET" | "POST" | "DELETE" | "HEAD" | "PATCH" | "PUT" | "OPTIONS" | "TRACE" | "CONNECT"

    export type RequestOpts = Partial<{
      method: Method
      headers: Record<string, OutgoingHttpHeader>
      params: URLSearchParams
      body: any
    }>

    export interface Client {
      get<T>(url: string, opts?: Omit<RequestOpts, "method" | "body">): Promise<T>
      post<T>(url: string, opts?: Omit<RequestOpts, "method">): Promise<T>
    }

    type Result<T, E extends Error> = {
      status: number
      statusText: string
      value: T | E
    }
  }
}
