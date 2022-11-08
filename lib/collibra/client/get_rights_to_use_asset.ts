import * as TE from "fp-ts/TaskEither"
import * as E from "fp-ts/Either"
import { pipe } from "fp-ts/lib/function"
import { AxiosResponse } from "axios"

type RelationTypesResponse = AxiosResponse<Collibra.PagedRelationTypeResponse>
type RelationsResponse = AxiosResponse<Collibra.PagedRelationResponse>
type AssetResponse = AxiosResponse<Collibra.Asset>

export const getRightsToUseAsset = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        client.get<RelationTypesResponse>("/relationTypes", {
          params: new URLSearchParams({
            sourceTypeName: "data product",
            targetTypeName: "rights-to-use",
          }),
        }),
      E.toError
    ),
    TE.bindTo("relationTypesResponse"),
    TE.bind("relationsResponse", ({ relationTypesResponse }) =>
      TE.tryCatch(
        () =>
          client.get<RelationsResponse>("/relations", {
            params: new URLSearchParams({
              relationTypeId: relationTypesResponse.data.results[0].id,
              sourceId: id,
            }),
          }),
        E.toError
      )
    ),
    TE.bind("assetResponse", ({ relationsResponse }) =>
      TE.tryCatch(() => client.get<AssetResponse>(`/assets/${relationsResponse.data.results[0].target.id}`), E.toError)
    ),
    TE.map(({ assetResponse }) => assetResponse.data)
  )
