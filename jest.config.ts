import type { JestConfigWithTsJest } from "ts-jest"

export default {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testMatch: ["**/*.@(spec|int|test).{j,t}s"],
  transform: {
    "\\.ts?$": [
      "ts-jest",
      {
        tsConfig: "./tsconfig.base.json",
        diagnostics: {
          /* this should suppress the warning that shows up
           * when running a test, but doesn't seem to work.
           * might be an issue with ts-jest, but not completely sure.
           * SEE https://github.com/kulshekhar/ts-jest/issues/1173
           * the suggested solution is to configure this in the `global` key,
           * but that's deprecated and yields another warning.
           */
          ignoreCodes: ["TS151001"],
        },
      },
    ],
  },
} as JestConfigWithTsJest
