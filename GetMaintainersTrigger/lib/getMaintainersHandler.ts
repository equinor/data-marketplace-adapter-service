import { Maintainer } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { maintainerAdapter } from "../../lib/adapters/maintainer_adapter"
import { isValidID } from "../../lib/isValidID"
import { NetError } from "../../lib/net/NetError"
import { makeResult } from "../../lib/net/make_result"
import { toNetError } from "../../lib/net/to_net_err"

import { ResponsibilityGroupUser, ResponsibilityUser, getResponsibilities } from "./getResponsibilities"

export const getMaintainersHandler = (client: Net.Client) => (roles: string[]) => (assetId: string) =>
  pipe(
    assetId,
    // @TODO: implement a composable function to cast left path to a NetError
    isValidID,
    TE.fromEither,
    TE.mapLeft(toNetError(400)),
    TE.chain(getResponsibilities(client)(roles)),
    TE.mapLeft(toNetError(500)),
    TE.map((responsibilities) =>
      responsibilities.flatMap((responsibility) =>
        [...(responsibility.users ?? []), ...(responsibility.groups?.[0].groupUsers ?? [])]
          .filter((user) => !!((user as ResponsibilityUser).userId || (user as ResponsibilityGroupUser).groupUserId))
          .map((user) => maintainerAdapter({ role: responsibility.roles?.[0], user }))
      )
    ),
    TE.mapLeft(toNetError(500)),
    TE.map((a) => pipe(a, E.sequenceArray, TE.fromEither)),
    TE.flattenW,
    TE.mapLeft(toNetError(500)),
    TE.match(
      (err) => makeResult<readonly Maintainer[], NetError>(err.status, err),
      (maintainers) => makeResult<readonly Maintainer[], NetError>(200, maintainers)
    )
  )
