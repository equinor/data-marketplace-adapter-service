/* eslint-disable @typescript-eslint/no-empty-function */
import { Logger } from "../logger"

export const stubbedLogger = jest.fn<Logger, unknown[]>(() => ({
  error: () => {},
  info: () => {},
  warn: () => {},
}))
