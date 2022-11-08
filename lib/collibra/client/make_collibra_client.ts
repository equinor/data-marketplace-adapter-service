import axios, { type Axios, CreateAxiosDefaults } from "axios"

import { config } from "../../../config"

export type RequesterFn<T> = (client: Axios) => (...args: any) => Promise<T>

type ClientConfig = Omit<CreateAxiosDefaults, "url" | "baseURL" | "adapter">

export const makeCollibraClient = (cfg: ClientConfig) => {
  return axios.create({
    ...cfg,
    baseURL: config.COLLIBRA_BASE_URL,
  })
}
