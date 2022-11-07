import { RequesterFn } from "./make_collibra_client"

export const getAssetByID: RequesterFn<Collibra.Asset> = (client) => async (id: string) => {
  const { data } = await client.get<Collibra.Asset>(`/assets/${id}`)
  return data
}
