import { makeNetClient } from "../../net/make_net_client"

export const makeCollibraClient = (authorization: string) =>
  makeNetClient({
    baseURL: process.env.COLLIRBA_BASE_URL,
    headers: { authorization },
  })
