import { NetError } from "./NetError"

export const toNetErr = (status: number) => (message: string) => new NetError(message, status)
