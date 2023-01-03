import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getAssetResponsibilities =
  (client: Net.Client) =>
  (id: string): TE.TaskEither<Error, Collibra.Responsibility[]> =>
    pipe(
      TE.tryCatch(
        () =>
          Get<Collibra.PagedResponsibilityResponse>(client)("/responsibilities", {
            params: new URLSearchParams({ resourceIds: id }),
          }),
        (err: AxiosError) => toNetErr(err.response.status ?? 500)(err.message)
      ),
      TE.map(({ results }) => results)
    )
