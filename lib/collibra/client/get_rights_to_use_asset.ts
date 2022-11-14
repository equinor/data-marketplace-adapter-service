import { AxiosResponse } from "axios"
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import { pipe } from "fp-ts/lib/function"

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
    TE.chain(({ data }) =>
      TE.tryCatch(
        () =>
          client.get<RelationsResponse>("/relations", {
            params: new URLSearchParams({
              relationTypeId: data.results[0].id,
              sourceId: id,
            }),
          }),
        E.toError
      )
    ),
    TE.chain(({ data }) =>
      TE.tryCatch(() => client.get<AssetResponse>(`/assets/${data.results[0].target.id}`), E.toError)
    ),
    TE.map(({ data }) => data)
  )
