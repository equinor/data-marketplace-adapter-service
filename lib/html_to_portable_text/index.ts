import type { PortableTextBlock } from "@portabletext/types"
import { htmlToBlocks } from "@sanity/block-tools"

import { htmlStringToDom } from "../html_string_to_dom"
import { sanitizeHtml } from "../sanitize_html"

import { rules } from "./rules"
import { collibraRichText } from "./schemas/collibraRichText"

export const htmlToPortableText = (html: string): PortableTextBlock[] =>
  htmlToBlocks(html, collibraRichText.get("content").fields.find((field) => field.name === "body").type, {
    rules,
    parseHtml: (html: string) => htmlStringToDom(sanitizeHtml(html)),
  })
