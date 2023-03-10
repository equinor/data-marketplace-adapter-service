import type { Role } from "@equinor/data-marketplace-models/types/Role"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { hasInvalidDateFields } from "../has_invalid_date_fields"

export const roleAdapter = (cr: Collibra.Role): E.Either<string, Role> => {
  const role: Role = {
    createdAt: new Date(cr.createdOn),
    id: cr.id,
    name: cr.name as string,
    updatedAt: new Date(cr.lastModifiedOn),
  }
  return pipe(role, hasInvalidDateFields)
}
