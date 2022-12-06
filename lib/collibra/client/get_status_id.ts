import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"

export const getStatusByName = (client: Net.Client) => (name: string) =>
  TE.tryCatch(() => Get<Collibra.Status>(client)(`/statuses/name/${name}`), E.toError)
