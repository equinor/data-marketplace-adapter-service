import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import * as A from "fp-ts/Array"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { assetAdapter } from "../lib/collibra/asset_adapter"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getAssetTags } from "../lib/collibra/client/get_asset_tags"
import { getAssetTypeByName } from "../lib/collibra/client/get_asset_type_by_name"
import { getAssets } from "../lib/collibra/client/get_assets"
import { getCommunityByDomainID } from "../lib/collibra/client/get_community_by_domainid"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

/**
 * @openapi
 * /api/assets
 * get:
 *  summary: Get all Assets
 *  parameters:
 *    - in: query
 *      name: limit
 *      schema:
 *        type: integer
 *        default: 100
 *        description: Limit the number of assets returned.
 *    - in: query
 *      name: offset
 *      schema:
 *        type: integer
 *        default: 0
 *        description: Cursor for the current page of results. To get the next page of results, set the offest to 100 if the limit is 100 (which it is by default).
 */
const GetAssetsTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)()

  const { limit, offset } = req.query

  const res = await pipe(
    getStatusByName(collibraClient)("Approved"),
    TE.bindTo("approvedStatus"),
    TE.bind("dataProductType", () => getAssetTypeByName(collibraClient)("Data Product")),
    TE.bind("assets", ({ approvedStatus, dataProductType }) =>
      getAssets(collibraClient)(
        new URLSearchParams({
          statusIds: approvedStatus.id,
          typeIds: dataProductType.id,
          limit: limit ?? "100",
          offset: offset ?? "0",
        })
      )
    ),
    TE.chain(({ assets }) =>
      pipe(
        assets,
        A.map((asset) =>
          pipe(
            getAssetAttributes(collibraClient)(asset.id),
            TE.bindTo("attributes"),
            TE.bind("community", () => getCommunityByDomainID(collibraClient)(asset.domain.id)),
            TE.bind("tags", () => getAssetTags(collibraClient)(asset.id)),
            TE.map(({ attributes, community, tags }) => assetAdapter(attributes)(community)(tags)(asset))
          )
        ),
        TE.sequenceArray
      )
    ),
    TE.match(
      (err) => {
        logger.error(err)
        return makeResult<readonly Asset[], NetError>(err.status ?? 500, err)
      },
      (assets) => makeResult<readonly Asset[], NetError>(200, assets)
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

export default GetAssetsTrigger
