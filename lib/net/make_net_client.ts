import axios from "axios"

import { Logger } from "../logger"
import { trimLeftRightSlashes, trimTrailingSlash } from "../url/trim_slashes"

const DEFAULT_REQUEST_OPTS: Net.RequestOpts = {
  method: "GET",
}

export const makeNetClient = (cfg: Net.ClientConfig, logger: Logger): Net.Client => {
  return {
    request: async <T>(url: string, opts?: Net.RequestOpts): Promise<T> => {
      const _baseURL = new URL(trimTrailingSlash(cfg.baseURL))
      const _url = new URL(
        trimLeftRightSlashes(url),
        `${trimTrailingSlash(_baseURL.href)}/` // just to guarantee that the url has a trailing slash
      )

      const _opts = {
        ...DEFAULT_REQUEST_OPTS,
        ...opts,
      }

      try {
        const { data, status, statusText, config } = await axios.request<T>({
          url: _url.toString(),
          headers: {
            ...cfg.headers,
            ...opts.headers,
          },
          method: opts.method,
          data: opts.body,
          params: opts.params,
        })

        logger.info(
          `[client.request] ${config.method} request to ${
            config.params ? `${config.url}?${config.params.toString()}` : config.url
          } responded with ${status} (${statusText})`
        )

        return data
      } catch (err) {
        logger.error(`[client.request] ${_opts.method} to ${_url.toString()} failed: ${err.message}`)
        throw err
      }
    },
  }
}
