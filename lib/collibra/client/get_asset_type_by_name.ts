import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

type AssetTypesResponse = Collibra.PagedAssetTypeResponse

export const getAssetTypeByName = (client: Net.Client) => (name: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Get<AssetTypesResponse>(client)("/assetTypes", {
          params: new URLSearchParams({ name }),
        }),
      (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
    ),
    TE.map(({ results }) => results[0])
  )
