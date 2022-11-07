import xss from "xss"

export const sanitizeHtml = (html: string): string => xss(html)
