import type { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Asset } from "@equinor/data-marketplace-models"
import { AxiosError } from "axios"
import * as A from "fp-ts/Array"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { assetAdapter } from "../lib/collibra/asset_adapter"
import { getAssetAttributes } from "../lib/collibra/client/get_asset_attributes"
import { getAssetTypeByName } from "../lib/collibra/client/get_asset_type_by_name"
import { getStatusByName } from "../lib/collibra/client/get_status_id"
import { makeCollibraClient } from "../lib/collibra/client/make_collibra_client"
import { makeLogger } from "../lib/logger"
import { NetError } from "../lib/net/NetError"
import { Get } from "../lib/net/get"
import { isErrorResult } from "../lib/net/is_error_result"
import { makeResult } from "../lib/net/make_result"
import { toNetErr } from "../lib/net/to_net_err"

const GetAssetsTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const logger = makeLogger(context.log)
  const collibraClient = await makeCollibraClient(req.headers.authorization)()

  const { limit, offset } = req.query

  const res = await pipe(
    getStatusByName(collibraClient)("Approved"),
    TE.bindTo("approvedStatus"),
    TE.bind("dataProductType", () => getAssetTypeByName(collibraClient)("Data Product")),
    TE.bind("assets", ({ approvedStatus, dataProductType }) =>
      TE.tryCatch(
        async () => {
          const { results: assets } = await Get<Collibra.PagedAssetResponse>(collibraClient)("/assets", {
            params: new URLSearchParams({
              statusIds: approvedStatus.id,
              typeIds: dataProductType.id,
              limit: limit ?? "100",
              offset: offset ?? "0",
            }),
          })
          return assets
        },
        (err: AxiosError) => toNetErr(err.response?.status ?? 500)(err.message)
      )
    ),
    TE.chain(({ assets }) =>
      pipe(
        assets,
        A.map((asset) =>
          pipe(
            getAssetAttributes(collibraClient)(asset.id),
            TE.map((attributes) => assetAdapter({ ...asset, attributes }))
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
