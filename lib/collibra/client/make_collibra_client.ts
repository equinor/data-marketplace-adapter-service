import { config } from "../../../config"
import { Logger } from "../../logger"
import { makeNetClient } from "../../net/make_net_client"

export const makeCollibraClient = (authorization: string) => (logger: Logger) => {
  console.log(config)

  return makeNetClient(
    {
      baseURL: config.COLLIBRA_API_URL,
      headers: { authorization },
    },
    logger
  )
}
