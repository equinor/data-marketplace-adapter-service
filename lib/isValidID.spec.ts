import crypto from "node:crypto"

import * as E from "fp-ts/lib/Either"

import { isValidID } from "./isValidID"

describe("isValidID", () => {
  it("returns left for invalid UUID", () => {
    expect(E.isLeft(isValidID("invalid uuid"))).toBe(true)
  })

  it("returns right for valid UUID", () => {
    expect(E.isRight(isValidID(crypto.randomUUID()))).toBe(true)
  })
})
