import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Maintainer } from "@equinor/data-marketplace-models/types/Maintainer"
import { AxiosError } from "axios"
import * as A from "fp-ts/Array"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { maintainerAdapter } from "../lib/adapters/maintainer_adapter"
import { getAssetResponsibilities } from "../lib/collibra/client/get_asset_responsibilities"
import { getRolesByNames } from "../lib/collibra/client/get_roles_by_names"
import { getUsersByIdBatch } from "../lib/collibra/client/get_users_by_id_batch"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { filterResponsibilitiesByGroups } from "../lib/collibra/filter_responsibilities_by_groups"
import { makeLogger } from "../lib/logger"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

const GetMaintainersTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = makeCollibraClient(req.headers.authorization)(logger)
  const { id } = context.bindingData
  const groups: string[] = req.query.group?.split(",") ?? []

  const res = await pipe(
    getAssetResponsibilities(collibraClient)(id),
    TE.map((responsibilities) => TE.fromEither(filterResponsibilitiesByGroups(groups)(responsibilities))),
    TE.flatten,
    TE.bindTo("responsibilities"),
    // get users by ids
    TE.bind("users", ({ responsibilities }) =>
      pipe(
        responsibilities,
        A.map((responsibility) => responsibility.owner.id),
        getUsersByIdBatch(collibraClient)
      )
    ),
    // get roles by names
    TE.bind("roles", ({ responsibilities }) =>
      pipe(
        responsibilities,
        A.map((responsibility) => responsibility.role.name),
        getRolesByNames(collibraClient)
      )
    ),
    // adapt maintainers from roles and users
    TE.chain(({ responsibilities, roles, users }) =>
      pipe(
        responsibilities,
        A.map((responsibility) => {
          const role = A.findFirst<Collibra.Role>((role) => role.id === responsibility.role.id)(roles)
          const user = A.findFirst<Collibra.User>((user) => user.id === responsibility.owner.id)(users)
          return TE.fromEither(maintainerAdapter(user)(role))
        }),
        TE.sequenceArray
      )
    ),
    TE.match(
      (err: AxiosError) => makeResult<readonly Maintainer[], AxiosError>(err.response?.status ?? 500, err),
      (maintainers) => makeResult<readonly Maintainer[], AxiosError>(200, maintainers)
    )
  )()

  context.res = {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetMaintainersTrigger
