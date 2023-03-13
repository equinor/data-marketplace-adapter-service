import { type AxiosError } from "axios"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getAssetTags = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () => Get<Collibra.Tag[]>(client)(`/tags/asset/${encodeURIComponent(id)}`),
      (err: AxiosError) => toNetErr(err.response?.status ?? 500)(err.message)
    )
  )
