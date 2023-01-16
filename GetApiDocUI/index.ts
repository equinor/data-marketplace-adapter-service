import { promises as fs } from "fs"

import { AzureFunction, Context } from "@azure/functions"
import { getAbsoluteFSPath } from "swagger-ui-dist"

const swaggerJsdocUI: AzureFunction = async function (context: Context): Promise<void> {
  const { filename } = context.bindingData
  if (filename == null) {
    context.res = {
      headers: {
        location: `${context.req.url}${context.req.url.endsWith("/") ? "" : "/"}index.htm`,
      },
      status: 308,
    }
    return
  }

  const body = await fs.readFile(getAbsoluteFSPath() + "/" + filename).then((file) => {
    if (filename === "swagger-initializer.js") {
      return file
        .toString()
        .replace('url: "https://petstore.swagger.io/v2/swagger.json"', 'url: window.origin + "/api/docs/spec.json"')
    }
    return file
  })

  context.res = {
    headers: {},
    body: body,
  }
}

export default swaggerJsdocUI
