import type { Maintainer } from "@equinor/data-marketplace-models/types/Maintainer"
import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/function"

import { roleAdapter } from "../adapters/role_adapter"
import { userAdapter } from "../adapters/user_adapter"

export const maintainerAdapter =
  (cu: O.Option<Collibra.User>) =>
  (cr: O.Option<Collibra.Role>): E.Either<Error, Maintainer> =>
    pipe(
      cu,
      E.fromOption(() => "No user"),
      E.chain(userAdapter),
      E.bindTo("user"),
      E.bind("role", () =>
        pipe(
          cr,
          E.fromOption(() => "No role"),
          E.chain(roleAdapter)
        )
      ),
      E.mapLeft((err) => new Error(err)),
      E.map(({ user, role }) => ({ ...user, role }))
    )
