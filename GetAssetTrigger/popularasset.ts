/* eslint-disable */
import type { AzureFunction, Context, HttpRequest } from "@azure/functions"

import * as TE from "fp-ts/TaskEither"
import * as A from "fp-ts/Array"
import { pipe } from "fp-ts/lib/function"

import { getProductType } from "../lib/collibra/client/get_product_type"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { getMostViewed } from "../lib/collibra/client/get_most_viewed"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeResult } from "../lib/net/make_result"
import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { assetAdapter } from "../lib/collibra/asset_adapter"
import { AxiosError } from "axios"
import { Asset } from "@equinor/data-marketplace-models"

const GetPopularAssets: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collibraClient = makeCollibraClient({
    headers: { authorization: req.headers.authorization },
  })

  const { id } = context.bindingData
  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)
  const offset = 0

  const res = await pipe(
    getStatusByName(collibraClient)("Approved"),
  TE.bindTo("approvedStatus"),
  TE.bind("dataProductType", () => getProductType(collibraClient)("Data Product")),
  // make next line recursive
  TE.map(({ approvedStatus, dataProductType }) => getMostViewed(collibraClient)([], approvedStatus.id, dataProductType[0]?.id, limit, offset)),
  TE.sequenceArray,
  TE.bindTo("asset"),
  TE.map(({asset}) => pipe(
      getAssetByID(collibraClient)(asset.id),
      TE.bindTo("collibraAsset"),
  TE.bind("collibraAttributes", () => getAssetAttributes(collibraClient)(asset.id)),
      TE.map(({collibraAsset, collibraAttributes}) => assetAdapter({ ...collibraAsset, attributes: collibraAttributes}),
  ),
  TE.match<AxiosError, Net.Result<Asset, AxiosError>, Asset>(
      (err) => makeResult<Asset, AxiosError>(err.response?.status ?? 500, err),
      (collibraAsset) => makeResult<Asset, AxiosError>(200, collibraAsset),
  )
))),
) // eslint-disable-line
context.res = {   // eslint-disable-line
  status: res.status,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
}
}
export default GetPopularAssets
