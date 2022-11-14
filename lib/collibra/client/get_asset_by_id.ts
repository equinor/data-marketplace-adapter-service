import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { AxiosResponse } from "axios"
import { pipe } from "fp-ts/lib/function"

export const getAssetByID = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(() => client.get<AxiosResponse<Collibra.Asset>>(`/assets/${id}`), E.toError),
    TE.map(({ data }) => data)
  )
