import type { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

type ResponsibilitiesResponse = AxiosResponse<Collibra.PagedResponsibilityResponse>
const _getResponsibilities = (client: Net.Client, id: string) => () =>
  client.get<ResponsibilitiesResponse>("/responsibilities", {
    params: new URLSearchParams({ resourceIds: id }),
  })

export const getAssetResponsibilities =
  (client: Net.Client) =>
  (id: string): TE.TaskEither<Error, Collibra.Responsibility[]> =>
    pipe(
      TE.tryCatch(_getResponsibilities(client, id), E.toError),
      TE.map(({ data }) => data.results)
    )
