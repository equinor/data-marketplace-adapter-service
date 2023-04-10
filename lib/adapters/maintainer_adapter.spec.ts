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

  afterEach(() => {
    role = null
    user = null
  })

  it("returns left path for invalid date", () => {
    const invalidUser = pipe(user, (u) => ({ ...u, userCreatedAt: "invalid date" }))
    const invalidRole = pipe(role, (r) => ({ ...r, roleCreatedAt: "invalid date" }))

    // @ts-ignore
    expect(E.isLeft(maintainerAdapter({ role: invalidRole, user: invalidUser }))).toBe(true)
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(maintainerAdapter({ role: role!, user: user! }))).toBe(true)
  })
})
