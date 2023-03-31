import * as E from "fp-ts/lib/Either"
import validator from "validator"

export const isValidID = (id: string) => (!validator.isUUID(id) ? E.left("Invalid asset ID") : E.right(id))
