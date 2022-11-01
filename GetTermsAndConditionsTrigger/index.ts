import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"
import { config } from "../config"
import { htmlToPortableText } from "../lib/html_to_portable_text"

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

  const rtu = {
    id: relationsFromSource.results[0].target.id,
    createdAt: new Date(asset.createdOn),
    updatedAt: new Date(asset.lastModifiedOn),
    description: "",
    authURL: {},
    terms: {},
  }

  const descriptionAttr = htmlToPortableText(
    attributes.find((attr) => attr.type.name.toLowerCase() === "description").value
  )
  if (descriptionAttr) {
    rtu.description = descriptionAttr
  }

  const authURLAttr = attributes.find((attr) => attr.type.name.toLowerCase() === "authorization url")
  if (authURLAttr) {
    rtu.authURL = {
      id: authURLAttr.id,
      value: authURLAttr.value,
    }
  }

  const termsAttr = attributes.find((attr) => attr.type.name.toLowerCase() === "terms and conditions")
  if (termsAttr) {
    rtu.terms = {
      id: termsAttr.id,
      value: htmlToPortableText(termsAttr.value),
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
