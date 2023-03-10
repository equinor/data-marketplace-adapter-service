import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

export const getAssetResponsibilities =
  (client: Net.Client) =>
  (id: string): TE.TaskEither<Error, Collibra.Responsibility[]> =>
    pipe(
      TE.tryCatch(
        () =>
          Get<Collibra.PagedResponsibilityResponse>(client)("/responsibilities", {
            params: new URLSearchParams({ resourceIds: id }),
          }),
        toNetError(HttpStatusCode.InternalServerError)
      ),
      TE.map(({ results }) => results)
    )
