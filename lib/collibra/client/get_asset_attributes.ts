import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"

export const getAssetAttributes = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Get<Collibra.PagedAttributeResponse>(client)("/attributes", {
          params: new URLSearchParams({ assetId: id }),
        }),
      E.toError
    ),
    TE.map((res) => res.results)
  )
