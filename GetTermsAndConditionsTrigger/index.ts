import { STATUS_CODES } from "http"

import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { RightsToUse } from "@equinor/data-marketplace-models"
import type { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getRightsToUseAsset } from "../lib/collibra/client/get_rights_to_use_asset"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { rightsToUseAdapter } from "../lib/collibra/rights_to_use_adapter"

const GetTermsAndConditionTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collibraClient = makeCollibraClient({
    headers: { authorization: req.headers.authorization },
  })

  const { id } = context.bindingData

  const res = await pipe(
    getRightsToUseAsset(collibraClient)(id),
    TE.bindTo("collibraRtuAsset"),
    TE.bind("collibraRtuAttrs", ({ collibraRtuAsset }) => getAssetAttributes(collibraClient)(collibraRtuAsset.id)),
    TE.map(({ collibraRtuAsset, collibraRtuAttrs }) =>
      rightsToUseAdapter({ ...collibraRtuAsset, attributes: collibraRtuAttrs })
    ),
    TE.match<AxiosError, Net.Result<RightsToUse>, RightsToUse>(
      (err) => ({
        error: err.message,
        status: err.response.status,
        statusText: err.response.statusText,
        value: null,
      }),
      (asset) => ({
        error: null,
        status: 200,
        statusText: STATUS_CODES[200],
        value: asset,
      })
    )
  )()

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(res.error ? { error: res.error } : res.value),
  }
}

export default GetTermsAndConditionTrigger
