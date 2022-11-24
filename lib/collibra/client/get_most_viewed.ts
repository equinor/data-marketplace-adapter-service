import { AxiosInstance, AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getMostViewed = (client: Net.Client) => (offset: number, limit: number) =>
  pipe(
    TE.tryCatch(
      () =>
        client.get<AxiosResponse<Collibra.PagedNavigationStatisticResponse>>("/navigation/most_viewed", {
          params: new URLSearchParams({
            offset: offset.toString(),
            limit: limit.toString(),
          }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
