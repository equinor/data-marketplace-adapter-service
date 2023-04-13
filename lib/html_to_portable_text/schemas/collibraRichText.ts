import { Schema } from "@sanity/schema"

export const collibraRichText = Schema.compile({
  name: "collibraRichText",
  types: [
    {
      type: "object",
      name: "content",
      fields: [
        {
          title: "Body",
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
})
