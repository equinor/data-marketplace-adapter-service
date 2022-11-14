import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

type RelationTypesResponse = AxiosResponse<Collibra.PagedRelationTypeResponse>
const getRelationTypes = (client: Net.Client) => () =>
  client.get<RelationTypesResponse>("/relationTypes", {
    params: new URLSearchParams({
      sourceTypeName: "data product",
      targetTypeName: "rights-to-use",
    }),
  })

type RelationsResponse = AxiosResponse<Collibra.PagedRelationResponse>
const getRelations = (client: Net.Client, relationTypeID: string, id: string) => () =>
  client.get<RelationsResponse>("/relations", {
    params: new URLSearchParams({
      relationTypeId: relationTypeID,
      sourceId: id,
    }),
  })

type AssetResponse = AxiosResponse<Collibra.Asset>
const getAsset = (client: Net.Client, id: string) => () => client.get<AssetResponse>(`/assets/${id}`)

export const getRightsToUseAsset = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(getRelationTypes(client), E.toError),
    TE.chain(({ data: relationTypesRes }) =>
      TE.tryCatch(getRelations(client, relationTypesRes.results[0].id, id), E.toError)
    ),
    TE.chain(({ data: relationsRes }) => TE.tryCatch(getAsset(client, relationsRes.results[0].target.id), E.toError)),
    TE.map(({ data }) => data)
  )
