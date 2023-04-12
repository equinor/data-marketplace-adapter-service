import { Maintainer, User } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"

import {
  ResponsibilityGroupUser,
  ResponsibilityRole,
  ResponsibilityUser,
} from "../../GetMaintainersTrigger/lib/getResponsibilities"
import { hasInvalidDateFields } from "../has_invalid_date_fields"

import { userAdapter } from "./user_adapter"

type Responsibility = {
  user: ResponsibilityUser | ResponsibilityGroupUser
  role: ResponsibilityRole
}

const makeMaintainerObject = (role: ResponsibilityRole) => (user: User) =>
  ({
    ...user,
    role: {
      createdAt: new Date(role.roleCreatedAt),
      id: role.roleId,
      name: role.roleName,
      updatedAt: new Date(role.roleUpdatedAt),
    },
  } as Maintainer)

export const maintainerAdapter = (responsibility: Responsibility): E.Either<string, Maintainer> =>
  pipe(
    E.of(responsibility),
    E.map((r) => userAdapter(r.user)),
    E.flattenW,
    hasInvalidDateFields,
    E.flattenW,
    E.map(makeMaintainerObject(responsibility.role)),
    E.mapLeft(() => "Unable to process responsibility data from Collibra")
  )
