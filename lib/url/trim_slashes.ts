import { pipe } from "fp-ts/function"

export const trimLeadingSlash = (url: string) => (url[0] === "/" ? url.slice(1, url.length) : url)
export const trimTrailingSlash = (url: string) => (url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url)
export const trimLeftRightSlashes = (url: string) => pipe(url, trimLeadingSlash, trimTrailingSlash)
