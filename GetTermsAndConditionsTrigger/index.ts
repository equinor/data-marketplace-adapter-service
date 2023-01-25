import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { RightsToUse } from "@equinor/data-marketplace-models"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getRightsToUseAsset } from "../lib/collibra/client/get_rights_to_use_asset"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { rightsToUseAdapter } from "../lib/collibra/rights_to_use_adapter"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

/**
 * @openapi
 * /api/assets/{id}/terms:
 *   get:
 *     summary: Get the Terms and Conditions for an Asset.
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
 *         description: Returns Terms and Conditions for an Asset.
 *       404:
 *         description: Asset was not found or the Asset doesn't have Terms and Conditions.
 */

const GetTermsAndConditionTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)

  const { id } = context.bindingData

  const res = await pipe(
    getRightsToUseAsset(collibraClient)(id),
    TE.bindTo("collibraRtuAsset"),
    TE.bind("collibraRtuAttrs", ({ collibraRtuAsset }) => getAssetAttributes(collibraClient)(collibraRtuAsset.id)),
    TE.map(({ collibraRtuAsset, collibraRtuAttrs }) =>
      rightsToUseAdapter({ ...collibraRtuAsset, attributes: collibraRtuAttrs })
    ),
    TE.match(
      (err) => {
        logger.error(err)
        return makeResult<RightsToUse, NetError>(err.status ?? 500, err)
      },
      (asset) => makeResult<RightsToUse, NetError>(200, asset)
    )
  )()

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetTermsAndConditionTrigger
