const shouldSnakeCase = (str = "") => {
  let hasLower = false
  let hasUpper = false
  let hasUnderscore = false

  const chars = str.split("")
  for (let i = 0; i < chars.length; i++) {
    if (hasLower && hasUpper && hasUnderscore) break

    const char = chars[i]

    if (!hasLower && char.toLowerCase() === char) hasLower = true
    if (!hasUpper && char.toUpperCase() === char) hasUpper = true
    if (!hasUnderscore && char === "_") hasUnderscore = true
  }

  if (hasUnderscore) return false
  return hasLower && hasUpper
}

exports.shouldSnakeCase = shouldSnakeCase
