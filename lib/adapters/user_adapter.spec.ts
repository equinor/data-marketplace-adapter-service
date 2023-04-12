import * as E from "fp-ts/lib/Either"

import { ResponsibilityUser } from "../../GetMaintainersTrigger/lib/getResponsibilities"

import { userAdapter } from "./user_adapter"

describe("userAdapter", () => {
  it("returns left path for invalid object", () => {
    const user: ResponsibilityUser = {
      // @ts-ignore
      userCreatedAt: "Invalid date",
      userEmail: "email",
      userFirstName: "first name",
      userId: "abc123",
      userLastName: "last name",
      // @ts-ignore
      userUpdatedAt: "Invalid date",
    }

    expect(E.isLeft(userAdapter(user))).toBe(true)
  })

  it("returns right path for valid object", () => {
    const user: ResponsibilityUser = {
      userCreatedAt: new Date().valueOf(),
      userEmail: "email",
      userFirstName: "first name",
      userId: "abc123",
      userLastName: "last name",
      userUpdatedAt: new Date().valueOf(),
    }

    expect(E.isRight(userAdapter(user))).toBe(true)
  })
})
