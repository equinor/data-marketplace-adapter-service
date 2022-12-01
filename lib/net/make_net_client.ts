import axios from "axios"
import { pipe } from "fp-ts/lib/function"

import { Logger } from "../logger"

const DEFAULT_REQUEST_OPTS: Net.RequestOpts = {
  method: "GET",
}

const trimLeadingSlash = (url: string) => (url[0] === "/" ? url.slice(1, url.length) : url)
const trimTrailingSlash = (url: string) => (url[url.length - 1] === "/" ? url.slice(0, url.length - 1) : url)
const trimLeftRightSlashes = (url: string) => pipe(url, trimLeadingSlash, trimTrailingSlash)

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

      logger.info(`[client.request] ${_opts.method} to ${_url.toString()}`)

      try {
        const { data } = await axios.request<T>({
          url: _url.toString(),
          headers: {
            ...cfg.headers,
            ...opts.headers,
          },
          method: opts.method,
          data: opts.body,
        })

        return data
      } catch (err) {
        logger.error(`[client.request] ${_opts.method} to ${_url.toString()} failed: ${err.message}`)
        throw err
      }
    },
  }
}
