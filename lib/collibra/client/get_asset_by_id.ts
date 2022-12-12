import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"

export const getAssetByID = (client: Net.Client) => (id: string) =>
  TE.tryCatch(() => Get<Collibra.Asset>(client)(`/assets/${id}`), E.toError)
