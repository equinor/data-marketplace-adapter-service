import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { assetAdapter } from "../lib/adapters/asset_adapter"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetError } from "../lib/net/to_net_err"

import { getAssets } from "./getAssets"

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
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)

  // @TODO implement pagination
  // const { limit, offset } = req.query

  const res = await pipe(
    collibraClient,
    getAssets,
    TE.mapLeft(toNetError(500)),
    TE.map((assets) => assets.flatMap(assetAdapter)),
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
