import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { AxiosInstance } from "axios"
import { pipe } from "fp-ts/lib/function"

export const getAssetByID = (client: AxiosInstance) => (id: string) =>
  pipe(
    TE.tryCatch(() => client.request<Collibra.Asset>({ url: `/assets/${id}` }), E.toError),
    TE.bindTo("res"),
    TE.map(({ res }) => res.data)
  )
