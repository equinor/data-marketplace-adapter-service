import { HttpStatusCode } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Get } from "../../net/get"
import { toNetError } from "../../net/to_net_err"

const getRelationTypes = (client: Net.Client) => () =>
  Get<Collibra.PagedRelationTypeResponse>(client)("/relationTypes", {
    params: new URLSearchParams({
      sourceTypeName: "data product",
      targetTypeName: "rights-to-use",
    }),
  })

const getRelations = (client: Net.Client, relationTypeID: string, id: string) => () =>
  Get<Collibra.PagedRelationResponse>(client)("/relations", {
    params: new URLSearchParams({
      relationTypeId: relationTypeID,
      sourceId: id,
    }),
  })

const getAsset = (client: Net.Client, id: string) => () => Get<Collibra.Asset>(client)(`/assets/${id}`)

export const getRightsToUseAsset = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(getRelationTypes(client), E.toError),
    TE.chain(({ results }) => TE.tryCatch(getRelations(client, results[0].id, id), E.toError)),
    TE.chain(({ results }) => TE.tryCatch(getAsset(client, results[0].target.id), E.toError)),
    TE.mapLeft(toNetError(HttpStatusCode.InternalServerError))
  )
