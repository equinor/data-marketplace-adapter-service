import type { RightsToUse } from "@equinor/data-marketplace-models"
import type { Attribute } from "@equinor/data-marketplace-models/types/Attribute"

import { TermsAsset } from "../../GetTermsAndConditionsTrigger/lib/getTerms"
import { htmlToPortableText } from "../html_to_portable_text"

export const rightsToUseAdapter = (asset: TermsAsset): RightsToUse => {
  const emptyAttr: Attribute = {
    id: "",
    createdAt: Number.NaN,
    updatedAt: Number.NaN,
    value: "",
    name: "",
  }

  const descriptionAttr = asset.targetAssetAttributes.find(
    (attr) => attr.targetAssetAttributeTypes[0].targetAssetAttributeTypeName === "Description"
  )
  const authURLattr = asset.targetAssetAttributes.find(
    (attr) => attr.targetAssetAttributeTypes[0].targetAssetAttributeTypeName === "Authorization URL"
  )
  const termsAttr = asset.targetAssetAttributes.find(
    (attr) => attr.targetAssetAttributeTypes[0].targetAssetAttributeTypeName === "Terms and Conditions"
  )

  return {
    id: asset.targetAssetId,
    name: asset.targetAssetName?.trim() as string,
    createdAt: new Date(asset.targetAssetCreatedAt),
    updatedAt: new Date(asset.targetAssetUpdatedAt),
    description: descriptionAttr ? htmlToPortableText(descriptionAttr.targetAssetAttributeValue) : [],
    authURL: authURLattr
      ? {
          createdAt: new Date(authURLattr.targetAssetAttributeTypes[0].targetAssetAttributeTypeCreatedAt),
          id: authURLattr.targetAssetAttributeId,
          name: authURLattr.targetAssetAttributeTypes[0].targetAssetAttributeTypeName,
          updatedAt: new Date(authURLattr.targetAssetAttributeTypes[0].targetAssetAttributeTypeUpdatedAt),
          value: authURLattr.targetAssetAttributeValue ?? "",
        }
      : emptyAttr,
    terms: termsAttr
      ? {
          createdAt: new Date(termsAttr.targetAssetAttributeTypes[0].targetAssetAttributeTypeCreatedAt),
          id: termsAttr.targetAssetAttributeId,
          name: termsAttr.targetAssetAttributeTypes[0].targetAssetAttributeTypeName,
          updatedAt: new Date(termsAttr.targetAssetAttributeTypes[0].targetAssetAttributeTypeUpdatedAt),
          value: termsAttr ? htmlToPortableText(termsAttr.targetAssetAttributeValue) : [],
        }
      : emptyAttr,
  }
}
