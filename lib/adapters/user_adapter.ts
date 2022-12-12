import type { User } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { hasInvalidDateFields } from "../has_invalid_date_fields"

export const userAdapter = (collibraUser: Collibra.User): E.Either<string, User> => {
  const user: User = {
    createdAt: new Date(collibraUser.createdOn),
    email: collibraUser.emailAddress.toLowerCase(),
    firstName: collibraUser.firstName,
    id: collibraUser.id,
    lastName: collibraUser.lastName,
    updatedAt: new Date(collibraUser.lastModifiedOn),
  }

  return pipe(user, hasInvalidDateFields)
}
