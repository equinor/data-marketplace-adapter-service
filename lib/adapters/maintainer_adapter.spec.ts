import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import { pipe } from "fp-ts/lib/function"

import { invalidateCollibraResource } from "../testing/invalidate_collibra_resource"

import { maintainerAdapter } from "./maintainer_adapter"

describe("maintainerAdapter", () => {
  let role: O.Option<Collibra.Role> = O.none
  let user: O.Option<Collibra.User> = O.none

  beforeEach(() => {
    role = O.some({
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
    })
    user = O.some({
      activated: true,
      additionalEmailAddresses: [],
      addresses: [],
      apiUser: false,
      createdBy: randomUUID(),
      createdOn: new Date().valueOf(),
      emailAddress: "NAME@example.com",
      enabled: true,
      firstName: "Name",
      gender: "UNKNOWN",
      guestUser: false,
      id: randomUUID(),
      instantMessagingAccounts: [],
      language: "en",
      lastModifiedBy: randomUUID(),
      lastModifiedOn: new Date().valueOf(),
      lastName: "Nameson",
      ldapUser: false,
      licenseType: "CONSUMER",
      phoneNumbers: [],
      resourceType: "User",
      system: false,
      userName: "NAME@example.com",
      userSource: "SSO",
      websites: [],
    })
  })

  afterEach(() => {
    role = null
    user = null
  })

  it("returns left path for invalid date", () => {
    const invalidUser = pipe(user, O.map(invalidateCollibraResource))

    const invalidRole = pipe(role, O.map(invalidateCollibraResource))

    // @ts-ignore
    expect(E.isLeft(maintainerAdapter(invalidUser)(invalidRole))).toBe(true)
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(maintainerAdapter(user)(role))).toBe(true)
  })
})
