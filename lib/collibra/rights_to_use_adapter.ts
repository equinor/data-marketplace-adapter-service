import type { RightsToUse } from "@equinor/data-marketplace-models"
import type { Attribute } from "@equinor/data-marketplace-models/types/Attribute"
import { htmlToPortableText } from "../html_to_portable_text"

export const rightsToUseAdapter = (asset: Collibra.AssetWithAttributes): RightsToUse => {
  const emptyAttr: Attribute = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    value: "",
    name: "",
  }

  const descriptionAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "description")
  const authURLattr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "authorization url")
  const termsAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "terms and conditions")

  return {
    id: asset.id,
    name: asset.name.trim(),
    createdAt: new Date(asset.createdOn),
    updatedAt: new Date(asset.lastModifiedOn),
    description: descriptionAttr ? htmlToPortableText(descriptionAttr.value) : [],
    authURL: authURLattr
      ? {
          createdAt: new Date(authURLattr.createdOn),
          id: authURLattr.id,
          name: "",
          updatedAt: new Date(authURLattr.lastModifiedOn),
          value: authURLattr.value as string,
        }
      : emptyAttr,
    terms: termsAttr
      ? {
          createdAt: new Date(termsAttr.createdOn),
          id: termsAttr.id,
          name: "",
          updatedAt: new Date(termsAttr.lastModifiedOn),
          value: termsAttr.value as string,
        }
      : emptyAttr,
  }
}
