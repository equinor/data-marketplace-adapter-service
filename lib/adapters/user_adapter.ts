import type { User } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { hasInvalidDateFields } from "../has_invalid_date_fields"

export const userAdapter = (cu: Collibra.User): E.Either<string, User> =>
  pipe(
    {
      createdAt: new Date(cu.createdOn),
      email: cu.emailAddress.toLowerCase(),
      firstName: cu.firstName,
      id: cu.id,
      lastName: cu.lastName,
      updatedAt: new Date(cu.lastModifiedOn),
    } as User,
    hasInvalidDateFields
  )
