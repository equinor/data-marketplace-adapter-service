import { STATUS_CODES } from "http"

export class NetError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }

  public get stausText(): string {
    return STATUS_CODES[this.status] as string
  }
}
