import * as E from "fp-ts/lib/Either"
import * as TE from "fp-ts/lib/TaskEither"
import { pipe } from "fp-ts/lib/function"

import { Post } from "../../lib/net/post"

export type ResponsibilityUser = {
  userId: string
  userCreatedAt: number
  userUpdatedAt: number
  userEmail: string
  userFirstName: string
  userLastName: string
}

export type ResponsibilityGroupUser = {
  groupUserId: string
  groupUserCreatedAt: number
  groupUserUpdatedAt: number
  groupUserEmail: string
  groupUserFirstName: string
  groupUserLastName: string
}

export type ResponsibilityRole = {
  roleId: string
  roleCreatedAt: number
  roleUpdatedAt: number
  roleName: string
}

type ResponsibilitiesResponse = Collibra.OutputModuleResponse<{
  responsibilities: {
    users: ResponsibilityUser[]
    groups: {
      groupUsers: ResponsibilityGroupUser[]
    }[]
    roles: ResponsibilityRole[]
    assets: {
      assetId: string
    }[]
  }[]
}>

const getFilters = (assetId: string, roles: string[]) =>
  pipe(
    [
      {
        Field: {
          name: "assetId",
          operator: "EQUALS",
          value: encodeURIComponent(assetId),
        },
      },
    ],
    (f) =>
      roles?.length > 0
        ? [
            ...f,
            {
              Field: {
                name: "roleName",
                operator: "IN",
                values: roles,
              },
            },
          ]
        : f
  )

const getQuery = (assetId: string, roles: string[]) => ({
  ViewConfig: {
    Resources: {
      Responsibility: {
        name: "responsibilities",
        User: {
          name: "users",
          Id: { name: "userId" },
          CreatedOn: { name: "userCreatedAt" },
          LastModified: { name: "userUpdatedAt" },
          UserName: { name: "userEmail" },
          FirstName: { name: "userFirstName" },
          LastName: { name: "userLastName" },
        },
        Group: {
          name: "groups",
          User: {
            name: "groupUsers",
            Id: { name: "groupUserId" },
            CreatedOn: { name: "groupUserCreatedAt" },
            LastModified: { name: "groupUserUpdatedAt" },
            UserName: { name: "groupUserEmail" },
            FirstName: { name: "groupUserFirstName" },
            LastName: { name: "groupUserLastName" },
          },
        },
        Role: {
          name: "roles",
          Id: { name: "roleId" },
          CreatedOn: { name: "roleCreatedAt" },
          LastModified: { name: "roleUpdatedAt" },
          Signifier: { name: "roleName" },
        },
        Asset: {
          name: "assets",
          Id: { name: "assetId" },
        },
        Filter: {
          AND: getFilters(assetId, roles),
        },
      },
    },
  },
})

export const getResponsibilities = (client: Net.Client) => (roles: string[]) => (assetId: string) =>
  pipe(
    TE.tryCatch(
      () =>
        Post<ResponsibilitiesResponse>(client)("/outputModule/export/json", {
          params: new URLSearchParams({ enableValidation: "true" }),
          headers: { "content-type": "application/json" },
          body: getQuery(assetId, roles),
        }),
      E.toError
    ),
    TE.map((res) => res.view.responsibilities)
  )
