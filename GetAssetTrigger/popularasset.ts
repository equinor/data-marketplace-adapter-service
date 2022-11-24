import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { assetAdapter } from "../lib/collibra/asset_adapter"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { getMostViewed } from "../lib/collibra/client/get_most_viewed"
import { getProductType } from "../lib/collibra/client/get_product_type"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeResult } from "../lib/net/make_result"

const GetPopularAssets: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const collibraClient = makeCollibraClient({
    headers: { authorization: req.headers.authorization },
  })

  const { id } = context.bindingData
  const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit)
  const offset = 0

  const res = await pipe(
    getStatusByName(collibraClient)("Approved"),
    TE.bindTo("approvedStatus"),
    TE.bind("dataProductType", () => getProductType(collibraClient)("Data Product")),
    // make next line recursive
    TE.bind("navStat", () => getMostViewed(collibraClient)(limit, offset)),
    TE.bind("assets", ({ navStat }) =>
      pipe(
        navStat.map((stat) => getAssetByID(collibraClient)(stat.assetId)),
        TE.sequenceArray
      )
    ),

    TE.bind("attributes", ({ assets }) =>
      pipe(
        assets.map((asset) => getAssetAttributes(collibraClient)(asset.id)),
        TE.sequenceArray
      )
    ),

    TE.map(({ assets, attributes }) => assets.map((asset, i) => ({ ...asset, attributes: attributes[i] }))),
    TE.map((assets) => assets.map(assetAdapter)),
    TE.match<Error, Net.Result<Asset[], Error>, Asset[]>(
      (err) => makeResult<Asset[], Error>(500, err),
      (assets) => makeResult<Asset[], Error>(200, assets)
    )
  )
}

export default GetPopularAssets
