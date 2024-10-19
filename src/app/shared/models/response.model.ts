export interface ResponseModel<T> {
  message: string,
  result: T,
  error: boolean
}
