import { STATUS_CODES } from "http"

export const makeResult = <V, E extends Error>(status: number, value: V | E): Net.Result<V, E> => ({
  status,
  statusText: STATUS_CODES[status],
  value,
})
