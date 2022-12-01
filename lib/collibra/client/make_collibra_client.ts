import { config } from "../../../config"
import { makeNetClient } from "../../net/make_net_client"

export const makeCollibraClient = (authorization: string) =>
  makeNetClient({
    baseURL: config.COLLIBRA_BASE_URL,
    headers: { authorization },
  })
