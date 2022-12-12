export const isErrorResult = (v: Net.Result<unknown, Error>) => {
  return v.status >= 400 && v.value instanceof Error
}
