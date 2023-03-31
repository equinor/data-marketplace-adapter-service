import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/function"

import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { htmlToPortableText } from "../lib/html_to_portable_text"
import { isValidID } from "../lib/isValidID"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetError } from "../lib/net/to_net_err"

import { getAsset } from "./lib/getAsset"

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
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)(logger)

  const res = await pipe(
    context.bindingData.id,
    isValidID,
    E.mapLeft(toNetError(400)),
    TE.fromEither,
    TE.chain(getAsset(collibraClient)),
    TE.mapLeft(toNetError(500)),
    TE.map(
      (asset) =>
        ({
          community: {
            id: asset.domains[0].communities[0].communityId,
            name: asset.domains[0].communities[0].communityName,
          },
          createdAt: asset.createdAt,
          description: htmlToPortableText(
            asset.attributes.find((attr) => attr.attributeType[0]?.attributeTypeName === "Additional Information")
              ?.attributeValue ?? ""
          ),
          id: asset.id,
          name: asset.name,
          provider: { id: "", name: "Collibra" },
          qualityScore: 0.0,
          rating: 0.0,
          type: {
            id: asset.assetTypes[0]?.assetTypeId ?? "",
            name: asset.assetTypes[0]?.assetTypeName ?? "",
          },
          updatedAt: asset.updatedAt,
          updateFrequency: htmlToPortableText(
            asset.attributes.find((attr) => attr.attributeType[0]?.attributeTypeName === "Timeliness")
              ?.attributeValue ?? ""
          ),
          excerpt: htmlToPortableText(
            asset.attributes.find((attr) => attr.attributeType[0]?.attributeTypeName === "Description")
              ?.attributeValue ?? ""
          ),
        } as Asset)
    ),
    TE.match(
      (err) => makeResult<Asset, NetError>(err.status ?? 500, err),
      (assets) => makeResult<Asset, NetError>(200, assets)
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
