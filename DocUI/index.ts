import { promises as fs } from "fs"

import { AzureFunction, Context } from "@azure/functions"
import { getAbsoluteFSPath } from "swagger-ui-dist"

const swaggerJsdocUI: AzureFunction = async function (context: Context): Promise<void> {
  let filename = context.bindingData.filename
  context.log("FILE: " + filename)
  filename = filename || "index.html"
  context.log("FILE2: " + filename)
  const body = await fs.readFile(getAbsoluteFSPath() + "/" + filename).then((file) => {
    if (filename === "swagger-initializer.js") {
      return file
        .toString()
        .replace('url: "https://petstore.swagger.io/v2/swagger.json"', 'url: window.origin + "/api/Doc"')
    }
    return file
  })

  context.res = {
    status: 200,
    headers: {},
    body: body,
  }
}

export default swaggerJsdocUI
