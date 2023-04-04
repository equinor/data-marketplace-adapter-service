import type { AzureFunction, Context, HttpRequest } from "@azure/functions"

import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeLogger } from "../lib/logger"
import { isErrorResult } from "../lib/net/is_error_result"

import { getMaintainersHandler } from "./lib/getMaintainersHandler"

/**
 * @openapi
 * /api/assets/{id}/maintainers:
 *   get:
 *     summary: Get Asset Maintainers.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *           required: true
 *           description: A valid UUID for the Asset.
 *       - in: query
 *         name: group
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           explode: true
 *           description: Name(s) of group(s) of Maintainers to filter by.
 *           example:
 *             - Data Steward
 *             - Technical Steward
 *     responses:
 *       200:
 *         description: Returns a list of Asset Maintainers (optionally filtered).
 */

const GetMaintainersTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)
  const roles: string[] = req.query.group?.split(",") ?? []

  const res = await getMaintainersHandler(collibraClient)(roles)(context.bindingData.id)()

  if (isErrorResult(res)) {
    logger.error("GetMaintainersTrigger failed:", res.value)
  }

  context.res = {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isErrorResult(res) ? { error: (res.value as Error).message } : res.value),
  }
}

export default GetMaintainersTrigger
