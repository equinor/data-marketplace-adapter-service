import { RequesterFn } from "./make_collibra_client"

export const getAssetAttributes: RequesterFn<Collibra.Attribute[]> = (client) => async (id: string) => {
  const {
    data: { results },
  } = await client.get<Collibra.PagedAttributeResponse>(`/attributes`, {
    params: {
      assetId: id,
    },
  })

  return results
}
