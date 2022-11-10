import { Context, HttpRequest } from "@azure/functions"
import axios, { AxiosError } from "axios"
import { config } from "../config"

const GetPopularAssets = async function (context: Context, req: HttpRequest): Promise<string> {
  const { data: mostViewedStats } = await axios.get<any[]>(`${config.COLLIBRA_BASE_URL}/navigation/most_viewed`, {
    headers: {
      authorization: req.headers.authorization,
    },
  })

  const popularAssets = (
    await Promise.all(
      mostViewedStats.map(
        async (item) =>
          await axios.get<any>(`${config.COLLIBRA_BASE_URL}/assets`, {
            headers: {
              authorization: req.headers.authorization,
            },
            params: {
              name: item.name,
            },
          })
      )
    )
  ).map((res) => res.data)

  return JSON.stringify(popularAssets)
}
