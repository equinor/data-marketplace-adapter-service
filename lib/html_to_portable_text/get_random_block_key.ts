import crypto from "crypto"

export const getRandomBlockKey = (l = 16): string => {
  const _l = Math.floor(l / 2)
  return crypto.randomBytes(_l + (_l % 2)).toString("hex")
}
