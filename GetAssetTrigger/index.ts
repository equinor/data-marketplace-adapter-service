import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { assetAdapter } from "../lib/collibra/asset_adapter"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

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
    TE.match<AxiosError, Net.Result<Asset, AxiosError>, Asset>(
      (err) => makeResult<Asset, AxiosError>(err.response?.status ?? 500, err),
      (collibraAsset) => makeResult<Asset, AxiosError>(200, collibraAsset)
    )
  )()

  context.res = {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetAssetTrigger
