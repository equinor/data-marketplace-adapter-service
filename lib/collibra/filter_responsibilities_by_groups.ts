import { none, some, type Option } from "fp-ts/Option"

export const filterResponsibilitiesByGroups = (
  gs: string[],
  rs: Collibra.Responsibility[]
): Option<readonly Collibra.Responsibility[]> => {
  const filtered = rs.filter((r) =>
    gs.length > 0 ? gs.includes(r.role.name) && r.owner.resourceType === "User" : r.owner.resourceType === "User"
  )
  return filtered.length === 0 ? none : some(filtered)
}
