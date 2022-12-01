export interface Logger {
  info(...args: any[]): void
  warn(...args: any[]): void
  error(...args: any[]): void
}

export const makeLogger = (ctx: Logger): Logger => ({
  info(...args) {
    ctx.info("INFO", ...args)
  },
  warn(...args) {
    ctx.warn("WARN", ...args)
  },
  error(...args) {
    ctx.error("ERROR", ...args)
  },
})
