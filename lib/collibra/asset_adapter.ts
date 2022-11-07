import type { Asset } from "@equinor/data-marketplace-models"
import { htmlToPortableText } from "../html_to_portable_text"

export const assetAdapter = (asset: Collibra.Asset & { attributes: Collibra.Attribute[] }): Asset => {
  const descriptionAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "description")
  const timelinessAttr = asset.attributes.find((attr) => attr.type.name.toLowerCase() === "timeliness")

  return {
    createdAt: new Date(asset.createdOn),
    description: descriptionAttr ? htmlToPortableText(descriptionAttr.value) : [],
    excerpt: [],
    id: asset.id,
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
    updateFrequency: timelinessAttr ? htmlToPortableText(timelinessAttr.value) : [],
  }
}
