import { AxiosError } from "axios"
import * as A from "fp-ts/Array"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

const getUsers = (client: Net.Client) => (params: URLSearchParams) =>
  TE.tryCatch(
    () => Get<Collibra.PagedUserResponse>(client)("/users", { params }),
    (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
  )

export const getUsersByIdBatch = (client: Net.Client) => (IDs: string[]) =>
  pipe(
    TE.of(IDs),
    TE.map(
      A.reduce(new URLSearchParams(), (params, id) => {
        params.append("userIds", id)
        return params
      })
    ),
    TE.mapLeft((err: Error) => toNetErr(500)(err.message)),
    TE.chain(getUsers(client)),
    TE.map(({ results }) => results)
  )
