import type { Maintainer } from "@equinor/data-marketplace-models/types/Maintainer"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { roleAdapter } from "../adapters/role_adapter"
import { userAdapter } from "../adapters/user_adapter"

export const maintainerAdapter =
  (cu: Collibra.User) =>
  (cr: Collibra.Role): E.Either<string[], Maintainer> =>
    pipe(
      userAdapter(cu),
      E.bindTo("user"),
      E.bind("role", () => roleAdapter(cr)),
      E.chain(({ user, role }) => E.of({ ...user, role }))
    )
