import type { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getAssets = (client: Net.Client) => (params?: URLSearchParams) =>
  pipe(
    TE.tryCatch(
      () => Get<Collibra.PagedAssetResponse>(client)("/assets", { params }),
      (err: AxiosError) => toNetErr(err.response?.status ?? 500)(err.message)
    ),
    TE.map((res) => res.results)
  )
