import { AxiosInstance } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getAssetAttributes = (client: AxiosInstance) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.request<Collibra.PagedAttributeResponse>({
          url: "/attributes",
          params: new URLSearchParams({ assetId: id }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
