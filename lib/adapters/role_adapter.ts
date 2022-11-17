import type { Role } from "@equinor/data-marketplace-models/types/Role"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { hasInvalidFields } from "../has_invalid_fields"

export const roleAdapter = (cr: Collibra.Role): E.Either<string[], Role> =>
  pipe(
    {
      createdAt: new Date(cr.createdOn),
      id: cr.id,
      name: cr.name,
      updatedAt: new Date(cr.lastModifiedOn),
    } as Role,
    hasInvalidFields
  )
