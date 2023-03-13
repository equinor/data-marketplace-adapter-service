import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getStatusByName = (client: Net.Client) => (name: string) =>
  TE.tryCatch(
    () => Get<Collibra.Status>(client)(`/statuses/name/${name}`),
    toNetError(HttpStatusCode.InternalServerError)
  )
