import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

type UserResponse = AxiosResponse<Collibra.User>
const _getUser = (client: Net.Client, id: string) => () => client.get<UserResponse>(`/user/${id}`)

export const getUser = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(_getUser(client, id), E.toError),
    TE.map(({ data }) => data)
  )
