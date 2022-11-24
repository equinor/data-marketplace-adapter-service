import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

export const getStatusByName = (client: Net.Client) => (name: string) =>
  pipe(
    TE.tryCatch(() => client.get<AxiosResponse<Collibra.Status>>(`/statuses/name/${name}`), E.toError),
    TE.map(({ data }) => data)
  )
