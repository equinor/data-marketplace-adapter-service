import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getAssetTags = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () => Get<Collibra.Tag[]>(client)(`/tags/asset/${encodeURIComponent(id)}`),
      toNetError(HttpStatusCode.InternalServerError)
    )
  )
