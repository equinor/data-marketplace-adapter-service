import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"

export const getAssetResponsibilities =
  (client: Net.Client) =>
  (id: string): TE.TaskEither<Error, Collibra.Responsibility[]> =>
    pipe(
      TE.tryCatch(
        () =>
          Get<Collibra.PagedResponsibilityResponse>(client)("/responsibilities", {
            params: new URLSearchParams({ resourceIds: id }),
          }),
        E.toError
      ),
      TE.map(({ results }) => results)
    )
