import axios, { Axios, CreateAxiosDefaults } from "axios"
import { OutgoingHttpHeaders } from "http"
import { config } from "../../../config"

export type RequesterFn<T> = (client: Axios) => (...args: any) => Promise<T>

type ClientConfig = Omit<CreateAxiosDefaults, "url" | "baseURL" | "adapter">

export const makeCollibraClient = (cfg: ClientConfig) => {
  const client = axios.create({
    ...cfg,
    baseURL: config.COLLIBRA_BASE_URL,
  })

  return <T>(req: RequesterFn<T>) => req(client)
}
