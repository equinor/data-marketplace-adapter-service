#!/usr/bin/env node

const { spawn } = require("node:child_process")
const { resolve } = require("node:path")

const { AppConfigurationClient } = require("@azure/app-configuration")

const { getMissingEnvVars } = require("./lib/get_missing_env_vars")

const CONNECTION_STRING = process.env.AZURE_APP_CONFIG_CONNECTION_STRING

if (!CONNECTION_STRING) {
  console.error("\x1b[1;31mERROR: Missing required enviroment variable: AZURE_APP_CONFIG_CONNECTION_STRING\x1b[0m")
  process.exit(1)
}

const simplePlurilize = (word, count = 1) => (count > 1 ? word + "s" : word)

const main = async () => {
  const appConfigClient = new AppConfigurationClient(process.env.AZURE_APP_CONFIG_CONNECTION_STRING)

  console.log("INFO: Getting app configuration")
  const appConfig = appConfigClient.listConfigurationSettings()

  for await (const setting of appConfig) {
    process.env[setting.key] = setting.value
  }

  // required at this point so that config is evaluated
  // after writing to process.env
  const { config } = require("../dist/config")

  const missingVars = getMissingEnvVars(config)

  if (missingVars.length > 0) {
    console.error(
      `\x1b[1;31mERROR Missing required enviroment ${simplePlurilize(
        "variable",
        missingVars.length
      )}: ${missingVars.join(", ")}\x1b[0m`
    )
    process.exit(1)
  } else {
    spawn(resolve(__dirname, "../node_modules/.bin/azurefunctions"), ["start"], { stdio: "inherit" })
  }
}

main()
