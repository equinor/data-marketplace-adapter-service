import { STATUS_CODES } from "http"

export class NetError extends Error {
  status: number
  cause: string

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }

  public get stausText(): string {
    return STATUS_CODES[this.status]
  }
}
