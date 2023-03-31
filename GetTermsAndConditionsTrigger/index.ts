import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { RightsToUse } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { rightsToUseAdapter } from "../lib/adapters/rights_to_use_adapter"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { isValidID } from "../lib/isValidID"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetError } from "../lib/net/to_net_err"

import { getTerms } from "./lib/getTerms"

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

  const res = await pipe(
    context.bindingData.id,
    isValidID,
    E.mapLeft(toNetError(400)),
    TE.fromEither,
    TE.chain(getTerms(collibraClient)),
    TE.mapLeft(toNetError(500)),
    TE.map((asset) => rightsToUseAdapter(asset.relations[0].targetAssets[0])),
    TE.mapLeft(toNetError(500)),
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
