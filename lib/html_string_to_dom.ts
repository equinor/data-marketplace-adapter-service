import { JSDOM } from "jsdom"

export const htmlStringToDom = (html: string) => new JSDOM(html).window.document
