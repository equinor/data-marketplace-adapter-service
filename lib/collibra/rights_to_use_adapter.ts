import { RightsToUse } from "@equinor/data-marketplace-models"
import { htmlToPortableText } from "../html_to_portable_text"

export const rightsToUseAdapter = (asset: Collibra.AssetWithAttributes): RightsToUse => {
  const descriptionAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "description")

  const authURLattr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "authorization url")
  let authURL: RightsToUse["authURL"] = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    value: "",
    name: "",
  }

  if (authURLattr) {
    authURL = {
      ...authURL,
      id: authURLattr.id,
      createdAt: new Date(authURLattr.createdOn),
      updatedAt: new Date(authURLattr.lastModifiedOn),
      value: htmlToPortableText(authURLattr.value),
    }
  }

  const termsAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "terms and conditions")
  let terms: RightsToUse["terms"] = {
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    value: "",
    name: "",
  }

  if (termsAttr) {
    terms = {
      ...terms,
      id: termsAttr.id,
      createdAt: new Date(termsAttr.createdOn),
      updatedAt: new Date(termsAttr.lastModifiedOn),
      value: htmlToPortableText(termsAttr.value),
    }
  }

  return {
    id: asset.id,
    name: asset.name.trim(),
    createdAt: new Date(asset.createdOn),
    updatedAt: new Date(asset.lastModifiedOn),
    description: descriptionAttr ? htmlToPortableText(descriptionAttr.value) : [],
    authURL,
    terms,
  }
}
