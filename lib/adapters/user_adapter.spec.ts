import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"

import { userAdapter } from "./user_adapter"

describe("maintainerAdapter", () => {
  let user: Collibra.User | null = null

  beforeEach(() => {
    user = {
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
    }
  })

  afterEach(() => {
    user = null
  })

  it("returns left path for invalid date", () => {
    // @ts-ignore
    user.createdOn = "Invalid date"
    expect(E.isLeft(userAdapter(user as Collibra.User))).toBe(true)
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(userAdapter(user as Collibra.User))).toBe(true)
  })
})
