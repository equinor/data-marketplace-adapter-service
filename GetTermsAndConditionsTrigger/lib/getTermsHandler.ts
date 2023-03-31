import type { RightsToUse } from "@equinor/data-marketplace-models"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { rightsToUseAdapter } from "../../lib/adapters/rights_to_use_adapter"
import { isValidID } from "../../lib/isValidID"
import type { Logger } from "../../lib/logger"
import type { NetError } from "../../lib/net/NetError"
import { makeResult } from "../../lib/net/make_result"
import { toNetError } from "../../lib/net/to_net_err"

import { getTerms } from "./getTerms"

export const getTermsHandler = (client: Net.Client) => (_logger: Logger) => (assetId: string) =>
  pipe(
    assetId,
    isValidID,
    TE.fromEither,
    TE.mapLeft(toNetError(400)),
    TE.chain(getTerms(client)),
    TE.mapLeft(toNetError(500)),
    TE.map(TE.fromNullable("Unable to convert data from Collibra")),
    TE.flattenW,
    TE.map((asset) => rightsToUseAdapter(asset.relations[0].targetAssets[0])),
    TE.mapLeft(toNetError(500)),
    TE.match(
      (err) => makeResult<RightsToUse, NetError>(err.status ?? 500, err),
      (asset) => makeResult<RightsToUse, NetError>(200, asset)
    )
  )
