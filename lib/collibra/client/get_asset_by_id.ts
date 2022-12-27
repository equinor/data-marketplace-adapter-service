import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getAssetByID = (client: Net.Client) => (id: string) =>
  TE.tryCatch(
    () => Get<Collibra.Asset>(client)(`/assets/${id}`),
    (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
  )
