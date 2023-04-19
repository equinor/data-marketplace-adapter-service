import type { Asset } from "@equinor/data-marketplace-models"
import { toPlainText } from "@portabletext/toolkit"

import { htmlToPortableText } from "../html_to_portable_text"

const isEmpty = (value?: string) => {
  return (
    !value ||
    !value.trim() ||
    !value.replace("--", "") ||
    !toPlainText(htmlToPortableText(value)).replace("--", "").trim()
  )
}

export const assetAdapter = (asset: Collibra.OutputModuleAsset): Asset => {
  const community = asset.domains[0]?.communities[0]

  const attributes = asset.attributes.reduce((obj, attr) => {
    const attributeName = attr.attributeType[0]?.attributeTypeName
    if (!attributeName) return obj
    return attributeName in obj ? obj : { ...obj, [attributeName]: attr.attributeValue }
  }, {} as Record<string, string>)

  const assetType = asset.assetTypes[0]

  return {
    community: {
      id: community.communityId ?? "",
      name: community.communityName ?? "",
    },
    createdAt: asset.createdAt,
    description: isEmpty(attributes["Additional Information"])
      ? []
      : htmlToPortableText(attributes["Additional Information"]),
    id: asset.id,
    name: asset.name,
    provider: { id: "", name: "Collibra" },
    qualityScore: 0.0,
    rating: 0.0,
    type: {
      id: assetType?.assetTypeId ?? "",
      name: assetType?.assetTypeName ?? "",
    },
    updatedAt: asset.updatedAt,
    updateFrequency: isEmpty(attributes.Timeliness) ? [] : htmlToPortableText(attributes.Timeliness),
    excerpt: isEmpty(attributes.Description) ? [] : htmlToPortableText(attributes.Description),
  }
}
