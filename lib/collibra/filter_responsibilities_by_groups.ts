import * as A from "fp-ts/Array"
import * as E from "fp-ts/Either"
import { Predicate } from "fp-ts/Predicate"

type CurriedPredicate<A, B> = (a: A) => Predicate<B>

const filterPredicate: CurriedPredicate<string[], Collibra.Responsibility> = (groups) => (responsibility) =>
  groups.length > 0
    ? groups.includes(responsibility.role.name) && responsibility.owner.resourceType === "User"
    : responsibility.owner.resourceType === "User"

export const filterResponsibilitiesByGroups =
  (groups: string[]) =>
  (responsibilities: Collibra.Responsibility[]): E.Either<Error, Collibra.Responsibility[]> => {
    const filtered = A.filter(filterPredicate(groups))(responsibilities)

    return filtered.length === 0
      ? E.left(new Error(`No responsibilities found in group(s) ${groups.join(", ")}`))
      : E.right(filtered)
  }
