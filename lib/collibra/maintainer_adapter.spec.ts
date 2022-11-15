import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"

import { maintainerAdapter } from "./maintainer_adapter"

describe("maintainerAdapter", () => {
  let responsibility: Collibra.Responsibility | null = null
  let user: Collibra.User | null = null

  beforeEach(() => {
    responsibility = {
      baseResource: {
        id: randomUUID(),
        resourceType: "Asset",
      },
      createdBy: randomUUID(),
      createdOn: new Date().valueOf(),
      id: randomUUID(),
      lastModifiedBy: randomUUID(),
      lastModifiedOn: new Date().valueOf(),
      owner: {
        id: randomUUID(),
        resourceType: "User",
      },
      resourceType: "Responsibility",
      role: {
        id: randomUUID(),
        name: "Some Role",
        resourceType: "Role",
      },
      system: false,
    }
    user = {
      activated: true,
      additionalEmailAddresses: [],
      addresses: [],
      apiUser: false,
      createdBy: randomUUID(),
      createdOn: new Date().valueOf(),
      emailAddress: "name@example.com",
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
      userName: "name@example.com",
      userSource: "SSO",
      websites: [],
    }
  })

  afterEach(() => {
    responsibility = null
    user = null
  })

  it("returns left path for invalid date", () => {
    // @ts-ignore
    user.createdOn = "Invalid date"
    expect(E.isLeft(maintainerAdapter(responsibility, user))).toBe(true)
  })

  it("returns right path for valid input", () => {
    expect(E.isRight(maintainerAdapter(responsibility, user))).toBe(true)
  })
})
