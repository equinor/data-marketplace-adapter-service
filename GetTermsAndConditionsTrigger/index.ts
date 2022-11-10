import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { AxiosError } from "axios"

import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getRightsToUseAsset } from "../lib/collibra/client/get_rights_to_use_asset"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { rightsToUseAdapter } from "../lib/collibra/rights_to_use_adapter"

const GetTermsAndConditionTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collibraClient = makeCollibraClient({
    headers: { authorization: req.headers.authorization },
  })
  const { id } = context.bindingData

  try {
    const asset = await collibraClient(getRightsToUseAsset)(id)
    const attributes = await collibraClient(getAssetAttributes)(asset.id)

    const rtu = rightsToUseAdapter({ ...asset, attributes })

    context.res = {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rtu),
    }
  } catch (e) {
    context.res = {
      status: (e as AxiosError).response.status ?? 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: e.message }),
    }
  }
}

export default GetTermsAndConditionTrigger
