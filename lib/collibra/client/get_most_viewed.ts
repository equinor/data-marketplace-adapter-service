import { AxiosResponse } from "axios"
import { HttpStatusCode } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

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
      toNetError(HttpStatusCode.InternalServerError)
    ),
    TE.map(({ data }) => data.results)
  )
