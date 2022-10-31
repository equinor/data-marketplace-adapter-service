import { getRandomBlockKey } from "../get_rnd_block_key"

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

export const deserializeTable = (el: HTMLElement, next: any, block: any) => {
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
}
