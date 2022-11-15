import type { Maintainer } from "@equinor/data-marketplace-models/types/Maintainer"
import * as E from "fp-ts/Either"

import { isValidDate } from "../is_valid_date"

export const maintainerAdapter = (r: Collibra.Responsibility, u: Collibra.User): E.Either<Error, Maintainer> => {
  const uCreatedAt = new Date(u.createdOn),
    uUpdatedAt = new Date(u.lastModifiedOn),
    rCreatedAt = new Date(r.createdOn),
    rUpdatedAt = new Date(r.lastModifiedOn)

  if (E.isLeft(isValidDate(uCreatedAt))) return E.left(new Error(`Could not convert ${u.createdOn} to Date`))
  if (E.isLeft(isValidDate(uUpdatedAt))) return E.left(new Error(`Could not convert ${u.lastModifiedOn} to Date`))
  if (E.isLeft(isValidDate(rCreatedAt))) return E.left(new Error(`Could not convert ${r.createdOn} to Date`))
  if (E.isLeft(isValidDate(rUpdatedAt))) return E.left(new Error(`Could not convert ${r.lastModifiedOn} to Date`))

  return E.right({
    createdAt: new Date(u.createdOn),
    email: u.emailAddress.toLowerCase(),
    firstName: u.firstName,
    id: u.id,
    lastName: u.lastName,
    role: {
      createdAt: new Date(r.createdOn),
      id: r.role.id,
      name: r.role.name,
      updatedAt: new Date(r.lastModifiedOn),
    },
    updatedAt: new Date(u.lastModifiedOn),
  })
}
