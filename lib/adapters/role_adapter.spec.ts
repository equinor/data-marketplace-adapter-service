import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"

import { roleAdapter } from "./role_adapter"

describe("maintainerAdapter", () => {
  let role: Collibra.Role | null = null

  beforeEach(() => {
    role = {
      createdBy: randomUUID(),
      createdOn: new Date().valueOf(),
      description: "Lorem ipsum dolor sit amet",
      global: false,
      id: randomUUID(),
      lastModifiedBy: randomUUID(),
      lastModifiedOn: new Date().valueOf(),
      name: "Data Office Admin",
      permissions: ["ACCESS_DATA", "ADVANCED_DATA_TYPE_ADD", "ADVANCED_DATA_TYPE_EDIT"],
      resourceType: "Role",
      system: false,
    }
  })

  afterEach(() => {
    role = null
  })

  it("returns left path for invalid date", () => {
    // @ts-ignore
    role.createdOn = "Invalid date"
    expect(E.isLeft(roleAdapter(role as Collibra.Role))).toBe(true)
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(roleAdapter(role as Collibra.Role))).toBe(true)
  })
})
