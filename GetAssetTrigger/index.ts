import * as TE from "fp-ts/TaskEither"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { pipe } from "fp-ts/function"
import { assetAdapter } from "../lib/collibra/asset_adapter"
import { AxiosError } from "axios"
import { Asset } from "@equinor/data-marketplace-models"

const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { id } = context.bindingData
  const collibraClient = makeCollibraClient({ headers: { authorization: req.headers.authorization } })

  const res = await pipe(
    getAssetByID(collibraClient)(id),
    TE.bindTo("collibraAsset"),
    TE.bind("collibraAttributes", () => getAssetAttributes(collibraClient)(id)),
    TE.map(({ collibraAsset, collibraAttributes }) =>
      assetAdapter({ ...collibraAsset, attributes: collibraAttributes })
    ),
    TE.match<AxiosError, Net.Result<Asset>, Asset>(
      (err: AxiosError) => ({
        status: err.response.status,
        statusText: err.response.statusText,
        error: err.message,
        value: null,
      }),
      (collibraAsset) => ({
        status: 200,
        statusText: "OK",
        error: null,
        value: collibraAsset,
      })
    )
  )()

  context.res = {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(res.error ? { error: res.error } : res.value),
  }
}

export default GetAssetTrigger
