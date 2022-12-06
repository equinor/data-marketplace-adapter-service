import { Asset } from "@equinor/data-marketplace-models"
import { AxiosResponse } from "axios"

import { assetAdapter } from "./asset_adapter"

export type AssetWithViews = Asset & { views: number }

type NavStatsResponse = AxiosResponse<Collibra.PagedNavigationStatisticResponse>
type AssetsResponse = AxiosResponse<Collibra.Asset>
type AttributesResponse = AxiosResponse<Collibra.PagedAttributeResponse>

// TODO: Refactor this to fp-ts
export const getMostViewedDataProducts =
  (client: Net.Client) =>
  async (
    assets: AssetWithViews[],
    limit: number,
    offset: number,
    approvedStatusID: string,
    dataProductTypeID: string
  ): Promise<AssetWithViews[]> => {
    // get navigation statistics
    // (this tells us which assets are the all time most viewed assets)
    const stats = await client.get<NavStatsResponse>("/navigation/most_viewed", {
      params: new URLSearchParams({
        offset: String(offset * limit),
        limit: String(limit),
      }),
    })

    // for each navigation statistic,
    // get asset data
    const popularAssets = await Promise.all(
      stats.data.results.map((stat) => client.get<AssetsResponse>(`/assets/${stat.assetId}`))
    )

    // filter out unapproved assets
    // that are not data product types
    const approvedDataProducts = popularAssets.filter(
      ({ data: asset }) => asset.status.id === approvedStatusID && asset.type.id === dataProductTypeID
    )

    // get attributes for approved data products
    const attributes = await Promise.all(
      approvedDataProducts.map(({ data: asset }) =>
        client.get<AttributesResponse>("/attributes", {
          params: new URLSearchParams({ assetId: asset.id }),
        })
      )
    )

    // run assets through asset adapter
    const assetsWithViews: AssetWithViews[] = approvedDataProducts.map(({ data: asset }, i) => ({
      ...assetAdapter({ ...asset, attributes: attributes[i].data.results }),
      views: stats.data.results.find((stat) => stat.assetId === asset.id).numberOfViews ?? 0,
    }))

    return assets.length >= limit
      ? assets.slice(0, limit)
      : getMostViewedDataProducts(client)(
          [...assets, ...assetsWithViews],
          limit,
          offset + 1,
          approvedStatusID,
          dataProductTypeID
        )
  }
