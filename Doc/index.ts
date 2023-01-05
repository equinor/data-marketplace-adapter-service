import { AzureFunction, Context } from "@azure/functions"
import Jsdoc from "swagger-jsdoc"

const swaggerJsdoc: AzureFunction = async function (context: Context): Promise<void> {
  const options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Data MarketPlace API",
        version: "1.0.0",
      },
    },
    apis: [
      "./GetAssetTrigger/index.ts",
      "./GetMaintainersTrigger/index.ts",
      "./GetPopularAssetTrigger/index.ts",
      "./GetTermsAndConditionsTrigger/index.ts",
    ],
  }

  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: Jsdoc(options),
  }
}

export default swaggerJsdoc
