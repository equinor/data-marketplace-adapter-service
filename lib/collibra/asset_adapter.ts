import type { Asset } from "@equinor/data-marketplace-models"
import { toPlainText } from "@portabletext/toolkit"

import { htmlToPortableText } from "../html_to_portable_text"

const ATTRIBUTE_NAMES = ["additional information", "description", "timeliness"]

const isEmpty = (value?: string) => {
  return !value || !value.replace("--", "") || !toPlainText(htmlToPortableText(value)).replace("--", "").trim()
}

export const assetAdapter = (asset: Collibra.Asset & { attributes: Collibra.Attribute[] }): Asset => {
  const attrs = asset.attributes.reduce((map, attr) => {
    if (attr.type.name.toLowerCase() in map || !ATTRIBUTE_NAMES.includes(attr.type.name.toLowerCase())) {
      return map
    }

    return {
      ...map,
      [attr.type.name.toLowerCase()]: attr,
    }
  }, {} as Record<string, Collibra.Attribute>)

  return {
    createdAt: new Date(asset.createdOn),
    excerpt: !isEmpty(attrs.description?.value) ? htmlToPortableText(attrs.description.value) : null,
    description: !isEmpty(attrs["additional information"]?.value)
      ? htmlToPortableText(attrs["additional information"].value)
      : null,
    id: asset.id,
    name: asset.name,
    provider: {
      id: "",
      name: "Collibra",
    },
    qualityScore: 0,
    rating: 0,
    tags: [],
    type: {
      id: asset.type.id,
      name: asset.type.name,
    },
    updatedAt: new Date(asset.lastModifiedOn),
    updateFrequency: !isEmpty(attrs.timeliness?.value) ? htmlToPortableText(attrs.timeliness.value) : null,
  }
}
