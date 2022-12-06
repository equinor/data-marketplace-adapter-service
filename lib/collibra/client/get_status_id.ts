import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"

export const getStatusByName = (client: Net.Client) => (name: string) =>
  pipe(
    TE.tryCatch(() => Get<AxiosResponse<Collibra.Status>>(client)(`/statuses/name/${name}`), E.toError),
    TE.map(({ data }) => data)
  )
