import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"
import { config } from "../config"
import { htmlToPortableText } from "../lib/html_to_portable_text"
import type { RightsToUse } from "@equinor/data-marketplace-models"
import type { PortableTextBlock } from "@portabletext/types"

const GetTermsAndConditionTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { data: relationTypeIDs } = await axios.get(`${config.COLLIBRA_BASE_URL}/relationTypes`, {
    headers: { authorization: req.headers.authorization },
    params: {
      sourceTypeName: "data product",
      targetTypeName: "rights-to-use",
    },
  })

  const { data: relationsFromSource } = await axios.get(`${config.COLLIBRA_BASE_URL}/relations`, {
    headers: { authorization: req.headers.authorization },
    params: {
      relationTypeId: relationTypeIDs.results[0].id,
      sourceId: context.bindingData.id,
    },
  })

  const { data: asset } = await axios.get(
    `${config.COLLIBRA_BASE_URL}/assets/${relationsFromSource.results[0].target.id}`,
    {
      headers: { authorization: req.headers.authorization },
    }
  )

  const {
    data: { results: attributes },
  } = await axios.get(`${config.COLLIBRA_BASE_URL}/attributes`, {
    headers: { authorization: req.headers.authorization },
    params: { assetId: asset.id },
  })

  const rtu: RightsToUse = {
    id: asset.id,
    name: asset.name.trim(),
    createdAt: new Date(asset.createdOn),
    updatedAt: new Date(asset.lastModifiedOn),
    description: [],
    authURL: {
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      value: "",
      name: "",
    },
    terms: {
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      value: "",
      name: "",
    },
  }

  const descriptionAttr = attributes.find((attr) => attr.type.name.toLowerCase() === "description").value
  if (descriptionAttr) {
    rtu.description = htmlToPortableText(descriptionAttr)
  }

  const authURLAttr = attributes.find((attr) => attr.type.name.toLowerCase() === "authorization url")
  if (authURLAttr) {
    rtu.authURL = {
      ...rtu.authURL,
      id: authURLAttr.id,
      value: authURLAttr.value as string,
      createdAt: new Date(authURLAttr.createdOn),
      updatedAt: new Date(authURLAttr.lastModifiedOn),
    }
  }

  const termsAttr = attributes.find((attr) => attr.type.name.toLowerCase() === "terms and conditions")
  if (termsAttr) {
    rtu.terms = {
      ...rtu.terms,
      id: termsAttr.id,
      value: htmlToPortableText(termsAttr.value),
      createdAt: new Date(termsAttr.createdOn),
      updatedAt: new Date(termsAttr.lastModifiedOn),
    }
  }

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rtu),
  }
}

export default GetTermsAndConditionTrigger
