import { htmlToBlocks } from "@sanity/block-tools"
import type { PortableTextBlock } from "@portabletext/types"

import { collibraRichText } from "./schemas/collibraRichText"
import { rules } from "./rules"
import { sanitizeHtml } from "../sanitize_html"
import { htmlStringToDom } from "../html_string_to_dom"

export const htmlToPortableText = (html: string): PortableTextBlock[] => {
  return htmlToBlocks(html, collibraRichText.get("content").fields.find((field) => field.name === "body").type, {
    rules,
    parseHtml: (html: string) => htmlStringToDom(sanitizeHtml(html)),
  })
}
