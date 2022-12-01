import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"

type RolesResponse = Collibra.PagedResponse<Collibra.Role>

export const getRolesByNames =
  (client: Net.Client) =>
  (names: string[]): TE.TaskEither<Error, Collibra.Role[]> =>
    pipe(
      TE.tryCatch(() => Get<RolesResponse>(client)("/roles"), E.toError),
      TE.map(({ results }) => results),
      TE.map(A.filter((r) => names.length === 0 || names.includes(r.name)))
    )
