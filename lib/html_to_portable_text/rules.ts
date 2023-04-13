import type { DeserializerRule } from "@sanity/block-tools"

import { getRandomBlockKey } from "./get_random_block_key"

export function isElement(node: Node): node is Element {
  return node.nodeType === 1
}

const deserializeTableRows = (el: HTMLTableSectionElement, cellType: string) => {
  return Array.from(el.children).map((row) => {
    const cells = Array.from(row.children).map((cell) => ({
      _type: cellType,
      text: cell.textContent,
      _key: getRandomBlockKey(),
    }))

    return {
      _type: "tr",
      cells,
      _key: getRandomBlockKey(),
    }
  })
}

export const rules: DeserializerRule[] = [
  {
    deserialize(el, _next, block) {
      if (!isElement(el) || el.tagName.toLowerCase() !== "img") {
        return undefined
      }
      return block({
        _type: "image",
        src: el.getAttribute("src"),
        alt: el.getAttribute("alt"),
        height: el.getAttribute("height"),
        width: el.getAttribute("width"),
      })
    },
  },
  {
    deserialize(el, _next, block) {
      if (!isElement(el) || el.tagName.toLowerCase() !== "table") {
        return undefined
      }
      const thead = el.getElementsByTagName("thead")[0]
      const tbody = el.getElementsByTagName("tbody")[0]

      const headerRow = thead && deserializeTableRows(thead as HTMLTableSectionElement, "th")
      const rows = tbody && deserializeTableRows(tbody as HTMLTableSectionElement, "td")

      return block({
        _type: "table",
        _key: getRandomBlockKey(),
        headerRow,
        rows,
      })
    },
  },
]
