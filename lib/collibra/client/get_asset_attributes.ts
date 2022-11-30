import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

type AttributesResponse = AxiosResponse<Collibra.PagedAttributeResponse>

export const getAssetAttributes = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.get<AttributesResponse>("/attributes", {
          params: new URLSearchParams({ assetId: id }),
        }),
      E.toError
    ),
    TE.map(({ data }) => data.results)
  )
