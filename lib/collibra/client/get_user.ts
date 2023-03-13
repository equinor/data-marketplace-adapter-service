import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getUser = (client: Net.Client) => (id: string) =>
  TE.tryCatch(() => Get<Collibra.User>(client)(`/users/${id}`), toNetError(HttpStatusCode.InternalServerError))
