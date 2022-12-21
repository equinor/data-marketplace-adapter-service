export const config = Object.freeze({
  COLLIBRA_BASE_URL: process.env.COLLIBRA_BASE_URL ?? "",
  COLLIBRA_API_URL: process.env.COLLIBRA_BASE_URL ? `${process.env.COLLIBRA_BASE_URL}/rest/2.0` : "",
})
