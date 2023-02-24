import { AppConfigurationClient } from "@azure/app-configuration"

const appconfig = new AppConfigurationClient(process.env.AZURE_APP_CONFIG_CONNECTION_STRING!)

const CONFIG_MAP = Object.freeze({
  COLLIBRA_BASE_URL: appconfig.getConfigurationSetting({ key: "collibraBaseUrl" }),
})

export const getConfigValue = async (key: keyof typeof CONFIG_MAP) => (await CONFIG_MAP[key]).value
