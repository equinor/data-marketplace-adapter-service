import type { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

type AssetTypesResponse = AxiosResponse<Collibra.PagedAssetTypeResponse>

export const getAssetTypeByName = (client: Net.Client) => (name: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.get<AssetTypesResponse>("/assetTypes", {
          params: new URLSearchParams({ name }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results[0])
  )
