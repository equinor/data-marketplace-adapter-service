import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"

export const getUser = (client: Net.Client) => (id: string) =>
  TE.tryCatch(() => Get<Collibra.User>(client)(`/users/${id}`), E.toError)
