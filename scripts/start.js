#!/usr/bin/env node

const { spawn } = require("node:child_process")
const { resolve } = require("node:path")

const { config } = require("../dist/config")

const simplePlurilize = (word, count = 1) => (count > 1 ? word + "s" : word)

const missingVars = Object.entries(config)
  .map(([name, value]) => (!value ? name : null))
  .filter(Boolean)

if (missingVars.length > 0) {
  console.error(
    `\x1b[1;31mERROR Missing required enviroment ${simplePlurilize("variable", missingVars.length)}: ${missingVars.join(
      ", "
    )}\x1b[0m`
  )
  process.exit(1)
} else {
  spawn(resolve(__dirname, "../node_modules/.bin/azurefunctions"), ["start"], { stdio: "inherit" })
}
