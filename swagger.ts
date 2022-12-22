import { generateOpenApi3_1Spec } from "@aaronpowell/azure-functions-nodejs-openapi"

export default generateOpenApi3_1Spec({
  info: {
    title: "API",
    version: "1.0.0",
  },
  components: {
    schemas: {
      Asset: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the asset",
          },
          description: {
            type: "string",
            description: "The description of the asset",
          },
          tags: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Tag",
            },
          },
        },
      },
    },
  },
})
