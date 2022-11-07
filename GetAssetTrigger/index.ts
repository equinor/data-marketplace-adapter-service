import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { AxiosError } from "axios"

import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { assetAdapter } from "../lib/collibra/asset_adapter"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"

const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { id } = context.bindingData
  const collibraClient = makeCollibraClient({ headers: { authorization: req.headers.authorization } })

  try {
    const collibraAsset = await collibraClient(getAssetByID)(id)
    const collibraAttrs = await collibraClient(getAssetAttributes)(id)

    const asset = assetAdapter({ ...collibraAsset, attributes: collibraAttrs })

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
