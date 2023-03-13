import { isAxiosError } from "axios"

import { NetError } from "./NetError"

export const isNetError = (err: unknown): err is NetError => err instanceof NetError

export const toNetError =
  (status?: number) =>
  (err: unknown): NetError => {
    if (isNetError(err)) return err

    if (isAxiosError(err)) {
      return new NetError(err.message, status || (err.response?.status ?? 500))
    }

    return new NetError(err instanceof Error ? err.message : String(err), status ?? 500)
  }
