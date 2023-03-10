import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getAssetByID = (client: Net.Client) => (id: string) =>
  TE.tryCatch(() => Get<Collibra.Asset>(client)(`/assets/${id}`), toNetError(HttpStatusCode.InternalServerError))
