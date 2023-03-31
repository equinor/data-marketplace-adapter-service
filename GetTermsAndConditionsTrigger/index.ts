import type { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeLogger } from "../lib/logger"
import { isErrorResult } from "../lib/net/is_error_result"

import { getTermsHandler } from "./lib/getTermsHandler"

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

  const res = await getTermsHandler(collibraClient)(logger)(context.bindingData.id)()

  if (isErrorResult(res)) {
    logger.error("GetTermsAndConditionTrigger failed", (res.value as Error).message)
  }

  context.res = {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetTermsAndConditionTrigger
