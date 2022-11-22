import { AxiosInstance } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getProductType = (client: AxiosInstance) => (offset: string, limit: string, isGuestExcluded: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.request<Collibra.PagedAssetTypeResponse>({
          url: "/navigation/most_viewed",
          params: new URLSearchParams({
            offset: offset,
            limit: limit,
            isGuestExcluded: isGuestExcluded,
          }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
