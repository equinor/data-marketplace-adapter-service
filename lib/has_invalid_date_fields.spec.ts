import { randomUUID } from "crypto"

import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/function"

import { hasInvalidDateFields } from "./has_invalid_date_fields"
import { invalidateCollibraResource } from "./testing/invalidate_collibra_resource"

describe("hasInvalidDateFields", () => {
  let resource: Collibra.Resource

  beforeAll(() => {
    resource = {
      createdBy: randomUUID(),
      createdOn: Date.now(),
      id: randomUUID(),
      lastModifiedBy: randomUUID(),
      lastModifiedOn: Date.now(),
      resourceType: "Asset",
      system: false,
    }
  })

  it("returns left path for invalid date fields", () => {
    pipe(
      E.of(resource),
      E.map(invalidateCollibraResource),
      E.chain(hasInvalidDateFields),
      E.match(
        (err) => expect(err).toBe("Invalid date(s) in field(s) createdOn, lastModifiedOn"),
        () => {}
      )
    )
  })

  it("returns right path for valid date fields", () => {
    pipe(
      E.of(resource),
      E.chain(hasInvalidDateFields),
      E.match(
        () => {},
        (r) => expect(r).toEqual(resource)
      )
    )
  })
})
