import { AzureFunction, Context } from "@azure/functions"
import JSDoc from "swagger-jsdoc"

const swaggerJsdoc: AzureFunction = async function (context: Context): Promise<void> {
  const options: JSDoc.OAS3Options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Data MarketPlace API",
        version: "1.0.0",
      },
    },
    apis: [
      "./GetAssets/index.ts",
      "./GetAssetTrigger/index.ts",
      "./GetMaintainersTrigger/index.ts",
      "./GetPopularAssetTrigger/index.ts",
      "./GetTermsAndConditionsTrigger/index.ts",
    ],
  }

  context.res = {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSDoc(options),
  }
}

export default swaggerJsdoc
