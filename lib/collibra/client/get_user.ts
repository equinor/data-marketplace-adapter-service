import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getUser = (client: Net.Client) => (id: string) =>
  TE.tryCatch(
    () => Get<Collibra.User>(client)(`/users/${id}`),
    (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
  )
