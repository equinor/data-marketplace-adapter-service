export const Post =
  <T = unknown, B = unknown>(client: Net.Client) =>
  (url: string, opts?: Omit<Net.RequestOpts, "method">) => {
    return client.request<T>(url, {
      ...opts,
      body: opts?.body as B,
      method: "POST",
    })
  }
