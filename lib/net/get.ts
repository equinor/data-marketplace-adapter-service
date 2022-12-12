export const Get =
  <T>(client: Net.Client) =>
  (url: string, opts?: Omit<Net.RequestOpts, "method" | "body">): Promise<T> => {
    return client.request<T>(url, {
      ...opts,
      method: "GET",
    })
  }
