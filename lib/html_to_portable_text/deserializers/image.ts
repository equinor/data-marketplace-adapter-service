export const deserializeImage = (el: HTMLElement, _next: () => void, block: any) => {
  return block({
    _type: "image",
    src: el.getAttribute("src"),
    alt: el.getAttribute("alt"),
    height: el.getAttribute("height"),
    width: el.getAttribute("width"),
  })
}
