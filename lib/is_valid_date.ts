import { Either, left, right } from "fp-ts/Either"

export const isValidDate = (date: Date): Either<string, Date> =>
  Number.isNaN(date.valueOf()) ? left("Invalid date") : right(date)
