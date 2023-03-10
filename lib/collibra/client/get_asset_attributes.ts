import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getAssetAttributes = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Get<Collibra.PagedAttributeResponse>(client)("/attributes", {
          params: new URLSearchParams({ assetId: id }),
        }),
      toNetError(HttpStatusCode.InternalServerError)
    ),
    TE.map((res) => res.results)
  )
