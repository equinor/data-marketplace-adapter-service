import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios, { AxiosError } from "axios"
import type { Asset } from "@equinor/data-marketplace-models"
import { config } from "../config"

const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { id } = context.bindingData

  try {
    const { data: collibraAsset } = await axios.get(`${config.COLLIBRA_BASE_URL}/assets/${id}`, {
      headers: {
        authorization: req.headers.authorization,
      },
    })

    const asset: Asset = {
      createdAt: new Date(collibraAsset.createdOn),
      description: "",
      excerpt: "",
      id: collibraAsset.id,
      provider: {
        id: "",
        name: "Collibra",
      },
      qualityScore: 0,
      rating: 0,
      tags: [],
      type: {
        id: collibraAsset.type.id,
        name: collibraAsset.type.name,
      },
      updatedAt: new Date(collibraAsset.lastModifiedOn),
      updateFrequency: "",
    }

    const { data: collibraAttrs } = await axios.get<{ results: any[] }>(`${config.COLLIBRA_BASE_URL}/attributes`, {
      headers: {
        authorization: req.headers.authorization,
      },
      params: {
        assetId: id,
      },
    })

    asset.description = collibraAttrs.results.find((attr) => attr.type.name === "Description")?.value ?? ""
    asset.updateFrequency = collibraAttrs.results.find((attr) => attr.type.name === "Timeliness").value ?? ""

    context.res = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asset),
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      context.log(`Request to ${e.config.url} failed with status code ${e.response.status}`)
      context.log(e.response.data)
    } else {
      context.log(e)
    }

    context.res = {
      status: e.response?.status ?? 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: e.message,
      }),
    }
  }
}

export default GetAssetTrigger