const camelCaseToSnakeCase = (str = "") => {
  return str
    .split("")
    .reduce((chars, char, i, original) => {
      return char.toUpperCase() !== original[i] || i === 0 ? [...chars, char] : [...chars, `_${char}`]
    }, [])
    .join("")
    .toLowerCase()
}

exports.camelCaseToSnakeCase = camelCaseToSnakeCase
