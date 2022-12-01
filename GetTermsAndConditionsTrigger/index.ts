import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import type { RightsToUse } from "@equinor/data-marketplace-models"
import type { AxiosError } from "axios"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getRightsToUseAsset } from "../lib/collibra/client/get_rights_to_use_asset"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { rightsToUseAdapter } from "../lib/collibra/rights_to_use_adapter"
import { makeLogger } from "../lib/logger"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"

const GetTermsAndConditionTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = makeCollibraClient(req.headers.authorization)(logger)

  const { id } = context.bindingData

  const res = await pipe(
    getRightsToUseAsset(collibraClient)(id),
    TE.bindTo("collibraRtuAsset"),
    TE.bind("collibraRtuAttrs", ({ collibraRtuAsset }) => getAssetAttributes(collibraClient)(collibraRtuAsset.id)),
    TE.map(({ collibraRtuAsset, collibraRtuAttrs }) =>
      rightsToUseAdapter({ ...collibraRtuAsset, attributes: collibraRtuAttrs })
    ),
    TE.match<AxiosError, Net.Result<RightsToUse, AxiosError>, RightsToUse>(
      (err) => {
        logger.error(err)
        return makeResult<RightsToUse, AxiosError>(err.response?.status ?? 500, err)
      },
      (asset) => makeResult<RightsToUse, AxiosError>(200, asset)
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
