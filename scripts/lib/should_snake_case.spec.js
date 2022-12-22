const { shouldSnakeCase } = require("./should_snake_case")

describe("shouldSnakeCase", () => {
  it("returns false for lowercase string", () => {
    expect(shouldSnakeCase("loremipsum")).toBe(false)
  })

  it("returns false for uppercase string", () => {
    expect(shouldSnakeCase("LOREMIPSUM")).toBe(false)
  })

  it("returns false for snake cased lowercase string", () => {
    expect(shouldSnakeCase("lorem_ipsum")).toBe(false)
  })

  it("returns false for snake cased uppercase string", () => {
    expect(shouldSnakeCase("LOREM_IPSUM")).toBe(false)
  })

  it("returns false for snake cased mixed case string", () => {
    expect(shouldSnakeCase("lOrEM_IpSuM")).toBe(false)
  })

  it("returns true for camel cased string", () => {
    expect(shouldSnakeCase("loremIpsum")).toBe(true)
  })

  it("returns true for pascal cased string", () => {
    expect(shouldSnakeCase("LoremIpsum")).toBe(true)
  })
})
