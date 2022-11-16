import * as E from "fp-ts/Either"

import { isValidDate } from "./is_valid_date"

export const hasInvalidFields = <T = unknown>(v: T): E.Either<string[], T> => {
  const invalidDates = Object.entries(v).filter(([, v]) => v instanceof Date && E.isLeft(isValidDate(v)))
  return invalidDates.length > 0 ? E.left(invalidDates.map(([f]) => f)) : E.right(v)
}
