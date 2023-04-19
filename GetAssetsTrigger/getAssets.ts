import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Post } from "../lib/net/post"

type OutputModuleResponse = {
  assets: (Collibra.OutputModuleAsset & {
    responsibilities: {
      users: {
        userId?: string
        firstName?: string
        lastName?: string
      }[]
      groups: {
        groupId: string
        groupName: string
        groupMembers: {
          memberId: string
          memberFirstName: string
          memberLastName: string
        }[]
      }[]
      roles: {
        roleId: string
        roleName: string
      }[]
    }[]
  })[]
}

export const getAssets = (client: Net.Client) =>
  pipe(
    TE.tryCatch(
      () =>
        Post<Collibra.OutputModuleResponse<OutputModuleResponse>>(client)("/outputModule/export/json", {
          headers: {
            "content-type": "application/json",
          },
          params: new URLSearchParams({ validationEnabled: "true" }),
          body: {
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
                  Responsibility: {
                    name: "responsibilities",
                    User: {
                      name: "users",
                      Id: { name: "userId" },
                      FirstName: { name: "firstName" },
                      LastName: { name: "lastName" },
                    },
                    Group: {
                      name: "group",
                      Id: { name: "groupId" },
                      GroupName: { name: "groupName" },
                      User: {
                        name: "groupMembers",
                        Id: { name: "memberId" },
                        FirstName: { name: "memberFirstName" },
                        LastName: { name: "memberLastName" },
                      },
                    },
                    Role: {
                      name: "role",
                      Id: { name: "roleId" },
                      Signifier: { name: "roleName" },
                    },
                    Filter: {
                      AND: [
                        {
                          Field: {
                            name: "roleName",
                            operator: "IN",
                            values: ["Data Steward", "Technical Steward"],
                          },
                        },
                      ],
                    },
                  },
                  Filter: {
                    AND: [
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
          },
        }),
      E.toError
    ),
    TE.map((res) => res.view.assets)
  )
