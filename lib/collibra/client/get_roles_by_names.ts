import { AxiosResponse } from "axios"
import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

type RolesResponse = AxiosResponse<Collibra.PagedResponse<Collibra.Role>>

export const getRolesByNames =
  (client: Net.Client) =>
  (names: string[]): TE.TaskEither<Error, Collibra.Role[]> =>
    pipe(
      TE.tryCatch(() => client.get<RolesResponse>("/roles"), E.toError),
      TE.map(({ data }) => data.results),
      TE.map(A.filter((r) => names.length === 0 || names.includes(r.name)))
    )
