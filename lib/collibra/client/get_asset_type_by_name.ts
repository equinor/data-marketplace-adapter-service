import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"

type AssetTypesResponse = Collibra.PagedAssetTypeResponse

export const getAssetTypeByName = (client: Net.Client) => (name: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Get<AssetTypesResponse>(client)("/assetTypes", {
          params: new URLSearchParams({ name }),
        }),
      E.toError
    ),
    TE.map(({ results }) => results[0])
  )
