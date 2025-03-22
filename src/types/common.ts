export type TErrorResponse = {
  message: string
  status_code: number
  stack?: string
  validation_error?: {
    fields: string[]
    details: {
      field: string
      message: string
      code: string
    }[]
  }
}
