import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { getAssetTypeByName } from "../lib/collibra/client/get_asset_type_by_name"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { AssetWithViews, getMostViewedDataProducts } from "../lib/collibra/get_most_viewed_data_products"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetErr } from "../lib/net/to_net_err"

/**
 * @openapi
 * /api/lists/popular:
 *   get:
 *     summary: Get a list of the most viewed Assets.
 *     description: Get a list of the most viewed Assets, limited by the `limit` parameter (defaults to 10). Not paginated.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           description: Limit the number of assets returned.
 *     responses:
 *       200:
 *         description: Returns a list of the most viewed Assets.
 */

const GetPopularAssets: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)

  const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit)

  const res = await pipe(
    getStatusByName(collibraClient)("Approved"),
    TE.bindTo("approvedStatus"),
    TE.bind("dataProductType", () => getAssetTypeByName(collibraClient)("Data Product")),
    TE.chain(({ approvedStatus, dataProductType }) =>
      TE.tryCatch(
        () => getMostViewedDataProducts(collibraClient)([], limit, 0, approvedStatus.id, dataProductType.id),
        (err: any) => toNetErr(err.response.status ?? 500)(err.message)
      )
    ),
    TE.map((assets) => assets.sort((a, b) => (a.views > b.views ? -1 : 1))),
    TE.match(
      (err) => {
        console.error("[GetPopularAssets]", err)
        return makeResult<AssetWithViews[], NetError>(err.status ?? 500, err)
      },
      (assets) => makeResult<AssetWithViews[], NetError>(200, assets)
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

export default GetPopularAssets
