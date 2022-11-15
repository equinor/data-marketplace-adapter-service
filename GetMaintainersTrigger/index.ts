import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { Maintainer } from "@equinor/data-marketplace-models/types/Maintainer"
import { AxiosError } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { getAssetResponsibilities } from "../lib/collibra/client/get_asset_responsibilities"
import { getUser } from "../lib/collibra/client/get_user"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { filterResponsibilitiesByGroups } from "../lib/collibra/filter_responsibilities_by_groups"
import { maintainerAdapter } from "../lib/collibra/maintainer_adapter"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

const getUsersByResponsibilities =
  (client: Net.Client) =>
  (responsibilities: readonly Collibra.Responsibility[]): TE.TaskEither<Error, readonly Collibra.User[]> => {
    return pipe(
      responsibilities.map((r) => getUser(client)(r.owner.id)),
      TE.sequenceArray
    )
  }

const mapUsersToMaintainers = (
  users: readonly Collibra.User[],
  responsibilities: readonly Collibra.Responsibility[]
): E.Either<Error, readonly Maintainer[]> => {
  return pipe(
    users.map((u) =>
      maintainerAdapter(
        responsibilities.find((r) => r.owner.id === u.id),
        u
      )
    ),
    E.sequenceArray
  )
}

const GetMaintainersTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collibraClient = makeCollibraClient({ headers: { authorization: req.headers.authorization } })
  const { id } = context.bindingData
  const groups: string[] = req.query.group?.split(",") ?? []

  const res = await pipe(
    getAssetResponsibilities(collibraClient)(id),
    TE.chain((r) =>
      TE.fromOption(() => new Error(`Responsibilities by groups [${groups.join(", ")}] was None`))(
        filterResponsibilitiesByGroups(groups, r)
      )
    ),
    TE.bindTo("responsibilities"),
    TE.bind("users", ({ responsibilities }) => getUsersByResponsibilities(collibraClient)(responsibilities)),
    TE.chain(({ responsibilities, users }) => TE.fromEither(mapUsersToMaintainers(users, responsibilities))),
    TE.match(
      (err: AxiosError) => makeResult<Maintainer[], AxiosError>(err.response?.status ?? 500, err),
      (m: Maintainer[]) => makeResult<Maintainer[], AxiosError>(200, m)
    )
  )()

  if (isErrorResult(res)) {
    context.log(res.value)
  }

  context.res = {
    status: res.status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetMaintainersTrigger
