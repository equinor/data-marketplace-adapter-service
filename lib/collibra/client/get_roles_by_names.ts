import { AxiosError } from "axios"
import * as A from "fp-ts/Array"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

type RolesResponse = Collibra.PagedResponse<Collibra.Role>

export const getRolesByNames =
  (client: Net.Client) =>
  (names: string[]): TE.TaskEither<Error, Collibra.Role[]> =>
    pipe(
      TE.tryCatch(
        () => Get<RolesResponse>(client)("/roles"),
        (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
      ),
      TE.map(({ results }) => results),
      TE.map(A.filter((r) => names.length === 0 || names.includes(r.name)))
    )
