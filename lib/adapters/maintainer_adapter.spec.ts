import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/lib/function"

import {
  ResponsibilityGroupUser,
  ResponsibilityRole,
  ResponsibilityUser,
} from "../../GetMaintainersTrigger/lib/getResponsibilities"

import { maintainerAdapter } from "./maintainer_adapter"

describe("maintainerAdapter", () => {
  let role: ResponsibilityRole | null = null
  let user: ResponsibilityUser | ResponsibilityGroupUser | null = null

  beforeEach(() => {
    role = {
      roleCreatedAt: new Date().valueOf(),
      roleId: randomUUID(),
      roleName: "Role Name",
      roleUpdatedAt: new Date().valueOf(),
    }
    user = {
      userCreatedAt: new Date().valueOf(),
      userEmail: "name@example.com",
      userFirstName: "Name",
      userId: randomUUID(),
      userLastName: "Nameson",
      userUpdatedAt: new Date().valueOf(),
    } as ResponsibilityUser
  })

  it("returns left path for invalid date", () => {
    const invalidUser = { ...user, userCreatedAt: "invalid date", userUpdatedAt: "invalid date" }
    const invalidRole = { ...role, roleCreatedAt: "invalid date", roleUpdatedAt: "invalid date" }

    pipe(
      // @ts-ignore
      maintainerAdapter({ role: invalidRole, user: invalidUser }),
      E.match(
        (err) => expect(err).toBe("Invalid date(s) in field(s) createdAt, updatedAt"),
        () => {}
      )
    )
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(maintainerAdapter({ role: role as ResponsibilityRole, user: user as ResponsibilityUser }))).toBe(
      true
    )
  })
})
