import type { AxiosResponse } from "axios"
import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

type UsersResponse = AxiosResponse<Collibra.PagedUserResponse>
const getUsers = (client: Net.Client) => (params: URLSearchParams) =>
  TE.tryCatch(() => client.get<UsersResponse>("/users", { params }), E.toError)

export const getUsersByIdBatch =
  (client: Net.Client) =>
  (IDs: string[]): TE.TaskEither<Error, Collibra.User[]> =>
    pipe(
      TE.of(IDs),
      TE.map(
        A.reduce(new URLSearchParams(), (params, id) => {
          params.append("userIds", id)
          return params
        })
      ),
      TE.mapLeft((err) => new Error(err)),
      TE.chain(getUsers(client)),
      TE.map((res) => res.data.results)
    )
