import { Maintainer, User } from "@equinor/data-marketplace-models"

import {
  ResponsibilityGroupUser,
  ResponsibilityRole,
  ResponsibilityUser,
} from "../../GetMaintainersTrigger/lib/getResponsibilities"

type Responsibility = {
  user: ResponsibilityUser | ResponsibilityGroupUser
  role: ResponsibilityRole
}

const isGroupUser = (user: object): user is ResponsibilityGroupUser => "groupUserId" in user

export const maintainerAdapter = (responsibility: Responsibility): Maintainer => {
  const user: User = {
    createdAt: new Date(),
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    updatedAt: new Date(),
  }

  if (isGroupUser(responsibility.user)) {
    Object.assign(user, {
      createdAt: new Date(responsibility.user.groupUserCreatedAt),
      email: responsibility.user.groupUserEmail?.toLowerCase(),
      firstName: responsibility.user.groupUserFirstName,
      id: responsibility.user.groupUserId,
      lastName: responsibility.user.groupUserLastName,
      updatedAt: new Date(responsibility.user.groupUserUpdatedAt),
    } as User)
  } else {
    Object.assign(user, {
      createdAt: new Date(responsibility.user.userCreatedAt),
      email: responsibility.user.userEmail?.toLowerCase(),
      firstName: responsibility.user.userFirstName,
      id: responsibility.user.userId,
      lastName: responsibility.user.userLastName,
      updatedAt: new Date(responsibility.user.userUpdatedAt),
    } as User)
  }

  return {
    ...user,
    role: {
      createdAt: new Date(responsibility.role.roleCreatedAt),
      id: responsibility.role.roleId,
      name: responsibility.role.roleName,
      updatedAt: new Date(responsibility.role.roleUpdatedAt),
    },
  }
}
