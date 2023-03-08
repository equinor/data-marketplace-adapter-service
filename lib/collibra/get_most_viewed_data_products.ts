import { Asset } from "@equinor/data-marketplace-models"

import { Get } from "../net/get"

import { assetAdapter } from "./asset_adapter"

export type AssetWithViews = Asset & { views: number }

type NavStatsResponse = Collibra.PagedNavigationStatisticResponse
type AssetsResponse = Collibra.Asset
type AttributesResponse = Collibra.PagedAttributeResponse
type TagsResponse = Collibra.Tag[]
type DomainResponse = Collibra.Domain

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
    const stats = await Get<NavStatsResponse>(client)("/navigation/most_viewed", {
      params: new URLSearchParams({
        offset: String(offset * limit),
        limit: String(limit),
      }),
    })

    // for each navigation statistic,
    // get asset data
    const popularAssets = await Promise.all(
      stats.results.map((stat) => Get<AssetsResponse>(client)(`/assets/${stat.assetId}`))
    )

    // filter out unapproved assets
    // that are not data product types
    const approvedDataProducts = popularAssets.filter(
      (asset) => asset.status.id === approvedStatusID && asset.type.id === dataProductTypeID
    )

    // get attributes for approved data products
    const attributes = await Promise.all(
      approvedDataProducts.map((asset) =>
        Get<AttributesResponse>(client)("/attributes", {
          params: new URLSearchParams({ assetId: asset.id }),
        })
      )
    )

    const tags = await Promise.all(
      approvedDataProducts.map((asset) => Get<TagsResponse>(client)(`/tags/asset/${encodeURIComponent(asset.id)}`))
    )

    const domain = await Promise.all(
      approvedDataProducts.map((asset) => Get<DomainResponse>(client)(`/domains/${asset.domain.id}`))
    )

    // run assets through asset adapter
    const assetsWithViews: AssetWithViews[] = approvedDataProducts.map((asset, i) => ({
      ...assetAdapter(attributes[i].results)(domain[i].community)(tags[i])(asset),
      views: stats.results.find((stat) => stat.assetId === asset.id).numberOfViews ?? 0,
    }))

    const result = [...assets, ...assetsWithViews]

    return result.length >= limit
      ? result.slice(0, limit)
      : getMostViewedDataProducts(client)(result, limit, offset + 1, approvedStatusID, dataProductTypeID)
  }
