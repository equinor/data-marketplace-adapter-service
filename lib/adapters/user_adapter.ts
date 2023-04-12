import { User } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"

import { ResponsibilityGroupUser, ResponsibilityUser } from "../../GetMaintainersTrigger/lib/getResponsibilities"
import { hasInvalidDateFields } from "../has_invalid_date_fields"

const isGroupUser = (user: object): user is ResponsibilityGroupUser => "groupUserId" in user

export const userAdapter = (user: ResponsibilityUser | ResponsibilityGroupUser) =>
  pipe(
    E.of(isGroupUser(user)),
    E.map((b) =>
      b
        ? ({
            createdAt: new Date((user as ResponsibilityGroupUser).groupUserCreatedAt),
            email: (user as ResponsibilityGroupUser).groupUserEmail?.toLowerCase(),
            firstName: (user as ResponsibilityGroupUser).groupUserFirstName,
            id: (user as ResponsibilityGroupUser).groupUserId,
            lastName: (user as ResponsibilityGroupUser).groupUserLastName,
            updatedAt: new Date((user as ResponsibilityGroupUser).groupUserUpdatedAt),
          } as User)
        : ({
            createdAt: new Date((user as ResponsibilityUser).userCreatedAt),
            email: (user as ResponsibilityUser).userEmail?.toLowerCase(),
            firstName: (user as ResponsibilityUser).userFirstName,
            id: (user as ResponsibilityUser).userId,
            lastName: (user as ResponsibilityUser).userLastName,
            updatedAt: new Date((user as ResponsibilityUser).userUpdatedAt),
          } as User)
    ),
    E.chain(hasInvalidDateFields)
  )
