import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getStatusByName = (client: Net.Client) => (name: string) =>
  TE.tryCatch(
    () => Get<Collibra.Status>(client)(`/statuses/name/${name}`),
    (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
  )
