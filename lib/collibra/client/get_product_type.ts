import { AxiosInstance } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getProductType = (client: AxiosInstance) => (name: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.request<Collibra.PagedAssetTypeResponse>({
          url: "/assetTypes",
          params: new URLSearchParams({
            sourceTypeName: name,
          }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
