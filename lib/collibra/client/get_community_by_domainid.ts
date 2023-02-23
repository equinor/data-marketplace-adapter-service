import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { Get } from "../../net/get"
import { toNetErr } from "../../net/to_net_err"

export const getCommunityByDomainID = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () => Get<Collibra.Domain>(client)(`/domains/${id}`),
      (err: AxiosError) => toNetErr(err.response?.status ?? 500)(err.message)
    ),
    TE.map((domain) => domain.community)
  )
