import * as E from "fp-ts/Either"

import { isValidDate } from "./is_valid_date"
// eslint-disable-next-line @typescript-eslint/ban-types
export const hasInvalidDateFields = <T extends {}>(v: T): E.Either<string, T> => {
  const invalidDates = Object.entries(v).filter(([, v]) => v instanceof Date && E.isLeft(isValidDate(v)))
  return invalidDates.length > 0
    ? E.left(`Invalid date(s) in field(s) ${invalidDates.map(([f]) => f).join(", ")}`)
    : E.right(v)
}
