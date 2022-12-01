export const Post = (client: Net.Client) => (url: string, opts?: Omit<Net.RequestOpts, "method">) => {
  return client.request(url, {
    ...opts,
    method: "POST",
  })
}
