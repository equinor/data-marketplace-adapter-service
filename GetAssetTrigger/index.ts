import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosError } from "axios"
import type { Asset } from "@equinor/data-marketplace-models"
import { config } from "../config"

const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { id } = context.bindingData

  try {
    const { data } = await axios.get(`${config.COLLIBRA_BASE_URL}/assets/${id}`, {
      headers: {
        authorization: req.headers.authorization,
      },
    })

    const asset: Asset = {
      createdAt: new Date(data.createdOn),
      description: "", // TODO: get description
      excerpt: "",
      id: data.id,
      provider: {
        id: "",
        name: "Collibra",
      },
      qualityScore: 0,
      rating: 0,
      tags: [],
      type: {
        id: data.type.id,
        name: data.type.name,
      },
      updatedAt: new Date(data.lastModifiedOn),
      updateFrequency: "", // TODO: get timeliness
    }

    context.res = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asset),
    }
  } catch (e) {
    const _e = e as AxiosError

    context.log(`Request to ${_e.config.url} failed with status code ${_e.response.status}`)
    context.log(_e.response.data)

    context.res = {
      status: _e.status ?? 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: _e.message,
      }),
    }
  }
}

export default GetAssetTrigger
