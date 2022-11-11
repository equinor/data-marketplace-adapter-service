import type { JestConfigWithTsJest } from "ts-jest"

export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.@(test|spec|int).{j,t}s"],
} as JestConfigWithTsJest
