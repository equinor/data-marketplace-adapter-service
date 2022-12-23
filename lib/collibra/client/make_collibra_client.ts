import { getConfigValue } from "../../../config"
import { Logger } from "../../logger"
import { makeNetClient } from "../../net/make_net_client"

export const makeCollibraClient = (authorization: string) => async (logger: Logger) =>
  makeNetClient(
    {
      baseURL: `${await getConfigValue("COLLIBRA_BASE_URL")}/rest/2.0`,
      headers: { authorization },
    },
    logger
  )
