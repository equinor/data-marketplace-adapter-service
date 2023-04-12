import { deserializeImage } from "./deserializers/image"
import { deserializeTable } from "./deserializers/table"

// TODO: remove empty tags
export const rules = [
  {
    deserialize(el: HTMLElement, next: any, block: any) {
      switch (el.tagName) {
        case "TABLE":
          return deserializeTable(el, next, block)
        case "IMG":
          return deserializeImage(el, next, block)
        default:
          return next()
      }
    },
  },
]
