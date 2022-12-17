const getMissingEnvVars = (config = {}) => Object.keys(config).filter((key) => !config[key])

exports.getMissingEnvVars = getMissingEnvVars
