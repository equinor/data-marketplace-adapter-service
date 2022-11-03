import { RequesterFn } from "./make_collibra_client"

export const getRightsToUseAsset: RequesterFn<Collibra.Asset> = (client) => async (id: string) => {
  const {
    data: {
      results: [relationType],
    },
  } = await client.get<Collibra.PagedRelationTypeResponse>(`/relationTypes`, {
    params: {
      sourceTypeName: "data product",
      targetTypeName: "rights-to-use",
    },
  })

  const {
    data: {
      results: [relation],
    },
  } = await client.get<Collibra.PagedRelationResponse>(`/relations`, {
    params: {
      relationTypeId: relationType.id,
      sourceId: id,
    },
  })

  const { data: asset } = await client.get<Collibra.Asset>(`/assets/${relation.target.id}`)

  return asset
}
