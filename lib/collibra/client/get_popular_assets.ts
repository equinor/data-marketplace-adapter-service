import { AxiosInstance } from "axios"
import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getPopularAssets = (client: Net.Client) => (name: string, statusIds: string, typeIds: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.get<AxiosResponse<Collibra.Asset>>(`/assets`, {
          params: new URLSearchParams({
            statusIds: statusIds,
            typeIds: typeIds,
          }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data)
  )
