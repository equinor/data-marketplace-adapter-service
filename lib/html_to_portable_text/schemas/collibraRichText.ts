import Schema from "@sanity/schema"

export const collibraRichText = Schema.compile({
  name: "collibraRichText",
  types: [
    {
      name: "content",
      type: "object",
      fields: [
        {
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
})
