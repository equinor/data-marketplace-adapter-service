import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"

type NavStatsResponse = AxiosResponse<Collibra.PagedNavigationStatisticResponse>

export const getMostViewed = (client: Net.Client) => (limit: number, offset: number) =>
  pipe(
    TE.tryCatch(
      () =>
        Get<NavStatsResponse>(client)("/navigation/most_viewed", {
          params: new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
          }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
