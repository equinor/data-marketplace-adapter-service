import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { assetAdapter } from "../lib/collibra/asset_adapter"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getAssetByID } from "../lib/collibra/client/get_asset_by_id"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { determineAssetStatus } from "../lib/collibra/determine_asset_status"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetError } from "../lib/net/to_net_err"

/**
 * @openapi
 * /api/assets/{id}:
 *   get:
 *     summary: Get an Asset by a given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *           description: A valid UUID for the Asset.
 *     responses:
 *       200:
 *         description: Returns an Asset given a valid UUID.
 *       404:
 *         description: The Asset could not be found.
 */
const GetAssetTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { id } = context.bindingData
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)

  const res = await pipe(
    getAssetByID(collibraClient)(id),
    TE.bindTo("collibraAsset"),
    TE.bind("approvedStatus", () => getStatusByName(collibraClient)("Approved")),
    TE.bind("approvedAsset", ({ approvedStatus, collibraAsset }) =>
      pipe(
        TE.fromEither(determineAssetStatus(approvedStatus.name as string)(collibraAsset)),
        TE.mapLeft(() => toNetError(403)("This asset is not approved"))
      )
    ),
    TE.bind("collibraAttributes", () => getAssetAttributes(collibraClient)(id)),
    TE.map(({ approvedAsset, collibraAttributes }) =>
      assetAdapter({ ...approvedAsset, attributes: collibraAttributes })
    ),
    TE.match(
      (err) => {
        logger.error(err)
        return makeResult<Asset, NetError>(err.status ?? 500, err)
      },
      (collibraAsset) => makeResult<Asset, NetError>(200, collibraAsset)
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
