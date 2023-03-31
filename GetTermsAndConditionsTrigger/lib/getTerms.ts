import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Post } from "../../lib/net/post"

export type TermsAsset = {
  targetAssetId: string
  targetAssetName: string
  targetAssetCreatedAt: string
  targetAssetUpdatedAt: string
  targetAssetTypes: {
    targetAssetTypeName: string
  }[]
  targetAssetAttributes: {
    targetAssetAttributeId: string
    targetAssetAttributeValue: string
    targetAssetAttributeTypes: {
      targetAssetAttributeTypeName: string
      targetAssetAttributeTypeCreatedAt: number
      targetAssetAttributeTypeUpdatedAt: number
    }[]
  }[]
}

export type TermsResponse = Collibra.OutputModuleResponse<{
  assets: {
    id: string
    relations: {
      targetAssets: TermsAsset[]
    }[]
  }[]
}>

const getQuery = (assetId: string) => ({
  ViewConfig: {
    Resources: {
      Asset: {
        name: "assets",
        Id: { name: "id" },
        Relation: {
          name: "relations",
          type: "SOURCE",
          TargetAsset: {
            name: "targetAssets",
            Id: { name: "targetAssetId" },
            DisplayName: { name: "targetAssetName" },
            CreatedOn: { name: "targetAssetCreatedAt" },
            LastModified: { name: "targetAssetUpdatedAt" },
            AssetType: {
              name: "targetAssetTypes",
              Signifier: { name: "targetAssetTypeName" },
            },
            StringAttribute: {
              name: "targetAssetAttributes",
              LongExpression: { name: "targetAssetAttributeValue" },
              AttributeType: {
                name: "targetAssetAttributeTypes",
                Id: { name: "targetAssetAttributeId" },
                Name: { name: "targetAssetAttributeTypeName" },
                CreatedOn: { name: "targetAssetAttributeTypeCreatedAt" },
                LastModified: { name: "targetAssetAttributeTypeUpdatedAt" },
              },
              Filter: {
                Field: {
                  name: "targetAssetAttributeTypeName",
                  operator: "IN",
                  values: ["Description", "Terms and Conditions", "Authorization URL"],
                },
              },
            },
          },
          Filter: {
            Field: {
              name: "targetAssetTypeName",
              operator: "EQUALS",
              value: "Rights-to-Use",
            },
          },
        },
        Filter: {
          Field: {
            name: "id",
            operator: "EQUALS",
            value: encodeURIComponent(assetId),
          },
        },
      },
    },
  },
})

export const getTerms = (client: Net.Client) => (assetId: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Post<TermsResponse>(client)("/outputModule/export/json", {
          params: new URLSearchParams({ validationEnabled: "true" }),
          headers: { "content-type": "application/json" },
          body: getQuery(assetId),
        }),
      E.toError
    ),
    TE.map((res) => res.view.assets[0])
  )
