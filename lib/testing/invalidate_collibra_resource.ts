type InvalidResource = Omit<Collibra.Resource, "createdOn" | "lastModifiedOn"> & {
  createdOn: string
  lastModifiedOn: string
}

export const invalidateCollibraResource = (entity: Collibra.Resource): InvalidResource => ({
  ...entity,
  createdOn: "Invalid date",
  lastModifiedOn: "Invalid date",
})
