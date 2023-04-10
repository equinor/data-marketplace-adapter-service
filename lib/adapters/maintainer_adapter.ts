import { Maintainer, User } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"

import {
  ResponsibilityGroupUser,
  ResponsibilityRole,
  ResponsibilityUser,
} from "../../GetMaintainersTrigger/lib/getResponsibilities"
import { hasInvalidDateFields } from "../has_invalid_date_fields"

type Responsibility = {
  user: ResponsibilityUser | ResponsibilityGroupUser
  role: ResponsibilityRole
}

const isGroupUser = (user: object): user is ResponsibilityGroupUser => "groupUserId" in user

export const maintainerAdapter = (responsibility: Responsibility): E.Either<string, Maintainer> =>
  pipe(
    E.of(responsibility),
    E.map((r) =>
      pipe(
        E.of(isGroupUser(r.user)),
        E.map((b) =>
          b
            ? ({
                createdAt: new Date((responsibility.user as ResponsibilityGroupUser).groupUserCreatedAt),
                email: (responsibility.user as ResponsibilityGroupUser).groupUserEmail?.toLowerCase(),
                firstName: (responsibility.user as ResponsibilityGroupUser).groupUserFirstName,
                id: (responsibility.user as ResponsibilityGroupUser).groupUserId,
                lastName: (responsibility.user as ResponsibilityGroupUser).groupUserLastName,
                updatedAt: new Date((responsibility.user as ResponsibilityGroupUser).groupUserUpdatedAt),
              } as User)
            : ({
                createdAt: new Date((responsibility.user as ResponsibilityUser).userCreatedAt),
                email: (responsibility.user as ResponsibilityUser).userEmail?.toLowerCase(),
                firstName: (responsibility.user as ResponsibilityUser).userFirstName,
                id: (responsibility.user as ResponsibilityUser).userId,
                lastName: (responsibility.user as ResponsibilityUser).userLastName,
                updatedAt: new Date((responsibility.user as ResponsibilityUser).userUpdatedAt),
              } as User)
        )
      )
    ),
    E.flattenW,
    E.map(hasInvalidDateFields),
    E.flattenW,
    E.map(
      (u) =>
        ({
          ...u,
          role: {
            createdAt: new Date(responsibility.role.roleCreatedAt),
            id: responsibility.role.roleId,
            name: responsibility.role.roleName,
            updatedAt: new Date(responsibility.role.roleUpdatedAt),
          },
        } as Maintainer)
    ),
    E.mapLeft(() => "Unable to process responsibility data from Collibra")
  )
