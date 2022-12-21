const { camelCaseToSnakeCase } = require("./camel_case_to_snake_case")

describe("camelCaseToSnakeCase", () => {
  it("should return a snake cased string", () => {
    expect(camelCaseToSnakeCase("loremIpsumDolorSitAmet")).toBe("lorem_ipsum_dolor_sit_amet")
    expect(camelCaseToSnakeCase("LoremIpsumDolorSitAmet")).toBe("lorem_ipsum_dolor_sit_amet")
  })

  it("should return lowercased string", () => {
    expect(camelCaseToSnakeCase("loremipsum")).toBe("loremipsum")
  })
})
