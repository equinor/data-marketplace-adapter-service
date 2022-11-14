import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosError } from "axios"
import { config } from "../config"

const GetPopularAssets: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)
  const offset = 0
  if (!limit) {
    console.log("[GetPopularAsset] Invalid limit param", req.query.limit)
    context.res = {
      status: 400,
    }
    return
  }
  try {
    const { data: approvedStatus } = await axios.get<Collibra.Status>(
      `${config.COLLIBRA_BASE_URL}/statuses/name/Approved`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
      }
    )

    const { data: dataProductType } = await axios.get<{ results: Collibra.AssetType }>(
      `${config.COLLIBRA_BASE_URL}/assetTypes`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
        params: { name: "data product" },
      }
    )
    const dataProductTypeId = dataProductType.results[0]?.id
    if (dataProductTypeId === "undefined") {
      return context.res.status(500)
    }

    const { data: mostViewedStats } = await axios.get<{ results: Collibra.NavigationStatistic[] }>(
      `${config.COLLIBRA_BASE_URL}/navigation/most_viewed`,
      {
        headers: {
          authorization: req.headers.authorization,
        },
        params: { offset: offset, limit, isGuestExcluded: true },
      }
    )

    const popularAssets = await Promise.all(
      mostViewedStats.results.map(async (item) => {
        const asset = await axios.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${item.assetId}`, {
          headers: {
            authorization: req.headers.authorization,
          },
          params: {
            statusIds: approvedStatus.id,
            typeIds: dataProductTypeId,
          },
        })
        return {
          ...asset.data,
          numberOfViews: item.numberOfViews,
        }
      })
    )
    context.res = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(popularAssets),
    }
  } catch (e) {
    context.res = {
      status: (e as AxiosError).response.status ?? 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: e.message }),
    }
  }
}

export default GetPopularAssets
