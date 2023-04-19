import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Post } from "../../lib/net/post"

type OutputModuleResponse = Collibra.OutputModuleResponse<{
  assets: Collibra.OutputModuleAsset[]
}>

const getQuery = (id: string) => ({
  ViewConfig: {
    Resources: {
      Asset: {
        name: "assets",
        Id: { name: "id" },
        CreatedOn: { name: "createdAt" },
        LastModified: { name: "updatedAt" },
        DisplayName: { name: "name" },
        AssetType: {
          name: "assetTypes",
          Id: { name: "assetTypeId" },
          Name: { name: "assetTypeName" },
        },
        Status: {
          name: "status",
          Id: { name: "statusId" },
          Signifier: { name: "statusName" },
        },
        StringAttribute: {
          name: "attributes",
          Id: { name: "attributeId" },
          LongExpression: { name: "attributeValue" },
          AttributeType: {
            name: "attributeType",
            Id: { name: "attributeTypeId" },
            Name: { name: "attributeTypeName" },
          },
          Filter: {
            Field: {
              name: "attributeTypeName",
              operator: "IN",
              values: ["Description", "Additional Information", "Timeliness"],
            },
          },
        },
        Domain: {
          name: "domains",
          Id: { name: "domainId" },
          Name: { name: "domainName" },
          Community: {
            name: "communities",
            Id: { name: "communityId" },
            Name: { name: "communityName" },
          },
        },
        Tag: {
          name: "tags",
          Id: { name: "tagId" },
          Name: { name: "tagName" },
        },
        Filter: {
          AND: [
            {
              Field: {
                name: "id",
                operator: "EQUALS",
                value: encodeURIComponent(id),
              },
            },
            {
              Field: {
                name: "assetTypeName",
                operator: "EQUALS",
                value: "Data Product",
              },
            },
            {
              Field: {
                name: "statusName",
                operator: "EQUALS",
                value: "Approved",
              },
            },
          ],
        },
      },
    },
  },
})

export const getAsset = (client: Net.Client) => (id: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Post<OutputModuleResponse>(client)(`/outputModule/export/json`, {
          headers: { "content-type": "application/json" },
          body: getQuery(id),
        }),
      E.toError
    ),
    TE.map((res) => res.view.assets[0])
  )
